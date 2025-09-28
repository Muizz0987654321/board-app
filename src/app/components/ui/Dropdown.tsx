"use client";

import { useState, useRef, useEffect } from "react";
export default function Dropdown({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
      >
        {label} <span className="text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1 shadow-card">
          {items.map((it) => (
            <div
              key={it}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
            >
              {it}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
