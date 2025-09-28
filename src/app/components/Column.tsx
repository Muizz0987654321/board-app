"use client";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./Taskcard";
import { useTasks } from "@/app/store/useTasks";
import type { Status, Task, DragDataTask, DragDataColumn } from "@/types";
import { useMemo } from "react";

/* ------------------------- Draggable card ------------------------- */
function DraggableCard({ task, container }: { task: Task; container: Status }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task, container } as DragDataTask,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

/* ------------------------- Column labels ------------------------- */
const LABELS: Record<Status, { title: string; chip: string }> = {
  todo: { title: "To Do", chip: "bg-gray-100 text-gray-700" },
  in_progress: { title: "In Progress", chip: "bg-amber-100 text-amber-700" },
  approved: { title: "Approved", chip: "bg-lime-100 text-lime-700" },
  rejected: { title: "Reject", chip: "bg-rose-100 text-rose-700" },
};

/* ------------------------- Column ------------------------- */
export default function Column({ status }: { status: Status }) {
  const allTasks = useTasks((s) => s.tasks);
  const columns = useTasks((s) => s.columns);
  const query = useTasks((s) => s.query);

  // derive ordered & filtered tasks for this column
  const tasks = useMemo(() => {
    const map = new Map(allTasks.map((t) => [t.id, t]));
    const ordered = (columns[status] ?? [])
      .map((id) => map.get(id)!)
      .filter(Boolean);

    const q = query.trim().toLowerCase();
    if (!q) return ordered;

    return ordered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description ?? "").toLowerCase().includes(q) ||
        (t.tags ?? []).some((x) => x.toLowerCase().includes(q))
    );
  }, [allTasks, columns, query, status]);

  // Make the WHOLE column droppable (better for cross-column moves)
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status } as DragDataColumn,
  });

  // keep items array stable for SortableContext
  const itemIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[520px] w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 transition-shadow ${
        isOver ? "ring-2 ring-blue-400" : ""
      }`}
      aria-label={`${LABELS[status].title} column`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{LABELS[status].title}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${LABELS[status].chip}`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* List */}
      <SortableContext
        id={status}
        items={itemIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {tasks.length === 0 ? (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/50 py-10 text-xs text-gray-500">
              Drop tasks here
            </div>
          ) : (
            tasks.map((t) => (
              <DraggableCard key={t.id} task={t} container={status} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
