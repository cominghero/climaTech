import React from 'react';
import { 
  format, 
  addDays, 
  addWeeks, 
  addMonths, 
  subDays, 
  subWeeks, 
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { CalendarView } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CalendarHeader: React.FC = () => {
  const { selectedDate, setSelectedDate, calendarView, setCalendarView } = useApp();

  const navigatePrev = () => {
    if (calendarView === 'day') {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (calendarView === 'week') {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const navigateNext = () => {
    if (calendarView === 'day') {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (calendarView === 'week') {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const getDateLabel = () => {
    if (calendarView === 'day') {
      return format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es });
    } else if (calendarView === 'week') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(start, 'd MMM', { locale: es })} - ${format(end, 'd MMM yyyy', { locale: es })}`;
    } else {
      return format(selectedDate, "MMMM 'de' yyyy", { locale: es });
    }
  };

  const viewOptions: { value: CalendarView; label: string }[] = [
    { value: 'day', label: 'Día' },
    { value: 'week', label: 'Semana' },
    { value: 'month', label: 'Mes' },
  ];

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={goToToday}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Hoy
        </Button>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={navigatePrev}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold capitalize">{getDateLabel()}</h2>
      </div>

      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        {viewOptions.map(option => (
          <Button
            key={option.value}
            variant={calendarView === option.value ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCalendarView(option.value)}
            className={cn(
              'px-4',
              calendarView === option.value && 'shadow-sm'
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
