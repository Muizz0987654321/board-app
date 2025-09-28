// src/types.ts

export type Status = "todo" | "in_progress" | "approved" | "rejected";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  assignees?: string[];
  tags?: string[];
  due?: string; // ISO date
  meta?: { comments?: number; views?: number; priority?: "low" | "med" | "high" };
}

/* ---------- Board / Columns ---------- */

export type ColumnId = Status;

export type ColumnsMap = Record<Status, string[]>; // ordered task IDs per column

/* ---------- dnd-kit data payloads ---------- */

export type DragDataTask = {
  type: "task";
  task: Task;
  container: Status; // the column it currently belongs to
};

export type DragDataColumn = {
  type: "column";
  status: Status; // the column being hovered
};

export type DragItemData = DragDataTask | DragDataColumn;

/* ---------- Store (Zustand) contracts (optional but handy) ---------- */

export interface BoardState {
  tasks: Task[];
  columns: ColumnsMap;
  query: string;
  hasHydrated: boolean;

  setHydrated: (v: boolean) => void;
  initFromMock: () => Promise<void>;
  setQuery: (q: string) => void;

  reorder: (id: string, to: Status, index: number) => void;
  moveDuringDrag: (id: string, to: Status, index: number) => void;

  tasksByStatus: (s: Status) => Task[];
}
