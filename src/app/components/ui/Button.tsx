// src/components/ui/Button.tsx
export function Button({ children, className = "", ...props }: any) {
  return (
    <button
      {...props}
      className={`bg-[#3772FF] h-12 px-3 py-3 text-sm font-semibold text-white hover:bg-blue-700  rounded-md
  ${className}`}
    >
      {children}
    </button>
  );
}

// src/components/ui/IconButton.tsx
export function IconButton({ children, className = "", ...props }: any) {
  return (
    <button
      {...props}
      className={`inline-grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 ${className}`}
    >
      {children}
    </button>
  );
}
