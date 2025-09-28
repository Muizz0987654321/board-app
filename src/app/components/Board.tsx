"use client";

import {
  DndContext,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin, // more stable for kanban
} from "@dnd-kit/core";
import Column from "./Column";
import TaskCard from "./Taskcard";
import { useTasks } from "@/app/store/useTasks";
import type { Status, Task, DragDataTask, DragDataColumn } from "@/types";
import { useEffect, useRef, useState } from "react";

const COLUMNS: Status[] = ["todo", "in_progress", "approved", "rejected"];

/* ---------- helpers: Jira-like placement ---------- */
function isBelowOverItem(e: DragOverEvent) {
  const a = e.active.rect.current.translated ?? e.active.rect.current;
  const o = e.over?.rect;
  if (!a || !o) return false;
  const activeCenterY = a.top + a.height / 2;
  const overCenterY = o.top + o.height / 2;
  return activeCenterY > overCenterY;
}

function topInsertIndex(e: DragOverEvent, listLength: number) {
  const a = e.active.rect.current.translated ?? e.active.rect.current;
  const o = e.over?.rect;
  if (!a || !o) return listLength;
  const topThreshold = o.top + o.height * 0.25; // top 25% zone
  const activeCenterY = a.top + a.height / 2;
  return activeCenterY < topThreshold ? 0 : listLength;
}

export default function Board() {
  const initFromMock = useTasks((s) => s.initFromMock);
  const hasHydrated = useTasks((s) => s.hasHydrated);
  const reorder = useTasks((s) => s.reorder);
  const moveDuringDrag = useTasks((s) => s.moveDuringDrag);
  const tasksByStatus = useTasks((s) => s.tasksByStatus);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // cache the last applied target to prevent oscillation loops
  const lastTargetRef = useRef<{
    id: string;
    to: Status;
    index: number;
  } | null>(null);

  useEffect(() => {
    if (hasHydrated) void initFromMock();
  }, [hasHydrated, initFromMock]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function onDragStart(e: DragStartEvent) {
    const data = e.active.data.current as
      | DragDataTask
      | DragDataColumn
      | undefined;
    setActiveTask(data && data.type === "task" ? data.task : null);
    lastTargetRef.current = null; // reset
  }

  /** Compute the intended (toStatus, normalizedIndex) for the current drag-over */
  function computeTarget(
    e: DragOverEvent
  ): { to: Status; index: number } | null {
    const activeData = e.active.data.current as DragDataTask | undefined;
    if (!activeData || activeData.type !== "task" || !e.over) return null;

    const overData = e.over.data.current as
      | DragDataTask
      | DragDataColumn
      | undefined;

    // Hovering a column area
    if (overData?.type === "column") {
      const to = e.over.id as Status;
      const index = topInsertIndex(
        e,
        useTasks.getState().tasksByStatus(to).length
      );
      return { to, index };
    }

    // Hovering a task
    if (overData?.type === "task") {
      const overTask = (overData as DragDataTask).task;
      const to = (overData as DragDataTask).container ?? overTask.status;
      let index = (e.over.data.current as any)?.sortable?.index ?? 0;
      if (isBelowOverItem(e)) index += 1;

      // compensate if dragging within same column
      const dragged = activeData.task;
      if (dragged.status === to) {
        const rendered = useTasks.getState().tasksByStatus(to);
        const fromIndex = rendered.findIndex((t) => t.id === dragged.id);
        if (fromIndex !== -1 && fromIndex < index) index -= 1;
      }
      return { to, index: Math.max(0, index) };
    }

    return null;
  }

  // Live, Jira-like reordering while hovering — with extra client-side debounce
  function onDragOver(e: DragOverEvent) {
    const activeData = e.active.data.current as DragDataTask | undefined;
    if (!activeData || activeData.type !== "task") return;

    const target = computeTarget(e);
    if (!target) return;

    const key = { id: activeData.task.id, to: target.to, index: target.index };

    // 🚦 Debounce: if target identical to last applied, skip updating the store
    const last = lastTargetRef.current;
    if (
      last &&
      last.id === key.id &&
      last.to === key.to &&
      last.index === key.index
    )
      return;

    lastTargetRef.current = key;
    moveDuringDrag(key.id, key.to, key.index);
  }

  // Finalize
  function onDragEnd(e: DragEndEvent) {
    const activeData = e.active.data.current as DragDataTask | undefined;
    if (!activeData || activeData.type !== "task") {
      setActiveTask(null);
      lastTargetRef.current = null;
      return;
    }

    // Prefer the last applied target to avoid recomputing at end-of-drag jitter
    const last = lastTargetRef.current;
    if (last && last.id === activeData.task.id) {
      reorder(last.id, last.to, last.index);
    } else {
      const target = computeTarget(e as unknown as DragOverEvent);
      if (target) reorder(activeData.task.id, target.to, target.index);
    }

    setActiveTask(null);
    lastTargetRef.current = null;
  }

  // (optional) also clear onDragCancel if you wire it

  if (!hasHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[520px] rounded-2xl border border-gray-200 bg-gray-50 p-3"
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      collisionDetection={pointerWithin}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((c) => (
          <Column key={c} status={c} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
