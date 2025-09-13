// src/components/DashboardSidebar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ConfirmModal from "./ConfirmModal";
import {
  HomeIcon,
  ListBulletIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const navLinks = [
  { type: "link", name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { type: "link", name: "List Tugas", href: "/tasks", icon: ListBulletIcon },
  { type: "link", name: "Kalender", href: "/calendar", icon: CalendarDaysIcon },
  { type: "divider" ,name: "", href: "", icon:""},
  { type: "header", label: "Manajemen", name: "", href: "", icon:"" },
  { type: "link", name: "Mata Kuliah", href: "/courses", icon: BookOpenIcon },
  { type: "link", name: "Jadwal Kuliah", href: "/schedule", icon: ClockIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <aside className="flex h-full w-52 flex-col bg-gray-100 p-4 dark:bg-gray-800">
        <div className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Laksita Kala
        </div>

        {session?.user && (
          <div className="mb-6 flex items-center gap-3">
            <UserCircleIcon className="h-10 w-10 text-gray-500" />
            <div>
              <p className="font-semibold">{session.user.name}</p>
              <p className="text-xs text-neutral-500">{session.user.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-grow">
          <ul className="space-y-2">
            {navLinks.map((link, index) => {
              if (link.type === "divider") {
                return (
                  <hr
                    key={`divider-${index}`}
                    className="my-3 border-gray-200 dark:border-gray-700"
                  />
                );
              }
              if (link.type === "header") {
                return (
                  <li
                    key={link.label}
                    className="px-3 py-1 text-xs font-semibold uppercase text-gray-500"
                  >
                    {link.label}
                  </li>
                );
              }

              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <link.icon className="h-6 w-6" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => signOut({ callbackUrl: "/" })}
        title="Logout"
        message="Apakah Anda yakin ingin keluar?"
        txtbtn="Ya, Logout"
      />
    </>
  );
}
