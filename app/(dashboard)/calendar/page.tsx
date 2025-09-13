// app/(dashboard)/calendar/page.tsx

import { getTasks } from '../tasks/actions';
import { getCourses } from '../courses/actions';
import CalendarView from './CalendarView';


export default async function CalendarPage() {
  // Ambil data langsung di server
  const tasks = await getTasks();
  const courses = await getCourses();

  return (
    <div className="p-4 sm:p-6 md:p-8">
    
      <CalendarView initialTasks={tasks} initialCourses={courses} />
    </div>
  );
}