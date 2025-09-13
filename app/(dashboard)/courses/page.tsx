// app/(dashboard)/courses/page.tsx

import { getCourses } from './actions';
import CoursesView from './CoursesView';

export default async function CoursesPage() {
  // Ambil data langsung di server saat halaman di-render
  const courses = await getCourses();

  // Kirim data ke komponen klien untuk ditampilkan
  return <CoursesView initialCourses={courses} />;
}