// app/(dashboard)/schedule/ScheduleView.tsx

"use client";
import { useState, useTransition } from "react";
import PageHeader from "@/app/components/PageHeader";
import ScheduleCard, {
  ScheduleWithCourse,
} from "@/app/components/ScheduleCard";
import { DayOfWeek, Course } from "@/app/types";
import AddScheduleModal from "@/app/components/AddSchedulueModal";
import EditScheduleModal from "@/app/components/EditScheduleModal";
import { deleteClassSchedule } from "./actions";
import ConfirmModal from "@/app/components/ConfirmModal";
import toast from "react-hot-toast";

interface ScheduleViewProps {
  initialSchedules: ScheduleWithCourse[];
  initialCourses: Course[];
  initialGroupedSchedules: Record<DayOfWeek, ScheduleWithCourse[]>;
}

export default function ScheduleView({
  initialSchedules,
  initialCourses,
   initialGroupedSchedules 
}: ScheduleViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleWithCourse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEditClick = (schedule: ScheduleWithCourse) => {
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (schedule: ScheduleWithCourse) => {
    setSelectedSchedule(schedule);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedSchedule) return;
    startTransition(() => {
      deleteClassSchedule(selectedSchedule.id).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Jadwal berhasil dihapus!");
        }
        setIsDeleteModalOpen(false);
      });
    });
  };

  const groupedSchedules = initialSchedules.reduce((acc, schedule) => {
    const day = schedule.dayOfWeek;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(schedule);
    return acc;
  }, {} as Record<DayOfWeek, ScheduleWithCourse[]>);

  const daysInOrder: DayOfWeek[] = [
    "SENIN",
    "SELASA",
    "RABU",
    "KAMIS",
    "JUMAT",
  ];

  return (
    <>
      <div className="p-4 sm:p-6 md:p-8">
        <PageHeader
          title="Jadwal Kuliah"
          subtitle="Atur jadwal kuliahmu di halaman ini."
          buttonText="Jadwal"
          onButtonClick={() => setIsModalOpen(true)}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
          {daysInOrder.map((day) => (
            <div
              key={day}
              className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800/50"
            >
              <h3 className="mb-4 font-bold capitalize">{day.toLowerCase()}</h3>
              <div className="space-y-3">
                {initialGroupedSchedules[day] ? (
                initialGroupedSchedules[day].map((schedule) => (
                  <ScheduleCard 
                    key={schedule.id} 
                    schedule={schedule}
                   onEdit={() => handleEditClick(schedule)}
                      onDelete={() => handleDeleteClick(schedule)}
                  />
                ))
              ) : (
                <p className="text-center text-sm text-neutral-500">Tidak ada jadwal.</p>
              )}
                
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={initialCourses}
      />
      <EditScheduleModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        schedule={selectedSchedule}
        courses={initialCourses}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Jadwal"
        message={`Apakah kamu yakin ingin menghapus jadwal untuk "${selectedSchedule?.course.name}"?`}
        txtbtn="Hapus"
      />
    </>
  );
}
