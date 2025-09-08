// app/api/courses/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';


export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const courses = await prisma.course.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: 'Gagal mengambil data mata kuliah.' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Tidak diizinkan' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { name, color } = await request.json();

    if (!name || !color) {
      return NextResponse.json({ error: 'Nama dan warna mata kuliah wajib diisi.' }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        name,
        color,
        userId: userId,
      },
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json({ error: 'Gagal membuat mata kuliah.' }, { status: 500 });
  }
}

