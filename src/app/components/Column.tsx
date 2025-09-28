// Column.tsx
"use client";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./Taskcard";
import { useTasks } from "@/app/store/useTasks";
import type { Status, Task } from "@/types";
import { useMemo } from "react";

function filterTasks(tasks: Task[], query: string, status: Status) {
  const q = query.trim().toLowerCase();
  const base = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? "").toLowerCase().includes(q) ||
          (t.tags ?? []).some((x) => x.toLowerCase().includes(q))
      )
    : tasks;
  return base.filter((t) => t.status === status);
}

function DraggableCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { type: "task", task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

const LABELS: Record<Status, { title: string; chip: string }> = {
  todo: { title: "To Do", chip: "bg-gray-100 text-gray-700" },
  in_progress: { title: "In Progress", chip: "bg-amber-100 text-amber-700" },
  approved: { title: "Approved", chip: "bg-lime-100 text-lime-700" },
  rejected: { title: "Reject", chip: "bg-rose-100 text-rose-700" },
};

export default function Column({ status }: { status: Status }) {
  // Subscribe to stable slices only
  const tasksAll = useTasks((s) => s.tasks);
  const query = useTasks((s) => s.query);

  // Derive the list memoized
  const tasks = useMemo(
    () => filterTasks(tasksAll, query, status),
    [tasksAll, query, status]
  );

  return (
    <div className="flex h-full min-h-[520px] w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
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

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
          {tasks.map((t) => (
            <DraggableCard key={t.id} task={t} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
