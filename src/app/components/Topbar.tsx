"use client";

import { Button } from "@/app/components/ui/Button";
import Search from "@/app/components/ui/Search";
import { useTasks } from "@/app/store/useTasks";
import Image from "next/image";

export default function Topbar() {
  return (
    <div className="flex items-center border-b border-b-[#E6E8EC] bg-white px-8 py-3">
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo.jpg"
          alt="logo"
          width={32}
          height={32}
          className="rounded-md"
        />
        <div className="text-sm font-semibold text-[#353945]">
          Board <span className="text-[#3772FF]">App</span>
        </div>
      </div>

      <div className="flex-1" />
      <div className="flex items-center gap-8 shrink-0">
        <Button className="inline-flex items-center gap-3">
          <span>Create new board</span>
          <Image src="/images/plustopbar.svg" alt="" width={20} height={20} />
        </Button>

        <div className="w-70">
          <Search value={""} onChange={() => {}} />
        </div>

        <div className="flex items-center gap-1">
          <button className="grid size-9 place-items-center hover:bg-gray-50">
            <Image
              src="/images/filter.svg"
              alt="notifications"
              width={24}
              height={24}
            />
          </button>
          <button className="grid size-9 place-items-center hover:bg-gray-50">
            <Image
              src="/images/Bell.svg"
              alt="settings"
              width={24}
              height={24}
            />
          </button>
          <button className="grid size-9 place-items-center hover:bg-gray-50">
            <Image
              src="/images/profile.svg"
              alt="account"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
