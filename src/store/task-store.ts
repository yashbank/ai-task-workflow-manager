import { create } from "zustand";
import type { Task } from "@prisma/client";

type TaskState = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  replaceTask: (task: Task) => void;
  removeTask: (id: string) => void;
  patchTask: (id: string, partial: Partial<Task>) => void;
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((s) => ({ tasks: [task, ...s.tasks] })),
  replaceTask: (task) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  removeTask: (id) =>
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
    })),
  patchTask: (id, partial) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...partial } : t)),
    })),
}));
