"use client";
import { useTasks } from "@/app/store/useTasks";

export default function SearchBar() {
  const q = useTasks((s) => s.query);
  const setQuery = useTasks((s) => s.setQuery);
  return (
    <input
      value={q}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search tasks…"
      className="w-full md:w-96 rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
