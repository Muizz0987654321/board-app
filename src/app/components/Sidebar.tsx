import SidebarItem from "@/app/components/ui/SidebarItem";
import Dropdown from "@/app/components/ui/Dropdown";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="hidden w-70 flex-col gap-2 md:flex px-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-2">
        <div className="flex w-full items-center gap-3">
          {/* LEFT: avatar + texts */}
          <Image
            src="/images/profile.svg"
            alt="workspace"
            width={44}
            height={44}
            className="rounded-md"
          />

          <div className="flex flex-col">
            <span className="text-xs text-[#B1B5C3] leading-none">
              workspace
            </span>
            <span className="mt-1 text-sm font-medium leading-none">
              Root folder
            </span>
          </div>

          {/* RIGHT: arrow (far right, centered) */}
          <button className="ml-auto grid h-8 w-8 place-items-center rounded-md hover:bg-gray-50">
            <Image
              src="/images/arrowdown.svg"
              alt="open"
              width={24}
              height={24}
              className="inline-block"
              priority
            />
          </button>
        </div>
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
