import type { Task } from "@/types";
import { clsx } from "clsx";

export default function TaskCard({ task }: { task: Task }) {
  const p = task.meta?.priority;
  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
      aria-label={task.title}
    >
      <div className="mb-1 text-sm font-medium text-gray-900">{task.title}</div>
      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      )}
      {p && (
        <span
          className={clsx(
            "mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
            p === "high" && "bg-red-100 text-red-700",
            p === "med" && "bg-yellow-100 text-yellow-700",
            p === "low" && "bg-green-100 text-green-700"
          )}
        >
          {p} priority
        </span>
      )}
    </div>
  );
}
