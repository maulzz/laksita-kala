// app/api/courses/[id]/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Tidak diizinkan', { status: 401 });

  try {
    const { name, color } = await request.json();
    const courseId = params.id;

    if (!name || !color) {
      return new NextResponse('Nama dan warna wajib diisi', { status: 400 });
    }

    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id, 
      },
      data: { name, color },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('[COURSE_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}


export async function DELETE(
  request: Request, 
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return new NextResponse('Tidak diizinkan', { status: 401 });

  try {
    const courseId = params.id;
    
    await prisma.course.delete({
      where: {
        id: courseId,
        userId: session.user.id, 
      },
    });

    return new NextResponse('Mata kuliah berhasil dihapus', { status: 200 });
  } catch (error) {
    console.error('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}