// app/(dashboard)/tasks/page.tsx

"use client";

import { useState, useEffect, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import EditTaskModal from "@/app/components/EditTaskModal";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useAddTaskStore } from "../../hooks/useAddTaskStore";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Task, Course } from "@/app/types";
import toast from "react-hot-toast";
import { id } from "date-fns/locale";
import { FaFlag } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  HiOutlineClock,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineQuestionMarkCircle,
  HiOutlineAcademicCap,
} from "react-icons/hi2";

const TaskItem = ({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const statusInfo = {
    BELUM_DIMULAI: { icon: HiOutlineClock, color: "text-gray-500" },
    SEDANG_DIKERJAKAN: { icon: HiOutlineArrowPath, color: "text-blue-500" },
    SELESAI: { icon: HiOutlineCheckCircle, color: "text-green-500" },
  };
  const StatusIcon = statusInfo[task.status].icon;

  const priorityInfo = {
    RENDAH: { color: "text-green-500", label: "Rendah" },
    SEDANG: { color: "text-orange-500", label: "Sedang" },
    PENTING: { color: "text-red-500", label: "Penting" },
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
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800">
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
            <FaFlag />
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
          <FaFlag />
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
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default function TaskListPage() {
  const { openModal: openAddTaskModal, refreshKey } = useAddTaskStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [tasksRes, coursesRes] = await Promise.all([
        fetch("/api/tasks", { credentials: "include" }),
        fetch("/api/courses", { credentials: "include" }),
      ]);

      const tasksData = await tasksRes.json();
      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      } else {
        console.error("API tasks tidak mengembalikan array:", tasksData);
        setTasks([]);
      }

      const coursesData = await coursesRes.json();
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else {
        console.error("API courses tidak mengembalikan array:", coursesData);
        setCourses([]);
      }
    } catch (error) {
      console.error("Gagal memuat data:", error);
      setTasks([]);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [refreshKey]);

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  // Fungsi untuk konfirmasi hapus
  const confirmDelete = async () => {
    if (!selectedTask) return;
    const toastId = toast.loading("Menghapus tugas...");
    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Gagal menghapus tugas.");

      toast.success("Tugas berhasil dihapus!", { id: toastId });
      fetchAllData();
      setIsDeleteModalOpen(false);
    } catch (error) {
      let errorMessage = "Terjadi kesalahan yang tidak diketahui.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!searchTerm) {
      return tasks;
    }
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Daftar Semua Tugas"
        subtitle="Kelola dan lacak semua tugasmu di sini."
        buttonText="Tugas"
        onButtonClick={openAddTaskModal}
      />

      <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <select className="w-full rounded-lg bg-white p-2 dark:bg-gray-700">
            <option>Filter Mata Kuliah</option>
          </select>
          <select className="w-full rounded-lg bg-white p-2 dark:bg-gray-700">
            <option>Filter Prioritas</option>
          </select>
          <select className="w-full rounded-lg bg-white p-2 dark:bg-gray-700">
            <option>Filter Status</option>
          </select>
          <select className="w-full rounded-lg bg-white p-2 dark:bg-gray-700">
            <option>Urutkan: Deadline</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="🔍 Cari tugas berdasarkan judul..."
          className="w-full rounded-lg bg-white p-2 dark:bg-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p>Memuat tugas...</p>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => handleEditClick(task)}
              onDelete={() => handleDeleteClick(task)}
            />
          ))
        ) : (
          <p className="text-center text-neutral-500">
            {searchTerm
              ? `Tidak ada tugas yang cocok dengan "${searchTerm}".`
              : "Belum ada tugas yang ditambahkan."}
          </p>
        )}
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        courses={courses}
        onTaskUpdated={fetchAllData}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Tugas"
        message={`Apakah kamu yakin ingin menghapus tugas "${selectedTask?.title}"?`}
        txtbtn="Hapus"
      />
    </div>
  );
}
