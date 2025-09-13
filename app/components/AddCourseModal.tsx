// src/components/AddCourseModal.tsx

"use client";

import { useState, useTransition, FormEvent, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { createCourse } from "@/app/(dashboard)/courses/actions";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCourseModal({
  isOpen,
  onClose,
}: AddCourseModalProps) {
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;

    const formData = new FormData(event.currentTarget);
    startTransition(() => {
      createCourse(formData).then((result) => {
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Mata kuliah berhasil ditambahkan!");
          form.reset();
          onClose();
        }
      });
    });
  };

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => !isPending && onClose()}
      >
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <Dialog.Title as="h3" className="text-lg font-bold">
                  Tambah Mata Kuliah Baru
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="courseName"
                      className="mb-2 block text-sm font-medium"
                    >
                      Nama Mata Kuliah
                    </label>
                    <input
                      id="courseName"
                      name="name"
                      type="text"
                      required
                      className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lecturerName"
                      className="mb-2 block text-sm font-medium"
                    >
                      Nama Dosen (Opsional)
                    </label>
                    <input
                      id="lecturerName"
                      name="lecturer" 
                      type="text"
                      placeholder="Contoh: Restu Rakhmawati, S.Kom., M.Kom"
                      className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="courseColor"
                      className="mb-2 block text-sm font-medium"
                    >
                      Pilih Warna Mata Kuliah
                    </label>
                    <input
                      id="courseColor"
                      name="color"
                      type="color"
                      defaultValue="#F97316"
                      className="h-12 w-full cursor-pointer rounded-lg border-none bg-transparent p-0"
                    />
                  </div>
                  <div className="flex justify-end gap-4 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isPending}
                      className="rounded-md px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="rounded-lg bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
                    >
                      {isPending ? "Menyimpan..." : "Simpan"}
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
