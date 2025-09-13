// app/(dashboard)/dashboard/DashboardView.tsx

"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Task, Course } from "@/app/types";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import Link from "next/link";
import PageHeader from "@/app/components/PageHeader";
import { useAddTaskStore } from "../../hooks/useAddTaskStore";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface DashboardViewProps {
  tasks: Task[];
  courses: Course[];
}

export default function DashboardView({ tasks, courses }: DashboardViewProps) {
  const { openModal } = useAddTaskStore();
  const { data: session } = useSession();
  const stats = useMemo(() => {
    const incompleteTasks = tasks.filter((t) => t.status !== "SELESAI");
    return {
      incompleteTasksCount: incompleteTasks.length,
      activeCoursesCount: courses.length,
      upcomingTasks: incompleteTasks.slice(0, 5),
    };
  }, [tasks, courses]);

  const pieChartData = useMemo(() => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<Task["status"], number>);

    return {
      labels: ["Belum Dimulai", "Dikerjakan", "Selesai"],
      datasets: [
        {
          label: "Tugas",
          data: [
            statusCounts.BELUM_DIMULAI || 0,
            statusCounts.SEDANG_DIKERJAKAN || 0,
            statusCounts.SELESAI || 0,
          ],
          backgroundColor: ["#f97316", "#3b82f6", "#22c55e"],
        },
      ],
    };
  }, [tasks]);

  const barChartData = useMemo(() => {
    const incompleteTasksByCourse = courses.map((course) => {
      const count = tasks.filter(
        (t) => t.courseId === course.id && t.status !== "SELESAI"
      ).length;
      return { courseName: course.name, count, color: course.color };
    });

    return {
      labels: incompleteTasksByCourse.map((d) => d.courseName),
      datasets: [
        {
          label: "Tugas Belum Selesai",
          data: incompleteTasksByCourse.map((d) => d.count),
          backgroundColor: incompleteTasksByCourse.map((d) => d.color),
        },
      ],
    };
  }, [tasks, courses]);

   const barChartOptions = {
    indexAxis: 'y' as const, 
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { 
        beginAtZero: true,
        ticks: {
          stepSize: 1, 
        },
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
    },
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle={`Hi ${session?.user?.name}! Selamat datang di Laksita Kala.`}
        buttonText="Tugas"
        onButtonClick={openModal}
      />

     
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <h3 className="text-lg text-neutral-500">Tugas Belum Selesai</h3>
          <p className="text-4xl font-bold">{stats.incompleteTasksCount}</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
          <h3 className="text-lg text-neutral-500">Mata Kuliah Aktif</h3>
          <p className="text-4xl font-bold">{stats.activeCoursesCount}</p>
        </div>
      </div>

   
      <div className="flex flex-col gap-8 lg:flex-row">
      
        <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700 lg:w-2/3">
          <h3 className="mb-4 text-xl font-bold">Tugas Mendatang</h3>
          <div className="space-y-3">
            {stats.upcomingTasks.length > 0 ? (
              stats.upcomingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full" style={{backgroundColor: task.course.color}}></div>
                  <span className="font-semibold">{task.title}</span>
                  <span className="ml-auto text-neutral-500">
                    {new Date(task.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              ))
            ) : <p className="text-neutral-500">Tidak ada tugas mendatang. Santai dulu!</p>}
          </div>
          <Link href="/tasks" className="mt-4 inline-block text-sm font-semibold text-orange-500 hover:underline">
            Lihat semua tugas →
          </Link>
        </div>
        
  
        <div className="flex flex-col rounded-lg border border-gray-200 p-6 dark:border-gray-700 lg:w-1/3">
          <h3 className="mb-4 text-xl font-bold text-center">Progres Saya</h3>
          <div className="relative h-64"> 
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
        <h3 className="mb-4 text-xl font-bold">Tugas per Mata Kuliah</h3>
        <div className="h-64">
           <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
}
