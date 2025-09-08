"use client";

import { useState, useEffect, Fragment } from "react";
import PageHeader from "@/app/components/PageHeader";
import AddCourseModal from "@/app/components/AddCourseModal";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import EditCourseModal from "@/app/components/EditCourseModal";
import ConfirmModal from "@/app/components/ConfirmModal";
import toast from "react-hot-toast";

interface Course {
  id: string;
  name: string;
  color: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/courses", { credentials: "include" });
      if (!response.ok) throw new Error("Gagal memuat data.");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCourse) return;

    const toastId = toast.loading("Menghapus mata kuliah...");
    try {
      const response = await fetch(`/api/courses/${selectedCourse.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Gagal menghapus mata kuliah.");

      toast.success("Mata kuliah berhasil dihapus!", { id: toastId });
      setIsDeleteModalOpen(false);
      fetchCourses();
    } catch (error) {
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8">
        <PageHeader
          title="Mata Kuliah"
          subtitle="Kelola semua mata kuliah yang kamu ambil"
          buttonText="Tambah Mata Kuliah"
          onButtonClick={() => setIsModalOpen(true)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p>Tunggu sebentar, sedang memuat data ...</p>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: course.color }}
                  ></div>
                  <p className="font-semibold">{course.name}</p>
                </div>

                <Menu as="div" className="relative">
                  <Menu.Button className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-700">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleEditClick(course)}
                              className={`${
                                active ? "bg-gray-100 dark:bg-gray-600" : ""
                              } group flex w-full items-center px-4 py-2 text-sm`}
                            >
                              <PencilIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                              Edit
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
                              <TrashIcon className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                              Hapus
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
            <p>Belum ada mata kuliah.</p>
          )}
        </div>
      </div>

      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCourseAdded={fetchCourses}
      />
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCourseUpdated={fetchCourses}
        course={selectedCourse}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus"
        message={`Apakah kamu yakin ingin menghapus mata kuliah "${selectedCourse?.name}"? Semua tugas yang terkait juga akan terhapus.`}
        txtbtn="Ya, Hapus"
      />
    </>
  );
}
