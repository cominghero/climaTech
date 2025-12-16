import { TaskType, TaskStatus, LeaveType } from '@/types';

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  installation: 'task-installation',
  repair: 'task-repair',
  maintenance: 'task-maintenance',
  inspection: 'task-inspection',
  emergency: 'task-emergency',
};

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  installation: 'Instalación',
  repair: 'Reparación',
  maintenance: 'Mantenimiento',
  inspection: 'Inspección',
  emergency: 'Emergencia',
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En progreso',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  vacation: 'Vacaciones',
  sick: 'Baja médica',
  personal: 'Asunto personal',
  other: 'Otro',
};

export const LEAVE_TYPE_COLORS: Record<LeaveType, string> = {
  vacation: 'bg-blue-100 text-blue-800 border-blue-200',
  sick: 'bg-red-100 text-red-800 border-red-200',
  personal: 'bg-amber-100 text-amber-800 border-amber-200',
  other: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-amber-100 text-amber-800',
  urgent: 'bg-red-100 text-red-800',
};

export const WORKING_HOURS = {
  start: 7,
  end: 20,
};
