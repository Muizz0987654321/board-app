// src/components/Sidebar.tsx
import SidebarItem from "@/app/components/ui/SidebarItem";
import Dropdown from "@/app/components/ui/Dropdown";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col gap-2 md:flex">
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="text-xs text-gray-500">workspace</div>
        <div className="mt-1 text-sm font-medium">Root folder</div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-2">
        <SidebarItem label="Dashboard" />
        <div className="p-2">
          <Dropdown
            label="Boards"
            items={[
              "Create routes",
              "Deplopment React App",
              "Sport Xi Project",
              "Wordpress theme",
            ]}
          />
        </div>
        <SidebarItem label="Messages" />
        <SidebarItem label="Calendar" />
        <SidebarItem label="Team members" />
        <div className="mt-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white">
          Logout
        </div>
      </div>
    </aside>
  );
}
