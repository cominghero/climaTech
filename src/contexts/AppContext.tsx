import React, { createContext, useContext, useState, useCallback } from 'react';
import { Employee, Task, Leave, CalendarView } from '@/types';
import { sampleEmployees, sampleTasks, sampleLeaves } from '@/data/sampleData';

interface AppContextType {
  employees: Employee[];
  tasks: Task[];
  leaves: Leave[];
  selectedDate: Date;
  calendarView: CalendarView;
  selectedTask: Task | null;
  selectedEmployee: Employee | null;
  setSelectedDate: (date: Date) => void;
  setCalendarView: (view: CalendarView) => void;
  setSelectedTask: (task: Task | null) => void;
  setSelectedEmployee: (employee: Employee | null) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, newStart: Date, newEnd: Date) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  addLeave: (leave: Leave) => void;
  updateLeave: (leave: Leave) => void;
  deleteLeave: (leaveId: string) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getTasksForEmployee: (employeeId: string, date: Date) => Task[];
  getLeaveForEmployee: (employeeId: string, date: Date) => Leave | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [leaves, setLeaves] = useState<Leave[]>(sampleLeaves);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const addTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
  }, []);

  const updateTask = useCallback((task: Task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...task, updatedAt: new Date() } : t));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const moveTask = useCallback((taskId: string, newStart: Date, newEnd: Date) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, startDate: newStart, endDate: newEnd, updatedAt: new Date() };
      }
      return t;
    }));
  }, []);

  const addEmployee = useCallback((employee: Employee) => {
    setEmployees(prev => [...prev, employee]);
  }, []);

  const updateEmployee = useCallback((employee: Employee) => {
    setEmployees(prev => prev.map(e => e.id === employee.id ? employee : e));
  }, []);

  const addLeave = useCallback((leave: Leave) => {
    setLeaves(prev => [...prev, leave]);
  }, []);

  const updateLeave = useCallback((leave: Leave) => {
    setLeaves(prev => prev.map(l => l.id === leave.id ? leave : l));
  }, []);

  const deleteLeave = useCallback((leaveId: string) => {
    setLeaves(prev => prev.filter(l => l.id !== leaveId));
  }, []);

  const getEmployeeById = useCallback((id: string) => {
    return employees.find(e => e.id === id);
  }, [employees]);

  const getTasksForEmployee = useCallback((employeeId: string, date: Date) => {
    return tasks.filter(task => {
      if (!task.assignedTo.includes(employeeId)) return false;
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      return taskStart <= dayEnd && taskEnd >= dayStart;
    });
  }, [tasks]);

  const getLeaveForEmployee = useCallback((employeeId: string, date: Date) => {
    return leaves.find(leave => {
      if (leave.employeeId !== employeeId) return false;
      const leaveStart = new Date(leave.startDate);
      leaveStart.setHours(0, 0, 0, 0);
      const leaveEnd = new Date(leave.endDate);
      leaveEnd.setHours(23, 59, 59, 999);
      return date >= leaveStart && date <= leaveEnd;
    });
  }, [leaves]);

  return (
    <AppContext.Provider
      value={{
        employees,
        tasks,
        leaves,
        selectedDate,
        calendarView,
        selectedTask,
        selectedEmployee,
        setSelectedDate,
        setCalendarView,
        setSelectedTask,
        setSelectedEmployee,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        addEmployee,
        updateEmployee,
        addLeave,
        updateLeave,
        deleteLeave,
        getEmployeeById,
        getTasksForEmployee,
        getLeaveForEmployee,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
