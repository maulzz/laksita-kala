// app/api/tasks/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const revalidate = 0;


export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        course: true, 
      },
      orderBy: {
        dueDate: 'asc', 
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: 'Gagal mengambil data tugas.' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, courseId, startDate, dueDate, priority, taskType, status } = body;


    if (!title || !courseId || !startDate || !dueDate) {
      return NextResponse.json({ error: 'Data yang wajib diisi tidak lengkap.' }, { status: 400 });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        startDate: new Date(startDate), 
        dueDate: new Date(dueDate),     
        priority,
        taskType,
        status,
        courseId,
        userId: session.user.id, 
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: 'Gagal membuat tugas.' }, { status: 500 });
  }
}