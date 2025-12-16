import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskFormModal } from './TaskFormModal';
import { TaskDetailModal } from './TaskDetailModal';

export const TaskList: React.FC = () => {
  const { tasks } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || task.type === filterType;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleEditTask = () => {
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Tareas</h2>
          <Button onClick={handleNewTask} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {sortedTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No se encontraron tareas
            </p>
          ) : (
            sortedTasks.map(task => (
              <div
                key={task.id}
                onClick={() => handleTaskClick(task)}
                className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className={cn(`task-${task.type}`, 'text-xs')}>
                    {TASK_TYPE_LABELS[task.type]}
                  </Badge>
                  <Badge className={cn(PRIORITY_COLORS[task.priority], 'text-xs')}>
                    {PRIORITY_LABELS[task.priority]}
                  </Badge>
                </div>
                <h3 className="font-medium text-sm mb-1 line-clamp-1">{task.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{task.clientName}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(task.startDate), 'd MMM', { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{format(new Date(task.startDate), 'HH:mm')}</span>
                  </div>
                  {task.assignedTo.length > 1 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{task.assignedTo.length}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

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
        }}
      />
    </div>
  );
};
