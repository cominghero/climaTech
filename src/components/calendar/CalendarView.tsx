import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task, Employee } from '@/types';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { TaskDetailModal } from '../tasks/TaskDetailModal';
import { TaskFormModal } from '../tasks/TaskFormModal';
import { differenceInMinutes, addMinutes, setHours, setMinutes } from 'date-fns';

export const CalendarView: React.FC = () => {
  const { moveTask, tasks } = useApp();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTaskDefaults, setNewTaskDefaults] = useState<{ employeeId?: string; date?: Date }>({});

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleCellClick = (employee: Employee, date: Date) => {
    setNewTaskDefaults({
      employeeId: employee.id,
      date: setMinutes(setHours(date, 9), 0),
    });
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleTaskDrop = (taskId: string, employeeId: string, date: Date) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Calculate duration
    const duration = differenceInMinutes(new Date(task.endDate), new Date(task.startDate));
    
    // Keep the same time, just change the date
    const originalStart = new Date(task.startDate);
    const newStart = new Date(date);
    newStart.setHours(originalStart.getHours(), originalStart.getMinutes(), 0, 0);
    const newEnd = addMinutes(newStart, duration);

    moveTask(taskId, newStart, newEnd);
  };

  const handleEditTask = () => {
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <CalendarHeader />
      <CalendarGrid
        onTaskClick={handleTaskClick}
        onCellClick={handleCellClick}
        onTaskDrop={handleTaskDrop}
      />
      
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEditTask}
      />
      
      <TaskFormModal
        task={selectedTask}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTask(null);
          setNewTaskDefaults({});
        }}
        defaultEmployeeId={newTaskDefaults.employeeId}
        defaultDate={newTaskDefaults.date}
      />
    </div>
  );
};
