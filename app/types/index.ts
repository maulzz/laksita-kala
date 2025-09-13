// src/types/index.ts


export type TaskPriority = 'RENDAH' | 'SEDANG' | 'PENTING';
export type TaskStatus = 'BELUM_DIMULAI' | 'SEDANG_DIKERJAKAN' | 'SELESAI';
export type TaskType = 'TUGAS_INDIVIDU' | 'TUGAS_KELOMPOK' | 'KUIS' | 'UTS' | 'UAS';
export type DayOfWeek = 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU' | 'MINGGU';
export type ClassType = 'TEORI' | 'PRAKTIKUM';

export interface Course {
  id: string;
  name: string;
  color: string;
  lecturer: string;
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

export interface TaskData {
  title: string;
  courseId: string;
  startDate: string;
  dueDate: string;
  priority: TaskPriority;
  taskType: TaskType;
  status: TaskStatus;
}