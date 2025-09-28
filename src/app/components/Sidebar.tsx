export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col gap-2 md:flex">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="text-xs text-gray-500">workspace</div>
        <div className="mt-1 text-sm font-medium">Root folder</div>
      </div>

      <nav className="rounded-xl border border-gray-200 bg-white p-2">
        {[
          "Dashboard",
          "Boards",
          "Messages",
          "Calendar",
          "Team members",
          "Support",
        ].map((x) => (
          <div
            key={x}
            className="cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            {x}
          </div>
        ))}
        <div className="mt-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white">
          Logout
        </div>
      </nav>
    </aside>
  );
}
