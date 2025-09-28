// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export const metadata: Metadata = {
  title: "Board App – Dashboard",
  description: "Swimlane dashboard (Next.js + Tailwind + dnd-kit + Zustand)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <main className="mx-auto max-w-7xl p-4">
          <Topbar />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[16rem_1fr]">
            <Sidebar />
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
