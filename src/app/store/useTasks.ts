"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, Status, ColumnsMap } from "@/types";

type State = {
  tasks: Task[];
  columns: ColumnsMap;
  query: string;

  hasHydrated: boolean;
  setHydrated: (v: boolean) => void;

  initFromMock: () => Promise<void>;
  setQuery: (q: string) => void;

  // helpers
  getPosition: (id: string) => { status: Status; index: number } | null;

  // finalize on drop
  reorder: (id: string, to: Status, index: number) => void;

  // live move during drag
  moveDuringDrag: (id: string, to: Status, index: number) => void;

  tasksByStatus: (s: Status) => Task[];
};

function buildColumns(tasks: Task[]): ColumnsMap {
  return {
    todo:        tasks.filter(t => t.status === "todo").map(t => t.id),
    in_progress: tasks.filter(t => t.status === "in_progress").map(t => t.id),
    approved:    tasks.filter(t => t.status === "approved").map(t => t.id),
    rejected:    tasks.filter(t => t.status === "rejected").map(t => t.id),
  };
}

export const useTasks = create<State>()(
  persist(
    (set, get) => ({
      tasks: [],
      columns: { todo: [], in_progress: [], approved: [], rejected: [] },
      query: "",

      hasHydrated: false,
      setHydrated: (v) => set({ hasHydrated: v }),

      async initFromMock() {
        if (get().tasks.length) return;
        const res = await fetch("/tasks.json", { cache: "no-store" });
        const txt = await res.text();
        const clean = txt.replace(/^\uFEFF/, "");
        if (/^\s*</.test(clean)) {
          console.error("Expected JSON from /tasks.json but received HTML (check /public).");
          return;
        }
        const data = JSON.parse(clean) as Task[];
        set({ tasks: data, columns: buildColumns(data) });
      },

      setQuery(q) {
        set({ query: q });
      },

      // 🔎 Current (status, index) of a task from columns
      getPosition(id) {
        const cols = get().columns;
        for (const status of Object.keys(cols) as Status[]) {
          const idx = (cols[status] ?? []).indexOf(id);
          if (idx !== -1) return { status, index: idx };
        }
        return null;
      },

      // ✅ immutable, de-duped reorder
      reorder(id, to, index) {
        set((state) => {
          const exists = state.tasks.some(t => t.id === id);
          if (!exists) return state;

          // Read current spot
          const current = (() => {
            for (const key of Object.keys(state.columns) as Status[]) {
              const i = (state.columns[key] ?? []).indexOf(id);
              if (i !== -1) return { status: key, index: i };
            }
            // fallback: find from task
            const task = state.tasks.find(t => t.id === id)!;
            return { status: task.status, index: -1 };
          })();

          // Build destination list *without* the id (so we can compute the real target index)
          const destRaw = state.columns[to] ?? [];
          const dest = destRaw.filter(x => x !== id);
          const clamped = Math.max(0, Math.min(index, dest.length));

          // 🛑 no-op guard: already at (to, clamped)
          if (current.status === to && current.index === clamped) return state;

          // Build new tasks with updated status
          const tasks = state.tasks.map(t => (t.id === id ? { ...t, status: to } : t));

          // Remove from source and write destination
          const fromArr = state.columns[current.status] ?? [];
          const newFrom = fromArr.filter(x => x !== id);
          const newTo = [
            ...dest.slice(0, clamped),
            id,
            ...dest.slice(clamped),
          ];

          const columns: ColumnsMap = {
            ...state.columns,
            [current.status]: newFrom,
            [to]: newTo,
          };

          return { ...state, tasks, columns };
        });
      },

      // 🚦 only updates when the final (to, index) would differ from current
      moveDuringDrag(id, to, index) {
        const pos = get().getPosition(id);
        const cols = get().columns;

        const destRaw = cols[to] ?? [];
        const dest = destRaw.filter(x => x !== id);
        const clamped = Math.max(0, Math.min(index, dest.length));

        if (pos && pos.status === to && pos.index === clamped) return; // no-op

        get().reorder(id, to, clamped);
      },

      tasksByStatus(sx) {
        const { tasks, columns, query } = get();
        const map = new Map(tasks.map(t => [t.id, t]));
        const ordered = (columns[sx] ?? []).map(id => map.get(id)!).filter(Boolean);
        const q = query.trim().toLowerCase();
        if (!q) return ordered;
        return ordered.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            (t.description ?? "").toLowerCase().includes(q) ||
            (t.tags ?? []).some((x) => x.toLowerCase().includes(q))
        );
      },
    }),
    {
      name: "board-app-tasks",
      version: 5,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ tasks: s.tasks, columns: s.columns }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
);
