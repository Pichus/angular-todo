export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
}

export interface FilterState {
  search: string;
  status: TaskStatus | 'all';
}

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];
