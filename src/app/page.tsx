// src/app/page.tsx
import Board from "@/app/components/Board";

export default function Page() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold">Sport Xi Project</h1>
        <p className="text-xs text-gray-500">event production</p>
      </div>

      <Board />
    </section>
  );
}
