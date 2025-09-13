// app/(dashboard)/tasks/TasksView.tsx

"use client";

import { useState, useMemo, useTransition, Fragment } from "react";
import PageHeader from "@/app/components/PageHeader";
import { useAddTaskStore } from "@/app/hooks/useAddTaskStore";
import { Task, Course, TaskPriority, TaskStatus } from "@/app/types";
import { TaskItem } from "../../components/TaskItem";
import ConfirmModal from "@/app/components/ConfirmModal";
import EditTaskModal from "@/app/components/EditTaskModal";
import toast from "react-hot-toast";
import { deleteTask } from "./actions";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type SortCriteria = "deadline" | "priority" | "status";
const TASKS_PER_PAGE = 7;

interface TasksViewProps {
  initialTasks: Task[];
  courses: Course[];
}

export default function TasksView({ initialTasks, courses }: TasksViewProps) {
  const { openModal } = useAddTaskStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [sortBy, setSortBy] = useState<SortCriteria>("deadline");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Logika untuk memfilter tugas
  const sortedAndFilteredTasks = useMemo(() => {
    const filtered = initialTasks
      .filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(
        (task) => courseFilter === "ALL" || task.courseId === courseFilter
      )
      .filter(
        (task) => priorityFilter === "ALL" || task.priority === priorityFilter
      )
      .filter((task) => statusFilter === "ALL" || task.status === statusFilter);

    const priorityOrder: Record<TaskPriority, number> = {
      PENTING: 1,
      SEDANG: 2,
      RENDAH: 3,
    };
    const statusOrder: Record<TaskStatus, number> = {
      SEDANG_DIKERJAKAN: 1,
      BELUM_DIMULAI: 2,
      SELESAI: 3,
    };

    return [...filtered].sort((a, b) => {
      if (a.status === "SELESAI" && b.status !== "SELESAI") {
        return 1;
      }
      if (b.status === "SELESAI" && a.status !== "SELESAI") {
        return -1;
      }

      switch (sortBy) {
        case "priority":
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "status":
          return statusOrder[a.status] - statusOrder[b.status];
        case "deadline":
        default:
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });
  }, [
    initialTasks,
    searchTerm,
    courseFilter,
    priorityFilter,
    statusFilter,
    sortBy,
  ]);

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
    const endIndex = startIndex + TASKS_PER_PAGE;
    return sortedAndFilteredTasks.slice(startIndex, endIndex);
  }, [sortedAndFilteredTasks, currentPage]);

  const totalPages = Math.ceil(sortedAndFilteredTasks.length / TASKS_PER_PAGE);

  const goToNextPage = () =>
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPreviousPage = () =>
    setCurrentPage((page) => Math.max(page - 1, 1));

  const handleEditClick = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedTask) return;

    startTransition(() => {
      deleteTask(selectedTask.id).then((result) => {
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success("Tugas berhasil dihapus!");
        }
        setIsDeleteModalOpen(false);
      });
    });
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Daftar Semua Tugas"
        subtitle="Kelola dan lacak semua tugasmu di sini."
        buttonText="Tugas"
        onButtonClick={openModal}
      />

      <div className="mb-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <select
            className="w-full rounded-lg bg-white p-2 dark:bg-gray-700"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="ALL">Semua Mata Kuliah</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-lg bg-white p-2 dark:bg-gray-700"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="PENTING">Penting</option>
            <option value="SEDANG">Sedang</option>
            <option value="RENDAH">Rendah</option>
          </select>
          <select
            className="w-full rounded-lg bg-white p-2 dark:bg-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="BELUM_DIMULAI">Belum Dimulai</option>
            <option value="SEDANG_DIKERJAKAN">Sedang Dikerjakan</option>
            <option value="SELESAI">Selesai</option>
          </select>
          <select
            className="w-full rounded-lg bg-white p-2 dark:bg-gray-700"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortCriteria)}
          >
            <option value="deadline">Urutkan: Deadline</option>
            <option value="priority">Urutkan: Prioritas</option>
            <option value="status">Urutkan: Status</option>
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
        {initialTasks.length > 0 ? (
          paginatedTasks.length > 0 ? (
            // Gunakan paginatedTasks untuk me-render daftar
            paginatedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={() => handleEditClick(task)}
                onDelete={() => handleDeleteClick(task)}
              />
            ))
          ) : (
            <p className="text-center text-neutral-500">
              Tidak ada tugas yang cocok dengan filter.
            </p>
          )
        ) : (
          <p className="text-center text-neutral-500">Belum ada tugas.</p>
        )}
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={selectedTask}
        courses={courses}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Konfirmasi Hapus Tugas"
        message={`Apakah kamu yakin ingin menghapus tugas "${selectedTask?.title}"?`}
        txtbtn="Hapus"
      />

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            <span>Sebelumnya</span>
          </button>
          
          <span className="text-sm font-semibold">
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <span>Berikutnya</span>
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
