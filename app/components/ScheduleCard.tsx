// src/components/ScheduleCard.tsx
"use client";

import { Course, DayOfWeek } from "@/app/types";
import {
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export interface ScheduleWithCourse {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  location?: string | null;
  course: Course & { lecturer?: string | null };
}

interface ScheduleCardProps {
  schedule: ScheduleWithCourse;
  onEdit: () => void;
  onDelete: () => void;
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
};

export default function ScheduleCard({
  schedule,
  onEdit,
  onDelete,
}: ScheduleCardProps) {
  return (
    <div style={{ borderTop: `8px solid ${schedule.course.color}` }} className="flex h-full flex-col justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
      {/* Konten utama */}
      <div>
        <div className="flex items-center ">
          <h4 className="font-bold truncate">{schedule.course.name}</h4>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <ClockIcon className="h-4 w-4 flex-shrink-0" />
          <span>
            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
          </span>
        </div>
        {schedule.location && (
          <div className="flex items-center gap-1 text-xs">
            <BuildingOffice2Icon className="h-4 w-4 flex-shrink-0" />
            <span>{schedule.location}</span>
          </div>
        )}
        {schedule.course.lecturer && (
          <div className="flex items-center gap-1 text-xs font-medium">
            <UserIcon className="h-4 w-4 flex-shrink-0" />
            <span>{schedule.course.lecturer}</span>
          </div>
        )}
      </div>

      {/* Tombol Aksi di pojok kanan bawah */}
      <div className="mt-2 flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="p-1 text-gray-400 hover:text-blue-500"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-red-400 hover:text-red-500"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
