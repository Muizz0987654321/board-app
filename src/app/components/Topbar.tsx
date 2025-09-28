"use client";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-blue-600" />
        <div className="text-sm font-semibold">Board App</div>
      </div>
      <div className="flex flex-1 justify-center"></div>
      <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
        Create new board
      </button>
    </div>
  );
}
