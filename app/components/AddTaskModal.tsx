// src/components/AddTaskModal.tsx
"use client";

import { useState, useEffect, Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { useAddTaskStore } from "../hooks/useAddTaskStore";
import { getCourses } from '@/app/(dashboard)/courses/actions';
import { createTask } from '@/app/(dashboard)/tasks/actions';

import { Course, TaskPriority, TaskStatus, TaskType } from '@/app/types';

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
  const [priority, setPriority] = useState<TaskPriority>('SEDANG');
  const [taskType, setTaskType] = useState<TaskType>('TUGAS_INDIVIDU');
  const [status, setStatus] = useState<TaskStatus>('BELUM_DIMULAI');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDateInvalid = useMemo(() => {
    if (!startDate || !dueDate) return false;
    return new Date(dueDate) < new Date(startDate);
  }, [startDate, dueDate]);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      const loadCourses = async () => {
        const coursesData = await getCourses();
        setCourses(coursesData);
        if (coursesData.length > 0) {
          setCourseId(coursesData[0].id);
        }
      };
      loadCourses();
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    if (new Date(dueDate) < new Date(startDate)) {
      toast.error('Tanggal deadline tidak boleh sebelum tanggal mulai.');
      setIsSubmitting(false);
      return;
    }
    
    const toastId = toast.loading('Menambahkan tugas...');
    const result = await createTask({
      title,
      description,
      courseId,
      startDate,
      dueDate,
      priority,
      taskType,
      status,
    });

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error, { id: toastId });
    } else {
      toast.success('Tugas baru berhasil ditambahkan!', { id: toastId });
      closeModal();
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
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium"
                    >
                      Deskripsi (Opsional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Contoh: Tugas dikumpulkan melalui Elita/Google Classroom."
                      rows={3}
                      className="w-full rounded-lg bg-gray-100 p-3 dark:bg-gray-700"
                    ></textarea>
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
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
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
                        onChange={(e) => setTaskType(e.target.value as TaskType)}
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
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
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
