"use client";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  restrictToFirstScrollableAncestor,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { useEffect, useState } from "react";
import Column from "./Column";
import TaskCard from "./Taskcard";
import { useTasks } from "@/app/store/useTasks";
import type { Task, Status } from "@/types";

const COLUMNS: Status[] = ["todo", "in_progress", "approved", "rejected"];

export default function Board() {
  const hasHydrated = useTasks((s) => s.hasHydrated);
  const initFromMock = useTasks((s) => s.initFromMock);
  const [active, setActive] = useState<Task | null>(null);

  // after hydration, if empty, seed from mock
  useEffect(() => {
    if (hasHydrated) initFromMock();
  }, [hasHydrated, initFromMock]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  if (!hasHydrated) {
    // optional skeleton to avoid hydration mismatch
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
      onDragStart={(e) => setActive(e?.active?.data?.current?.task ?? null)}
      onDragEnd={(e) => {
        const task = e.active?.data?.current?.task as Task | undefined;
        const overStatus = e.over?.data?.current?.status as Status | undefined;
        if (task && overStatus && task.status !== overStatus) {
          useTasks.getState().moveTask(task.id, overStatus);
        }
        setActive(null);
      }}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMNS.map((s) => (
          <Column key={s} status={s} />
        ))}
      </div>
      <DragOverlay>{active ? <TaskCard task={active} /> : null}</DragOverlay>
    </DndContext>
  );
}
