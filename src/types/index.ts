export type TaskType = 'installation' | 'repair' | 'maintenance' | 'inspection' | 'emergency';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type LeaveType = 'vacation' | 'sick' | 'personal' | 'other';

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  isActive: boolean;
  skills: string[];
}

export interface Leave {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  notes?: string;
  approved: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  assignedTo: string[]; // Employee IDs
  clientName: string;
  clientAddress: string;
  clientPhone?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export type CalendarView = 'day' | 'week' | 'month';
