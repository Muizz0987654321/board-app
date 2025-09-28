"use client";

export default function SidebarItem({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm ${
        active ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      <span>{label}</span>
      <span className="text-gray-300">›</span>
    </div>
  );
}
