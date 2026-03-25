export type TaskStatus = 'planned' | 'upcoming' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'urgent';

export interface Task {
  _id: string;
  title: string;
  tags: string[];
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  subtasks?: { total: number; done: number };
  assignees?: string[];
  attachments?: number;
  comments?: number;
  createdAt: string;
  updatedAt: string;
}
