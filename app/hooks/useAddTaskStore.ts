// src/hooks/useAddTaskStore.ts

import { create } from 'zustand';

interface AddTaskStore {
  isOpen: boolean;
  refreshKey: number; 
  openModal: () => void;
  closeModal: () => void;
  triggerRefresh: () => void; 
}

export const useAddTaskStore = create<AddTaskStore>((set) => ({
  isOpen: false,
  refreshKey: 0,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));