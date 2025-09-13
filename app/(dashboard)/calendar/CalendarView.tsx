// app/(dashboard)/calendar/CalendarView.tsx

"use client";

import { useState, useMemo } from "react";
import { Task, Course } from "@/app/types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import PageHeader from "@/app/components/PageHeader";
import { useAddTaskStore } from "@/app/hooks/useAddTaskStore";
import idLocale from "@fullcalendar/core/locales/id";
import { FaFire } from "react-icons/fa";

interface CalendarViewProps {
  initialTasks: Task[];
  initialCourses: Course[];
}

export default function CalendarView({
  initialTasks,
  initialCourses,
}: CalendarViewProps) {
  const { openModal } = useAddTaskStore();
  const [courseFilter, setCourseFilter] = useState<string[]>(() =>
    initialCourses.map((c) => c.id)
  );

  const events = useMemo(() => {
    return initialTasks.map((task) => ({
      title: task.title,
      start: task.startDate,
      end: task.dueDate,
      backgroundColor: task.course.color,
      borderColor: task.course.color,
      extendedProps: task,
    }));
  }, [initialTasks]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      courseFilter.includes(event.extendedProps.courseId)
    );
  }, [events, courseFilter]);

  const handleCourseFilterChange = (courseId: string) => {
    setCourseFilter((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  return (
    <>
      <PageHeader
        title="Kalender Tugas"
        subtitle="Lihat semua tugas Anda dalam tampilan kalender."
        buttonText="Tugas"
        onButtonClick={openModal}
      />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="md:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 font-semibold">Filter Mata Kuliah</h3>
            <div className="space-y-2">
              {initialCourses.map((course) => (
                <label key={course.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courseFilter.includes(course.id)}
                    onChange={() => handleCourseFilterChange(course.id)}
                    className="h-4 w-4 rounded"
                    style={{ accentColor: course.color }}
                  />
                  <span>{course.name}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        <main className="md:col-span-3">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek",
              }}
              locale={idLocale}
              events={filteredEvents}
              eventContent={(eventInfo) => {
                const priority = eventInfo.event.extendedProps.priority;

                return (
                  <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap px-1 text-sm font-semibold">
                    {priority === "PENTING" && (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white">
                        <FaFire className="h-2 w-2 text-red-500" />
                      </div>
                    )}
                    <span>{eventInfo.event.title}</span>
                  </div>
                );
              }}
              height="auto"
            />
          </div>
        </main>
      </div>
    </>
  );
}
