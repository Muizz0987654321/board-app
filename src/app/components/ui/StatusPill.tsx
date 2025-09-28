// src/components/ui/StatusPill.tsx
export default function StatusPill({
  tone = "gray",
  children,
}: {
  tone?: "gray" | "amber" | "lime" | "red";
  children: React.ReactNode;
}) {
  const map: Record<string, string> = {
    gray: "bg-gray-100 text-gray-700",
    amber: "bg-amber-100 text-amber-700",
    lime: "bg-lime-100 text-lime-700",
    red: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${map[tone]}`}
    >
      {children}
    </span>
  );
}
