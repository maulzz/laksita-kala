// app/(dashboard)/courses/actions.ts

"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCourses() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  try {
    const courses = await prisma.course.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return courses;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function createCourse(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Tidak diizinkan." };

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  const lecturer = formData.get('lecturer') as string;

  if (!name || !color) return { error: "Nama dan warna wajib diisi." };

  try {
    await prisma.course.create({
      data: { name, color, lecturer, userId: session.user.id },
    });

    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Gagal membuat mata kuliah." };
  }
}

export async function updateCourse(courseId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Tidak diizinkan." };

  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  const lecturer = formData.get('lecturer') as string;

  if (!name || !color) return { error: "Nama dan warna wajib diisi." };

  try {
    await prisma.course.updateMany({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: { name, color, lecturer },
    });
    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "Gagal memperbarui mata kuliah." };
  }
}

export async function deleteCourse(courseId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Tidak diizinkan." };

  try {
    const course = await prisma.course.findFirst({
      where: { id: courseId, userId: session.user.id },
    });
    if (!course) return { error: "Mata kuliah tidak ditemukan." };

    await prisma.task.deleteMany({
      where: { courseId: courseId },
    });

    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/courses");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus mata kuliah." };
  }
}
