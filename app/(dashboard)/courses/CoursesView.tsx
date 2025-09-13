// app/(dashboard)/courses/CoursesView.tsx

"use client";

import { useState, useTransition, Fragment } from "react";
import PageHeader from "@/app/components/PageHeader";
import AddCourseModal from "@/app/components/AddCourseModal";
import EditCourseModal from "@/app/components/EditCourseModal";
import ConfirmModal from "@/app/components/ConfirmModal";
import { Course } from "@/app/types";
import { deleteCourse } from "./actions";
import toast from "react-hot-toast";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { useMemo } from "react";

interface CoursesViewProps {
  initialCourses: Course[];
}

export default function CoursesView({ initialCourses }: CoursesViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialCourses, searchTerm]);

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCourse) return;
    startTransition(() => {
      deleteCourse(selectedCourse.id).then((result) => {
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Mata kuliah berhasil dihapus!");
        }
        setIsDeleteModalOpen(false);
      });
    });
  };

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8">
        <PageHeader
          title="Mata Kuliah"
          subtitle="Kelola semua mata kuliahmu di halaman ini"
          buttonText=" Mata Kuliah"
          onButtonClick={() => setIsAddModalOpen(true)}
        />

        <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <input
            type="text"
            placeholder="🔍 Cari mata kuliah..."
            className="w-full rounded-lg bg-white p-2 dark:bg-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
              >
                <div className="flex items-center gap-4 truncate">
                  <div
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{ backgroundColor: course.color }}
                  ></div>
                  <div>
                    <p className="truncate font-semibold">{course.name}</p>
                    <p className="truncate text-sm text-gray-500">
                      Dosen: {course.lecturer || "Tidak Diketahui"}
                    </p>
                  </div>
                </div>
                <Menu as="div" className="relative shrink-0">
                  <Menu.Button className="rounded-full p-1 text-gray-400 hover:text-gray-600">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="..."
                    enterFrom="..."
                    enterTo="..."
                    leave="..."
                    leaveFrom="..."
                    leaveTo="..."
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-gray-700">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleEditClick(course)}
                              className={`${
                                active ? "bg-gray-100 dark:bg-gray-600" : ""
                              } group flex w-full items-center px-4 py-2 text-sm`}
                            >
                              <PencilIcon className="mr-3 h-5 w-5" /> Edit
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDeleteClick(course)}
                              className={`${
                                active ? "bg-gray-100 dark:bg-gray-600" : ""
                              } group flex w-full items-center px-4 py-2 text-sm text-red-600`}
                            >
                              <TrashIcon className="mr-3 h-5 w-5" /> Hapus
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 sm:col-span-3">
              {searchTerm
                ? `Tidak ada mata kuliah dengan nama "${searchTerm}".`
                : "Belum ada mata kuliah yang ditambahkan."}
            </p>
          )}
        </div>
      </div>

      <AddCourseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        course={selectedCourse}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message={`Yakin ingin menghapus mata kuliah "${selectedCourse?.name}"? Semua tugas yang terkait juga akan terhapus permanen.`}
        txtbtn="Hapus"
      />
    </>
  );
}
