// app/(dashboard)/schedule/actions.ts

'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ClassType, DayOfWeek } from '@/app/types';
import { ScheduleWithCourse } from '@/app/components/ScheduleCard';

export async function getClassSchedules() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }
  try {
    const schedulesFromDb = await prisma.classSchedule.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: true,
      },
    });

    const schedules = schedulesFromDb.map((schedule: any) => ({ 
      ...schedule,
      startTime: schedule.startTime.toISOString(),
      endTime: schedule.endTime.toISOString(),
      course: {
        ...schedule.course,
        lecturer: schedule.course.lecturer || null,
      }
    }));

    return schedules;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function createClassSchedule(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Tidak diizinkan' };
  }

  const courseId = formData.get('courseId') as string;
  const dayOfWeek = formData.get('dayOfWeek') as DayOfWeek;
  const startTimeStr = formData.get('startTime') as string; 
  const sks = parseInt(formData.get('sks') as string, 10);
  const type = formData.get('type') as ClassType;
  const location = formData.get('location') as string;

  if (!courseId || !dayOfWeek || !startTimeStr || !sks || !type) {
    return { error: 'Semua data wajib diisi.' };
  }
  
  const [hours, minutes] = startTimeStr.split(':').map(Number);
  const startTime = new Date();
  startTime.setUTCHours(hours, minutes, 0, 0);

  const durationPerSks = type === 'TEORI' ? 50.5 : 153;
  const totalDuration = sks * durationPerSks;
  
  const endTime = new Date(startTime.getTime() + totalDuration * 60000);

  try {
    await prisma.classSchedule.create({
      data: {
        dayOfWeek,
        startTime,
        endTime,
        sks,
        type,
        location,
        courseId,
        userId: session.user.id,
      },
    });

    revalidatePath('/schedule');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal membuat jadwal.' };
  }
}

export async function updateClassSchedule(scheduleId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Tidak diizinkan' };
  }

  const courseId = formData.get('courseId') as string;
  const dayOfWeek = formData.get('dayOfWeek') as DayOfWeek;
  const startTimeStr = formData.get('startTime') as string;
  const sks = parseInt(formData.get('sks') as string, 10);
  const type = formData.get('type') as ClassType;
  const location = formData.get('location') as string;

  if (!courseId || !dayOfWeek || !startTimeStr || !sks || !type) {
    return { error: 'Semua data wajib diisi.' };
  }

  const [hours, minutes] = startTimeStr.split(':').map(Number);
  const startTime = new Date(0);
  startTime.setUTCHours(hours, minutes, 0, 0);
  const durationPerSks = type === 'TEORI' ? 50.5 : 153;
  const totalDuration = sks * durationPerSks;
  const endTime = new Date(startTime.getTime() + totalDuration * 60000);

  try {
   
    const schedule = await prisma.classSchedule.findFirst({
      where: { id: scheduleId, userId: session.user.id },
    });

    if (!schedule) {
      return { error: 'Jadwal tidak ditemukan atau Anda tidak punya akses.' };
    }

    await prisma.classSchedule.update({
      where: { id: scheduleId },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        sks,
        type,
        location,
        courseId,
      },
    });

    revalidatePath('/schedule');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal memperbarui jadwal.' };
  }
}

export async function deleteClassSchedule(scheduleId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Tidak diizinkan' };
  }
  try {
    const result = await prisma.classSchedule.deleteMany({
      where: {
        id: scheduleId,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return { error: 'Gagal menghapus jadwal atau jadwal tidak ditemukan.' };
    }

    revalidatePath('/schedule');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal menghapus jadwal.' };
  }
}