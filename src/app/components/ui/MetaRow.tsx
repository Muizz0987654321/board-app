// src/components/ui/MetaRow.tsx
export function MetaRow({
  comments = 0,
  views = 0,
  due,
}: {
  comments?: number;
  views?: number;
  due?: string;
}) {
  return (
    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
      <span className="inline-flex items-center gap-1">💬 {comments}</span>
      <span className="inline-flex items-center gap-1">👁 {views}</span>
      {due && <span className="ml-auto text-gray-400">Due: {due}</span>}
    </div>
  );
}
