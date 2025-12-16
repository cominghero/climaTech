import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Task, TaskType, TaskStatus, Employee } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TaskFormModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  defaultEmployeeId?: string;
  defaultDate?: Date;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  task,
  isOpen,
  onClose,
  defaultEmployeeId,
  defaultDate,
}) => {
  const { employees, addTask, updateTask } = useApp();
  const activeEmployees = employees.filter(e => e.isActive);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'installation' as TaskType,
    status: 'pending' as TaskStatus,
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '10:00',
    assignedTo: [] as string[],
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    notes: '',
  });

  useEffect(() => {
    if (task) {
      const start = new Date(task.startDate);
      const end = new Date(task.endDate);
      setFormData({
        title: task.title,
        description: task.description,
        type: task.type,
        status: task.status,
        startDate: format(start, 'yyyy-MM-dd'),
        startTime: format(start, 'HH:mm'),
        endDate: format(end, 'yyyy-MM-dd'),
        endTime: format(end, 'HH:mm'),
        assignedTo: task.assignedTo,
        clientName: task.clientName,
        clientAddress: task.clientAddress,
        clientPhone: task.clientPhone || '',
        priority: task.priority,
        notes: task.notes || '',
      });
    } else {
      const date = defaultDate || new Date();
      setFormData({
        title: '',
        description: '',
        type: 'installation',
        status: 'pending',
        startDate: format(date, 'yyyy-MM-dd'),
        startTime: format(date, 'HH:mm'),
        endDate: format(date, 'yyyy-MM-dd'),
        endTime: format(new Date(date.getTime() + 60 * 60 * 1000), 'HH:mm'),
        assignedTo: defaultEmployeeId ? [defaultEmployeeId] : [],
        clientName: '',
        clientAddress: '',
        clientPhone: '',
        priority: 'medium',
        notes: '',
      });
    }
  }, [task, defaultEmployeeId, defaultDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const taskData: Task = {
      id: task?.id || `task-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: formData.status,
      startDate: startDateTime,
      endDate: endDateTime,
      assignedTo: formData.assignedTo,
      clientName: formData.clientName,
      clientAddress: formData.clientAddress,
      clientPhone: formData.clientPhone || undefined,
      priority: formData.priority,
      notes: formData.notes || undefined,
      createdAt: task?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (task) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const toggleEmployee = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(employeeId)
        ? prev.assignedTo.filter(id => id !== employeeId)
        : [...prev.assignedTo, employeeId],
    }));
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={value => setFormData(prev => ({ ...prev, type: value as TaskType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TASK_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridad *</Label>
              <Select
                value={formData.priority}
                onValueChange={value => setFormData(prev => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="startDate">Fecha inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={e => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="startTime">Hora inicio *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={e => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">Fecha fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={e => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endTime">Hora fin *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={e => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="clientName">Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="clientAddress">Dirección *</Label>
              <Input
                id="clientAddress"
                value={formData.clientAddress}
                onChange={e => setFormData(prev => ({ ...prev, clientAddress: e.target.value }))}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="clientPhone">Teléfono</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={e => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
              />
            </div>

            <div className="col-span-2">
              <Label>Técnicos asignados *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                {activeEmployees.map(emp => (
                  <div
                    key={emp.id}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                    onClick={() => toggleEmployee(emp.id)}
                  >
                    <Checkbox
                      checked={formData.assignedTo.includes(emp.id)}
                      onCheckedChange={() => toggleEmployee(emp.id)}
                    />
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

            <div className="col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {task ? 'Guardar cambios' : 'Crear tarea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
