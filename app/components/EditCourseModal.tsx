// src/components/EditCourseModal.tsx
"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { useFormStatus } from "react-dom";
import { updateCourse } from "@/app/(dashboard)/courses/actions";
import { Course } from "@prisma/client";

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function EditCourseModal({
  isOpen,
  onClose,
  course,
}: EditCourseModalProps) {
  const formRef = useRef<HTMLFormElement>(null);

  if (!course) return null;
  const updateCourseWithId = updateCourse.bind(null, course.id);

  const handleAction = async (formData: FormData) => {
    const result = await updateCourseWithId(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Mata kuliah berhasil diperbarui!");
      onClose();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <Dialog.Title as="h3" className="text-lg font-bold">
                  Edit Mata Kuliah
                </Dialog.Title>
                <form
                  ref={formRef}
                  action={handleAction}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm">
                      Nama Mata Kuliah
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      defaultValue={course.name}
                      className="w-full rounded-lg p-3 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="lecturer" className="mb-2 block text-sm">
                      Nama Dosen
                    </label>
                    <input
                      name="lecturer"
                      type="text"
                      defaultValue={course.lecturer || ''}
                      className="w-full rounded-lg p-3 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="color" className="mb-2 block text-sm">
                      Pilih Warna
                    </label>
                    <input
                      name="color"
                      type="color"
                      defaultValue={course.color}
                      className="h-12 w-full ..."
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button type="button" onClick={onClose}>
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-orange-500 px-4 py-2 text-white"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
