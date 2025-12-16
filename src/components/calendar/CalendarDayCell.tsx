import React from 'react';
import { format, isToday, isWeekend } from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { CalendarTaskCard } from './CalendarTaskCard';
import { Employee, Task } from '@/types';

interface CalendarDayCellProps {
  employee: Employee;
  date: Date;
  onTaskClick: (task: Task) => void;
  onCellClick: (employee: Employee, date: Date) => void;
  onTaskDrop: (taskId: string, employeeId: string, date: Date) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  employee,
  date,
  onTaskClick,
  onCellClick,
  onTaskDrop,
}) => {
  const { getTasksForEmployee, getLeaveForEmployee } = useApp();
  const tasks = getTasksForEmployee(employee.id, date);
  const leave = getLeaveForEmployee(employee.id, date);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-calendar-hover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-calendar-hover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-calendar-hover');
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      onTaskDrop(taskId, employee.id, date);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCellClick(employee, date);
    }
  };

  return (
    <div
      className={cn(
        'min-h-[100px] border-r border-b border-calendar-grid p-1 transition-colors cursor-pointer',
        isToday(date) && 'bg-calendar-today',
        isWeekend(date) && !isToday(date) && 'bg-calendar-weekend',
        !employee.isActive && 'opacity-50'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {leave && (
        <div className={cn(
          'text-xs px-2 py-1 rounded mb-1 border',
          leave.type === 'vacation' && 'bg-blue-100 text-blue-800 border-blue-200',
          leave.type === 'sick' && 'bg-red-100 text-red-800 border-red-200',
          leave.type === 'personal' && 'bg-amber-100 text-amber-800 border-amber-200',
        )}>
          {leave.type === 'vacation' && '🏖️ Vacaciones'}
          {leave.type === 'sick' && '🏥 Baja médica'}
          {leave.type === 'personal' && '📋 Asunto personal'}
        </div>
      )}
      <div className="space-y-1">
        {tasks.map(task => (
          <CalendarTaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            compact
          />
        ))}
      </div>
    </div>
  );
};
