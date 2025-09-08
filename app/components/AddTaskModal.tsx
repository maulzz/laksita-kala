// src/components/AddTaskModal.tsx
"use client";

import { useState, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { useAddTaskStore } from "../hooks/useAddTaskStore";

interface Course {
  id: string;
  name: string;
  color: string;
}

const statusOptions = [
  { id: "BELUM_DIMULAI", label: "Belum Dimulai" },
  { id: "SEDANG_DIKERJAKAN", label: "Sedang Dikerjakan" },
];

export default function AddTaskModal() {
  const { isOpen, closeModal, triggerRefresh } = useAddTaskStore();
  const [courses, setCourses] = useState<Course[]>([]);
  const getTodayDefaultValue = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [startDate, setStartDate] = useState(getTodayDefaultValue());
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("SEDANG");
  const [taskType, setTaskType] = useState("TUGAS_INDIVIDU");
  const [status, setStatus] = useState("BELUM_DIMULAI");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDateInvalid = useMemo(() => {
    if (!startDate || !dueDate) return false;
    return new Date(dueDate) < new Date(startDate);
  }, [startDate, dueDate]);

  useEffect(() => {
    if (isOpen) {
      setStartDate(getTodayDefaultValue());
      const fetchCourses = async () => {
        try {
          const response = await fetch("/api/courses", {
            credentials: "include",
          });
          const data = await response.json();
          setCourses(data);
          if (data.length > 0) {
            setCourseId(data[0].id);
          }
        } catch (error) {
          console.error("Gagal mengambil mata kuliah:", error);
        }
      };
      fetchCourses();
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isDateInvalid) {
      toast.error("Tanggal deadline tidak boleh sebelum tanggal mulai.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Menambahkan tugas...");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          courseId,
          startDate,
          dueDate,
          priority,
          taskType,
          status,
        }),
      });
      if (!response.ok) throw new Error("Gagal menambahkan tugas.");

      toast.success("Tugas baru berhasil ditambahkan!", { id: toastId });
      triggerRefresh();
      closeModal();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                  Tambah Tugas Baru
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
                      type="text"
                      placeholder="Contoh: Laporan Praktikum Bab 3"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="course"
                      className="mb-2 block text-sm font-medium"
                    >
                      Mata Kuliah
                    </label>
                    <select
                      id="course"
                      value={courseId}
                      onChange={(e) => setCourseId(e.target.value)}
                      required
                      disabled={courses.length === 0}
                      className="w-full rounded-lg bg-gray-100 p-3 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                    {courses.length === 0 && (
                      <p className="mt-1 text-xs text-red-500">
                        Kamu belum punya mata kuliah. Silakan tambah mata kuliah
                        di halaman Mata Kuliah terlebih dahulu.
                      </p>
                    )}
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
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
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
                        type="datetime-local"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                      />
                      {isDateInvalid && (
                        <p className="mt-1 text-xs text-red-500">
                          Deadline harus setelah tanggal mulai.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="priority"
                        className="mb-2 block text-sm font-medium"
                      >
                        Prioritas
                      </label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
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
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
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
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Status Awal
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {statusOptions.map((option) => (
                        <div key={option.id}>
                          <input
                            type="radio"
                            id={option.id}
                            name="status"
                            value={option.id}
                            checked={status === option.id}
                            onChange={(e) => setStatus(e.target.value)}
                            className="peer hidden"
                          />
                          <label
                            htmlFor={option.id}
                            className="cursor-pointer rounded-full border border-gray-300 px-4 py-2 peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:text-white dark:border-gray-600"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={closeModal}>
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isSubmitting || courses.length === 0 || isDateInvalid
                      }
                      className="rounded-lg bg-orange-500 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-orange-500/50"
                    >
                      Simpan
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
