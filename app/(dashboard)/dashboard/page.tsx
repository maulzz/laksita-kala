// app/(dashboard)/dashboard/page.tsx

import { getTasks } from '../tasks/actions';
import { getCourses } from '../courses/actions';
import DashboardView from './DashboardView'; 

export default async function DashboardPage() {
  const tasks = await getTasks();
  const courses = await getCourses();

  return <DashboardView tasks={tasks} courses={courses} />;
}