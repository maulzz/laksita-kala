// app/api/tasks/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const revalidate = 0;

export async function PATCH(request: Request, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Tidak diizinkan', { status: 401 });
  }

  try {
    const taskId =context.params.id;
    const body = await request.json();
    const { title, description, courseId, startDate, dueDate, priority, taskType, status } = body;

    const updatedTask = await prisma.task.updateMany({
      where: {
        id: taskId,
        userId: session.user.id, 
      },
      data: {
        title,
        description,
        courseId,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        priority,
        taskType,
        status,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('[TASK_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Tidak diizinkan', { status: 401 });
  }

  try {
    const taskId = params.id;
    
    await prisma.task.deleteMany({
      where: {
        id: taskId,
        userId: session.user.id, 
      },
    });

    return new NextResponse('Tugas berhasil dihapus', { status: 200 });
  } catch (error) {
    console.error('[TASK_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}