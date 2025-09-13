// app/(dashboard)/tasks/page.tsx

import { getTasks } from './actions';
import { getCourses } from '../courses/actions';
import TasksView from './TasksView';

export default async function TaskListPage() {
  const tasks = await getTasks();
  const courses = await getCourses();

  return <TasksView initialTasks={tasks} courses={courses} />;
}