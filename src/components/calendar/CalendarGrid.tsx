import React, { useMemo } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addDays,
  startOfMonth,
  endOfMonth,
  isToday,
  isSameMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp } from '@/contexts/AppContext';
import { CalendarDayCell } from './CalendarDayCell';
import { cn } from '@/lib/utils';
import { Employee, Task } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CalendarGridProps {
  onTaskClick: (task: Task) => void;
  onCellClick: (employee: Employee, date: Date) => void;
  onTaskDrop: (taskId: string, employeeId: string, date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  onTaskClick,
  onCellClick,
  onTaskDrop,
}) => {
  const { employees, selectedDate, calendarView } = useApp();

  const activeEmployees = employees.filter(e => e.isActive);

  const dates = useMemo(() => {
    if (calendarView === 'day') {
      return [selectedDate];
    } else if (calendarView === 'week') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);
      return eachDayOfInterval({ start, end });
    }
  }, [selectedDate, calendarView]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      <div className="min-w-max">
        {/* Header row with dates */}
        <div className="flex sticky top-0 z-10 bg-card border-b border-calendar-grid">
          {/* Employee column header */}
          <div className="w-48 flex-shrink-0 p-3 border-r border-calendar-grid bg-muted/50">
            <span className="text-sm font-semibold text-muted-foreground">Técnicos</span>
          </div>
          {/* Date headers */}
          {dates.map(date => (
            <div
              key={date.toISOString()}
              className={cn(
                'flex-1 min-w-[120px] p-2 text-center border-r border-calendar-grid',
                isToday(date) ? 'bg-primary/10' : 'bg-muted/30'
              )}
            >
              <div className="text-xs font-medium text-muted-foreground uppercase">
                {format(date, 'EEE', { locale: es })}
              </div>
              <div className={cn(
                'text-lg font-semibold',
                isToday(date) && 'text-primary'
              )}>
                {format(date, 'd')}
              </div>
              {calendarView !== 'day' && (
                <div className="text-xs text-muted-foreground">
                  {format(date, 'MMM', { locale: es })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Employee rows */}
        {activeEmployees.map(employee => (
          <div key={employee.id} className="flex">
            {/* Employee info */}
            <div className="w-48 flex-shrink-0 p-2 border-r border-b border-calendar-grid bg-card sticky left-0 z-[5]">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(employee.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{employee.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                </div>
              </div>
            </div>
            {/* Day cells */}
            {dates.map(date => (
              <div key={`${employee.id}-${date.toISOString()}`} className="flex-1 min-w-[120px]">
                <CalendarDayCell
                  employee={employee}
                  date={date}
                  onTaskClick={onTaskClick}
                  onCellClick={onCellClick}
                  onTaskDrop={onTaskDrop}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
