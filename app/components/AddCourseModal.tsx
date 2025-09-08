// src/components/AddCourseModal.tsx

"use client";

import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseAdded: () => void;
}

export default function AddCourseModal({
  isOpen,
  onClose,
  onCourseAdded,
}: AddCourseModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    const fetchPromise = fetch("/api/courses", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    });

    try {
      const [response] = await Promise.all([fetchPromise, delayPromise]);

      if (!response.ok) {
        throw new Error("Gagal menambahkan mata kuliah. Coba lagi.");
      }

      onCourseAdded();
      onClose();
      setName("");
      setColor("#F97316");

      toast.success("Mata kuliah berhasil ditambahkan!");
    } catch (err: any) {
      toast.error(err.message);
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
                  Tambah Mata Kuliah Baru
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit}
                  className="mt-4 flex flex-col gap-4"
                >
                  <div>
                    <label
                      htmlFor="courseName"
                      className="mb-2 block text-sm font-medium"
                    >
                      Nama Mata Kuliah
                    </label>
                    <input
                      id="courseName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Kalkulus Lanjut"
                      required
                      className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="courseColor"
                      className="mb-2 block text-sm font-medium"
                    >
                      Pilih Warna
                    </label>
                    <input
                      id="courseColor"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-12 w-full cursor-pointer rounded-lg border-none bg-transparent p-0"
                    />
                  </div>

                  {error && <p className="text-sm text-red-500">{error}</p>}

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center rounded-md bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <ArrowPathIcon className="mr-2 h-5 w-5 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        "Simpan"
                      )}
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
