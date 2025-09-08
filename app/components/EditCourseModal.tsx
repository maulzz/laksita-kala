// src/components/EditCourseModal.tsx

"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

interface Course {
  id: string;
  name: string;
  color: string;
}

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseUpdated: () => void;
  course: Course | null;
}

export default function EditCourseModal({
  isOpen,
  onClose,
  onCourseUpdated,
  course,
}: EditCourseModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#F97316");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (course) {
      setName(course.name);
      setColor(course.color);
    }
  }, [course]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!course) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui mata kuliah...");

    try {
      const response = await fetch(`/api/courses/${course.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperbarui mata kuliah.");
      }

      toast.success("Mata kuliah berhasil diperbarui!", { id: toastId });
      onCourseUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  Edit Mata Kuliah
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit}
                  className="mt-4 flex flex-col gap-4"
                >
                  <div>
                    <label
                      htmlFor="editCourseName"
                      className="mb-2 block text-sm font-medium"
                    >
                      Nama Mata Kuliah
                    </label>
                    <input
                      id="editCourseName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="editCourseColor"
                      className="mb-2 block text-sm font-medium"
                    >
                      Pilih Warna
                    </label>
                    <input
                      id="editCourseColor"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-12 w-full cursor-pointer rounded-lg border-none bg-transparent p-0"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? "Memperbarui..." : "Simpan Perubahan"}
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
