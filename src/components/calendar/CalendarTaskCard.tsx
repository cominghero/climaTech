import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '@/types';
import { TASK_TYPE_COLORS, TASK_TYPE_LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Clock, Users, MapPin, AlertTriangle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface CalendarTaskCardProps {
  task: Task;
  onClick: () => void;
  compact?: boolean;
}

export const CalendarTaskCard: React.FC<CalendarTaskCardProps> = ({
  task,
  onClick,
  compact = false,
}) => {
  const { getEmployeeById } = useApp();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const assignedNames = task.assignedTo
    .map(id => getEmployeeById(id)?.name.split(' ')[0])
    .filter(Boolean)
    .join(', ');

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={cn(
        'rounded-md px-2 py-1.5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md',
        TASK_TYPE_COLORS[task.type],
        task.priority === 'urgent' && 'ring-2 ring-red-400 ring-offset-1'
      )}
    >
      <div className="flex items-start gap-1">
        {task.priority === 'urgent' && (
          <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium truncate', compact ? 'text-xs' : 'text-sm')}>
            {task.title}
          </p>
          {!compact && (
            <>
              <div className="flex items-center gap-1 mt-1 text-xs opacity-90">
                <Clock className="h-3 w-3" />
                <span>
                  {format(new Date(task.startDate), 'HH:mm')} - {format(new Date(task.endDate), 'HH:mm')}
                </span>
              </div>
              {task.assignedTo.length > 1 && (
                <div className="flex items-center gap-1 mt-0.5 text-xs opacity-90">
                  <Users className="h-3 w-3" />
                  <span>{assignedNames}</span>
                </div>
              )}
            </>
          )}
          {compact && (
            <div className="flex items-center gap-1 mt-0.5 text-[10px] opacity-90">
              <Clock className="h-2.5 w-2.5" />
              <span>{format(new Date(task.startDate), 'HH:mm')}</span>
              {task.assignedTo.length > 1 && (
                <>
                  <Users className="h-2.5 w-2.5 ml-1" />
                  <span>{task.assignedTo.length}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
