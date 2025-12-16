import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Task } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  FileText, 
  Edit, 
  Trash2,
  Calendar,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { getEmployeeById, deleteTask } = useApp();

  if (!task) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const assignedEmployees = task.assignedTo.map(id => getEmployeeById(id)).filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge className={cn('mb-2', `task-${task.type}`)}>
                {TASK_TYPE_LABELS[task.type]}
              </Badge>
              <DialogTitle className="text-xl">{task.title}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Status and Priority */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">{TASK_STATUS_LABELS[task.status]}</Badge>
            <Badge className={PRIORITY_COLORS[task.priority]}>
              {PRIORITY_LABELS[task.priority]}
            </Badge>
          </div>

          {/* Date and Time */}
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(task.startDate), "EEEE, d 'de' MMMM", { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(new Date(task.startDate), 'HH:mm')} - {format(new Date(task.endDate), 'HH:mm')}
            </span>
          </div>

          {/* Client Info */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{task.clientName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{task.clientAddress}</span>
            </div>
            {task.clientPhone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{task.clientPhone}</span>
              </div>
            )}
          </div>

          {/* Assigned Technicians */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Técnicos asignados</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {assignedEmployees.map(emp => emp && (
                <div
                  key={emp.id}
                  className="flex items-center gap-2 bg-muted/50 rounded-full pl-1 pr-3 py-1"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(emp.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{emp.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <div className="flex items-center gap-2 mb-1 text-sm font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Descripción</span>
              </div>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">📝 {task.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            <Button onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
