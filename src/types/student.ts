export interface Student {
  id: string;
  name: string;
  email: string;
  userId: string;
  batchId: string;
  isSelected: boolean; // Changed to required
}

export interface Batch {
  id: string;
  name: string;
  students: Student[];
  isExpanded?: boolean;
}