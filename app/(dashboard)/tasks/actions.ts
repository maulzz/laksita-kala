// app/(dashboard)/tasks/actions.ts

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Task, TaskPriority, TaskStatus, TaskType } from '@/app/types';


import { revalidatePath } from 'next/cache';

interface TaskData {
  title: string;
  description?: string | null;
  courseId: string;
  startDate: string;
  dueDate: string;
  priority: TaskPriority;
  taskType: TaskType;
  status: TaskStatus;

}

export async function getTasks(): Promise<Task[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const tasksFromDb = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const tasks: Task[] = tasksFromDb.map((task) => ({
      ...task,
      startDate: task.startDate.toISOString(),
      dueDate: task.dueDate.toISOString(),
    }));

    return tasks; 
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function createTask(data: TaskData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Tidak diizinkan' };
  }

  try {

    if (!data.title || !data.courseId || !data.startDate || !data.dueDate) {
      return { error: 'Data yang wajib diisi tidak lengkap.' };
    }
    
    await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        priority: data.priority,
        taskType: data.taskType,
        status: data.status,
        courseId: data.courseId,
        userId: session.user.id,
      },
    });

  
    revalidatePath('/tasks');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal membuat tugas.' };
  }
}

export async function updateTask(taskId: string, data: Partial<TaskData>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Tidak diizinkan' };
  }

  try {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId: session.user.id },
    });

    if (!task) {
      return { error: 'Tugas tidak ditemukan atau Anda tidak punya akses.' };
    }

    const { courseId, ...restOfData } = data;
    const dataToUpdate: any = {
      ...restOfData,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    
    if (courseId) {
      dataToUpdate.course = {
        connect: { id: courseId },
      };
    }
    
    await prisma.task.update({
      where: {
        id: taskId,
      },
      data: dataToUpdate,
    });

    revalidatePath('/tasks');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal memperbarui tugas.' };
  }
}


export async function deleteTask(taskId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: 'Tidak diizinkan' };
  }

  try {
    const result = await prisma.task.deleteMany({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    });

    if (result.count === 0) {
      return { error: 'Gagal menghapus tugas atau tugas tidak ditemukan.' };
    }

    revalidatePath('/tasks');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Gagal menghapus tugas.' };
  }
}
