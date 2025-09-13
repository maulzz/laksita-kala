// app/(dashboard)/schedule/page.tsx
import { DayOfWeek } from "@/app/types";
import { getClassSchedules } from "./actions";
import { getCourses } from "../courses/actions";
import ScheduleView from "./ScheduleView";
import { ScheduleWithCourse } from "@/app/components/ScheduleCard";

export default async function SchedulePage() {
  const schedules = await getClassSchedules();
  const courses = await getCourses();

  const groupedSchedules = schedules.reduce(
    (acc: Record<DayOfWeek, ScheduleWithCourse[]>, schedule) => {
      const day = schedule.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(schedule);
      return acc;
    },
    {} as Record<DayOfWeek, ScheduleWithCourse[]>
  );

  Object.keys(groupedSchedules).forEach((day) => {
    const key = day as DayOfWeek; 
    groupedSchedules[key].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  });

  return (
    <ScheduleView
      initialSchedules={schedules}
      initialCourses={courses}
      initialGroupedSchedules={groupedSchedules}
    />
  );
}
