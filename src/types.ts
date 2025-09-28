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
