// src/components/EditTaskModal.tsx

"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { Task, Course } from "@/app/types";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
  task: Task | null;
  courses: Course[];
}

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  courses,
  onTaskUpdated,
}: EditTaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      const formatDateTimeLocal = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
      };

      setFormData({
        ...task,
        startDate: formatDateTimeLocal(task.startDate),
        dueDate: formatDateTimeLocal(task.dueDate),
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Memperbarui tugas...");

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal memperbarui tugas.");

      toast.success("Tugas berhasil diperbarui!", { id: toastId });
      onTaskUpdated();
      onClose();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => !isSubmitting && onClose()}
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
              <Dialog.Panel className="w-full max-w-lg transform rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <Dialog.Title as="h3" className="text-lg font-bold">
                  Edit Tugas
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium"
                    >
                      Judul Tugas
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title || ""}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                    />
                  </div>

                  {/* <div>
                  <label htmlFor="description" className="mb-2 block text-sm font-medium">Deskripsi (Opsional)</label>
                  <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"></textarea>
                </div> */}

                  <div>
                    <label
                      htmlFor="courseId"
                      className="mb-2 block text-sm font-medium"
                    >
                      Mata Kuliah
                    </label>
                    <select
                      id="courseId"
                      name="courseId"
                      value={formData.courseId || ""}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="startDate"
                        className="mb-2 block text-sm font-medium"
                      >
                        Tanggal Mulai
                      </label>
                      <input
                        id="startDate"
                        name="startDate"
                        type="datetime-local"
                        value={formData.startDate || ""}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="dueDate"
                        className="mb-2 block text-sm font-medium"
                      >
                        Deadline
                      </label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="datetime-local"
                        value={formData.dueDate || ""}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="priority"
                        className="mb-2 block text-sm font-medium"
                      >
                        Prioritas
                      </label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority || "SEDANG"}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                      >
                        <option value="RENDAH">Rendah</option>
                        <option value="SEDANG">Sedang</option>
                        <option value="PENTING">Penting</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="taskType"
                        className="mb-2 block text-sm font-medium"
                      >
                        Tipe Tugas
                      </label>
                      <select
                        id="taskType"
                        name="taskType"
                        value={formData.taskType || "TUGAS_INDIVIDU"}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                      >
                        <option value="TUGAS_INDIVIDU">Tugas Individu</option>
                        <option value="TUGAS_KELOMPOK">Tugas Kelompok</option>
                        <option value="KUIS">Kuis</option>
                        <option value="UTS">UTS</option>
                        <option value="UAS">UAS</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="status"
                        className="mb-2 block text-sm font-medium"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status || "BELUM_DIMULAI"}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                      >
                        <option value="BELUM_DIMULAI">Belum Dimulai</option>
                        <option value="SEDANG_DIKERJAKAN">Dikerjakan</option>
                        <option value="SELESAI">Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="rounded-md border border-gray-300 px-4 py-2 font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-lg bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
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
