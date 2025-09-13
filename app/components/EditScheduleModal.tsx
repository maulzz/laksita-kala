// src/components/EditScheduleModal.tsx

"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { updateClassSchedule } from "@/app/(dashboard)/schedule/actions";
import { Course, DayOfWeek, ClassType } from "@/app/types";
import { ScheduleWithCourse } from "./ScheduleCard";

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleWithCourse | null;
  courses: Course[];
}

const days: DayOfWeek[] = ["SENIN", "SELASA", "RABU", "KAMIS", "JUMAT"];

export default function EditScheduleModal({
  isOpen,
  onClose,
  schedule,
  courses,
}: EditScheduleModalProps) {
  const formRef = useRef<HTMLFormElement>(null);

  if (!schedule) return null;

  const handleAction = async (formData: FormData) => {
    const result = await updateClassSchedule(schedule.id, formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Jadwal berhasil diperbarui!");
      onClose();
    }
  };

  // Fungsi untuk format waktu dari Date object ke string "HH:mm"
  const formatTimeForInput = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
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
              <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
                <Dialog.Title as="h3" className="text-lg font-bold">
                  Edit Jadwal
                </Dialog.Title>

                <form
                  ref={formRef}
                  action={handleAction}
                  className="mt-4 space-y-4"
                >
                  <div>
                    <label htmlFor="courseId" className="mb-2 block text-sm">
                      Mata Kuliah
                    </label>
                    <select
                      name="courseId"
                      required
                      defaultValue={schedule.course.id}
                      className="w-full rounded-lg p-3 dark:bg-gray-700"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="sks" className="mb-2 block text-sm">
                        SKS
                      </label>
                      <input
                        name="sks"
                        type="number"
                        min="1"
                        required
                        defaultValue={String(schedule.sks)}
                        className="w-full rounded-lg p-3 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm">Tipe</label>
                      <select
                        name="type"
                        required
                        defaultValue={schedule.type}
                        className="w-full rounded-lg p-3 dark:bg-gray-700"
                      >
                        <option value="TEORI">Teori</option>
                        <option value="PRAKTIKUM">Praktikum</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="dayOfWeek" className="mb-2 block text-sm">
                        Hari
                      </label>
                      <select
                        name="dayOfWeek"
                        required
                        defaultValue={schedule.dayOfWeek}
                        className="w-full rounded-lg p-3 dark:bg-gray-700"
                      >
                        {days.map((day) => (
                          <option key={day} value={day}>
                            {day.charAt(0) + day.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="startTime" className="mb-2 block text-sm">
                        Jam Mulai
                      </label>
                      <input
                        name="startTime"
                        type="time"
                        required
                        defaultValue={formatTimeForInput(schedule.startTime)}
                        className="w-full rounded-lg p-3 dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="mb-2 block text-sm">
                      Lokasi (Opsional)
                    </label>
                    <input
                      name="location"
                      type="text"
                      placeholder="Gedung A R.101"
                      defaultValue={schedule.location || ""}
                      className="w-full rounded-lg p-3 dark:bg-gray-700"
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
