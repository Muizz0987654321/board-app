import Image from "next/image";

export default function Search({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative w-full md:w-72">
      <input
        type="search"
        aria-label="Search tasks"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks ..."
        className="h-12 w-full rounded-md border border-gray-200 bg-gray-50 pl-11 pr-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* icon in a small bordered square */}
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <span className="grid h-5 w-5 place-items-center rounded bg-white">
          <Image
            src="/images/searchtopbar.svg"
            alt=""
            width={16}
            height={16}
            className="inline-block"
            priority
          />
        </span>
      </span>
    </div>
  );
}
