// app/(dashboard)/layout.tsx

"use client";

import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { Toaster } from "react-hot-toast";
import AddTaskModal from "../components/AddTaskModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Toaster position="top-right" />
      </div>
      <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
        <div className="hidden md:flex md:flex-shrink-0">
          <DashboardSidebar />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white p-2 dark:bg-gray-900 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <main className="flex-1">{children}</main>
        </div>

        {sidebarOpen && (
          <>
            <div
              className={`fixed inset-0 z-30 bg-black/70  transition-opacity md:hidden ${
                sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              onClick={() => setSidebarOpen(false)}
            ></div>
            <div
              className={`fixed left-0 top-0 h-full w-52 z-40 transform shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <DashboardSidebar />
            </div>
          </>
        )}
      </div>

      <AddTaskModal />
    </>
  );
}
