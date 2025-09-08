// app/(dashboard)/calendar/page.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/app/components/PageHeader';
import { useAddTaskStore } from '@/app/hooks/useAddTaskStore';
import { Task, Course } from '@/app/types';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


export default function CalendarPage() {
  const { openModal: openAddTaskModal } = useAddTaskStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [courseFilter, setCourseFilter] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [tasksRes, coursesRes] = await Promise.all([
          fetch('/api/tasks', { credentials: 'include' }),
          fetch('/api/courses', { credentials: 'include' }),
        ]);
        const tasksData = await tasksRes.json();
        const coursesData = await coursesRes.json();
        setTasks(tasksData);
        setCourses(coursesData);

        setCourseFilter(coursesData.map((c: Course) => c.id));
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const events = useMemo(() => {
    return tasks.map(task => ({
      title: task.title,
      start: task.startDate,
      end: task.dueDate, 
      backgroundColor: task.course.color,
      borderColor: task.course.color,
      extendedProps: task, 
    }));
  }, [tasks]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => courseFilter.includes(event.extendedProps.courseId));
  }, [events, courseFilter]);
  
  const handleCourseFilterChange = (courseId: string) => {
    setCourseFilter(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId) 
        : [...prev, courseId]
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <PageHeader
        title="Kalender Tugas"
        subtitle="Lihat semua tugasmu dalam tampilan kalender."
        buttonText="Tugas"
        onButtonClick={openAddTaskModal}
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
  
        <aside className="md:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 font-semibold">Filter Tampilan</h3>
            <div>
              <h4 className="mb-2 text-sm font-medium">Mata Kuliah</h4>
              <div className="space-y-2">
                {courses.map(course => (
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
            {/* filter Prioritas dan Tipe Tugas */}
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            {isLoading ? (
              <p>Memuat kalender...</p>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,dayGridWeek'
                }}
                events={filteredEvents}
                eventContent={(eventInfo) => (
                  <div className="overflow-hidden whitespace-nowrap px-1 text-sm font-semibold">
                    {eventInfo.event.title}
                  </div>
                )}
                height="auto"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}