// src/types/index.ts


export type TaskPriority = 'RENDAH' | 'SEDANG' | 'PENTING';
export type TaskStatus = 'BELUM_DIMULAI' | 'SEDANG_DIKERJAKAN' | 'SELESAI';
export type TaskType = 'TUGAS_INDIVIDU' | 'TUGAS_KELOMPOK' | 'KUIS' | 'UTS' | 'UAS';

export interface Course {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  taskType: TaskType;
  courseId: string;
  course: Course; 
}