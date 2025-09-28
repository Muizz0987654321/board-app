// src/components/TaskCard.tsx
import type { Task } from "@/types";
import StatusPill from "@/app/components/ui/StatusPill";
import { MetaRow } from "@/app/components/ui/MetaRow";

export default function TaskCard({ task }: { task: Task }) {
  const p = task.meta?.priority;
  const tone = p === "high" ? "red" : p === "med" ? "amber" : "lime";
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] text-gray-400">Research</div>
        <button className="text-gray-300">⋯</button>
      </div>

      <div className="text-sm font-semibold text-gray-900">{task.title}</div>

      {p && (
        <div className="mt-2">
          <StatusPill tone={tone as any}>{p} </StatusPill>
        </div>
      )}

      {/* Preview block like the dark rectangle in the mock (optional) */}
      {/* <div className="mt-3 h-24 rounded-lg bg-gray-800/90" /> */}

      <MetaRow
        comments={task.meta?.comments ?? 0}
        views={task.meta?.views ?? 0}
        due="Tomorrow"
      />
    </div>
  );
}
