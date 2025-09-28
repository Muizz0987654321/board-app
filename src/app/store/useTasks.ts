"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task, Status } from "@/types";

type State = {
  tasks: Task[];
  query: string;
  hasHydrated: boolean;
  setHydrated: (v: boolean) => void;
  initFromMock: () => Promise<void>;
  setQuery: (q: string) => void;
  moveTask: (id: string, to: Status) => void;
  tasksByStatus: (s: Status) => Task[];
};

export const useTasks = create<State>()(
  persist(
    (set, get) => ({
      tasks: [],
      query: "",
      hasHydrated: false,
      setHydrated: (v) => set({ hasHydrated: v }),

      async initFromMock() {
        // If nothing in storage after hydration, seed from /public/tasks.json
        if (!get().tasks.length) {
          const res = await fetch("/tasks.json", { cache: "no-store" });
          const data: Task[] = await res.json();
          set({ tasks: data });
        }
      },

      setQuery(q) { set({ query: q }); },

      moveTask(id, to) {
        set((s) => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, status: to } : t) }));
      },

      tasksByStatus(s) {
        const { tasks, query } = get();
        const q = query.trim().toLowerCase();
        const filtered = q
          ? tasks.filter(t =>
              t.title.toLowerCase().includes(q) ||
              (t.description ?? "").toLowerCase().includes(q) ||
              (t.tags ?? []).some(x => x.toLowerCase().includes(q))
            )
          : tasks;
        return filtered.filter(t => t.status === s);
      },
    }),
    {
      name: "board-app-tasks",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ tasks: s.tasks }),
      // mark hydrated after persist rehydrates from storage
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
