"use client";
import { useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Task } from "@/app/types";
import { id } from "date-fns/locale";
import {
  HiOutlineClock,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineQuestionMarkCircle,
  HiOutlineAcademicCap,
  HiOutlineExclamationTriangle,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi2";

export const TaskItem = ({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = {
    BELUM_DIMULAI: { icon: HiOutlineClock, color: "text-gray-500" },
    SEDANG_DIKERJAKAN: { icon: HiOutlineArrowPath, color: "text-blue-500" },
    SELESAI: { icon: HiOutlineCheckCircle, color: "text-green-500" },
  };
  const StatusIcon = statusInfo[task.status].icon;

  const priorityInfo = {
    RENDAH: {
      color: "text-green-500",
      label: "Rendah",
      shadow: "[--tw-shadow-color:theme(colors.green.500)]",
    },
    SEDANG: {
      color: "text-orange-500",
      label: "Sedang",
      shadow: "[--tw-shadow-color:theme(colors.orange.500)]",
    },
    PENTING: {
      color: "text-red-500",
      label: "Penting",
      shadow: "[--tw-shadow-color:theme(colors.red.500)]",
    },
  };
  const currentPriority = priorityInfo[task.priority];

  const taskTypeInfo = {
    TUGAS_INDIVIDU: { icon: HiOutlineUser, label: "Individu" },
    TUGAS_KELOMPOK: { icon: HiOutlineUsers, label: "Kelompok" },
    KUIS: { icon: HiOutlineQuestionMarkCircle, label: "Kuis" },
    UTS: { icon: HiOutlineAcademicCap, label: "UTS" },
    UAS: { icon: HiOutlineAcademicCap, label: "UAS" },
  };
  const currentTaskType = taskTypeInfo[task.taskType];
  const TaskTypeIcon = currentTaskType.icon;

  const formatDeadline = (dueDate: string) => {
    const date = parseISO(dueDate);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return formatDistanceToNow(date, { addSuffix: true, locale: id });
  };

  return (
    <>
      <div
        className={`flex items-center gap-4 rounded-lg bg-white p-4 shadow-md transition-shadow hover:shadow-sm dark:bg-gray-800 ${currentPriority.shadow}`}
        style={{ borderLeft: `10px solid ${task.course.color}` }}
      >
        <button
          className={`mt-1 self-start sm:mt-0 ${statusInfo[task.status].color}`}
        >
          <StatusIcon className="h-6 w-6" />
        </button>

        <div className="flex-grow">
          <p className="font-semibold">{task.title}</p>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: task.course.color }}
            ></div>
            <span>{task.course.name}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500 sm:hidden">
            <div>
              <span>Deadline {formatDeadline(task.dueDate)}</span>
            </div>
            <div
              className={`flex items-center gap-1.5 font-semibold ${currentPriority.color}`}
            >
              <HiOutlineExclamationTriangle />
              <span>{currentPriority.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TaskTypeIcon className="h-4 w-4" />
              <span>{currentTaskType.label}</span>
            </div>
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-6 text-sm text-neutral-500 sm:flex">
          <div>
            <span>Deadline {formatDeadline(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TaskTypeIcon className="h-4 w-4" />
            <span>{currentTaskType.label}</span>
          </div>
          <div
            className={`flex items-center gap-1.5 font-semibold ${currentPriority.color}`}
          >
            <HiOutlineExclamationTriangle />
            <span>{currentPriority.label}</span>
          </div>
        </div>

        <div className="flex gap-2 self-start sm:self-center">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-500"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-500"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? (
              <HiChevronUp className="h-5 w-5" />
            ) : (
              <HiChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div 
        className={`
          grid transition-[grid-template-rows] duration-300 ease-in-out
          ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
        `}
      >
        <div className="overflow-hidden"> 
          <div className="border-t border-gray-200 px-4 pb-4 pt-2 dark:border-gray-700">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {task.description || "Tidak ada deskripsi."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
