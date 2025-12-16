import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Employee, Leave, LeaveType } from '@/types';
import { LEAVE_TYPE_LABELS, LEAVE_TYPE_COLORS } from '@/lib/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Check,
  X,
  Pencil,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const EmployeePanel: React.FC = () => {
  const { employees, leaves, addEmployee, updateEmployee, addLeave, updateLeave, deleteLeave } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<Leave | null>(null);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = showInactive || emp.isActive;
    return matchesSearch && matchesActive;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getEmployeeLeaves = (employeeId: string) => {
    return leaves.filter(l => l.employeeId === employeeId);
  };

  // Employee Form
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    skills: '',
    isActive: true,
  });

  // Leave Form
  const [leaveForm, setLeaveForm] = useState({
    type: 'vacation' as LeaveType,
    startDate: '',
    endDate: '',
    notes: '',
    approved: false,
  });

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setEmployeeForm({
      name: '',
      email: '',
      phone: '',
      role: 'Técnico',
      skills: '',
      isActive: true,
    });
    setIsEmployeeModalOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    setEmployeeForm({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      skills: emp.skills.join(', '),
      isActive: emp.isActive,
    });
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = () => {
    const empData: Employee = {
      id: selectedEmployee?.id || `emp-${Date.now()}`,
      name: employeeForm.name,
      email: employeeForm.email,
      phone: employeeForm.phone,
      role: employeeForm.role,
      skills: employeeForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      isActive: employeeForm.isActive,
    };

    if (selectedEmployee) {
      updateEmployee(empData);
    } else {
      addEmployee(empData);
    }
    setIsEmployeeModalOpen(false);
  };

  const handleAddLeave = (emp: Employee) => {
    setSelectedEmployee(emp);
    setEditingLeave(null);
    setLeaveForm({
      type: 'vacation',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      approved: false,
    });
    setIsLeaveModalOpen(true);
  };

  const handleSaveLeave = () => {
    if (!selectedEmployee) return;

    const leaveData: Leave = {
      id: editingLeave?.id || `leave-${Date.now()}`,
      employeeId: selectedEmployee.id,
      type: leaveForm.type,
      startDate: new Date(leaveForm.startDate),
      endDate: new Date(leaveForm.endDate),
      notes: leaveForm.notes || undefined,
      approved: leaveForm.approved,
    };

    if (editingLeave) {
      updateLeave(leaveData);
    } else {
      addLeave(leaveData);
    }
    setIsLeaveModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Empleados</h2>
          <Button onClick={handleAddEmployee} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showInactive"
            checked={showInactive}
            onCheckedChange={(checked) => setShowInactive(checked as boolean)}
          />
          <Label htmlFor="showInactive" className="text-sm cursor-pointer">
            Mostrar inactivos
          </Label>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredEmployees.map(emp => (
            <Card key={emp.id} className={cn(!emp.isActive && 'opacity-60')}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(emp.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{emp.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditEmployee(emp)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{emp.role}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{emp.phone}</span>
                    </div>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {emp.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Leaves */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">Ausencias</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleAddLeave(emp)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Añadir
                        </Button>
                      </div>
                      {getEmployeeLeaves(emp.id).map(leave => (
                        <div
                          key={leave.id}
                          className={cn(
                            'text-xs px-2 py-1 rounded border mb-1 flex items-center justify-between',
                            LEAVE_TYPE_COLORS[leave.type]
                          )}
                        >
                          <span>
                            {LEAVE_TYPE_LABELS[leave.type]}: {format(new Date(leave.startDate), 'd MMM', { locale: es })} - {format(new Date(leave.endDate), 'd MMM', { locale: es })}
                          </span>
                          <div className="flex items-center gap-1">
                            {leave.approved ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <X className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Employee Modal */}
      <Dialog open={isEmployeeModalOpen} onOpenChange={setIsEmployeeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEmployee ? 'Editar empleado' : 'Nuevo empleado'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="empName">Nombre *</Label>
              <Input
                id="empName"
                value={employeeForm.name}
                onChange={e => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="empEmail">Email *</Label>
              <Input
                id="empEmail"
                type="email"
                value={employeeForm.email}
                onChange={e => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="empPhone">Teléfono *</Label>
              <Input
                id="empPhone"
                value={employeeForm.phone}
                onChange={e => setEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="empRole">Rol</Label>
              <Select
                value={employeeForm.role}
                onValueChange={value => setEmployeeForm(prev => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Técnico Junior">Técnico Junior</SelectItem>
                  <SelectItem value="Técnico">Técnico</SelectItem>
                  <SelectItem value="Técnico Senior">Técnico Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="empSkills">Habilidades (separadas por coma)</Label>
              <Input
                id="empSkills"
                value={employeeForm.skills}
                onChange={e => setEmployeeForm(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Instalación, Reparación, Mantenimiento"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="empActive"
                checked={employeeForm.isActive}
                onCheckedChange={(checked) => setEmployeeForm(prev => ({ ...prev, isActive: checked as boolean }))}
              />
              <Label htmlFor="empActive">Activo</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsEmployeeModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveEmployee}>
                {selectedEmployee ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Leave Modal */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLeave ? 'Editar ausencia' : 'Nueva ausencia'}
              {selectedEmployee && ` - ${selectedEmployee.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="leaveType">Tipo *</Label>
              <Select
                value={leaveForm.type}
                onValueChange={value => setLeaveForm(prev => ({ ...prev, type: value as LeaveType }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="leaveStart">Fecha inicio *</Label>
                <Input
                  id="leaveStart"
                  type="date"
                  value={leaveForm.startDate}
                  onChange={e => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="leaveEnd">Fecha fin *</Label>
                <Input
                  id="leaveEnd"
                  type="date"
                  value={leaveForm.endDate}
                  onChange={e => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="leaveNotes">Notas</Label>
              <Textarea
                id="leaveNotes"
                value={leaveForm.notes}
                onChange={e => setLeaveForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="leaveApproved"
                checked={leaveForm.approved}
                onCheckedChange={(checked) => setLeaveForm(prev => ({ ...prev, approved: checked as boolean }))}
              />
              <Label htmlFor="leaveApproved">Aprobada</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsLeaveModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLeave}>
                {editingLeave ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
