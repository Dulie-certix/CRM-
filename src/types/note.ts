export type NoteStatus = 'pending' | 'completed';

export interface Note {
  _id: string;
  title: string;
  description: string;
  status: NoteStatus;
  image?: string;
  dueDate?: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteStats {
  total: number;
  completed: number;
  pending: number;
}

export interface NoteFormData {
  title: string;
  description: string;
  status: NoteStatus;
  dueDate?: string;
  image?: FileList;
}
