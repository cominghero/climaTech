import React, { useState } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { CalendarView } from '@/components/calendar/CalendarView';
import { TaskList } from '@/components/tasks/TaskList';
import { EmployeePanel } from '@/components/employees/EmployeePanel';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ClipboardList, 
  Users, 
  Menu,
  Snowflake,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ActivePanel = 'calendar' | 'tasks' | 'employees';

const AppContent: React.FC = () => {
  const [activePanel, setActivePanel] = useState<ActivePanel>('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'calendar' as const, label: 'Calendario', icon: Calendar },
    { id: 'tasks' as const, label: 'Tareas', icon: ClipboardList },
    { id: 'employees' as const, label: 'Empleados', icon: Users },
  ];

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Snowflake className="h-6 w-6" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in">
              <h1 className="font-semibold text-sidebar-foreground">ClimaTech</h1>
              <p className="text-xs text-sidebar-foreground/60">Gestión de técnicos</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Button
              key={item.id}
              variant={activePanel === item.id ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                activePanel === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground',
                !sidebarOpen && 'justify-center px-2'
              )}
              onClick={() => setActivePanel(item.id)}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>

        {/* Toggle */}
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex overflow-hidden">
        {activePanel === 'calendar' && (
          <div className="flex-1 flex">
            <div className="flex-1">
              <CalendarView />
            </div>
            <aside className="w-80 border-l border-border hidden lg:block">
              <TaskList />
            </aside>
          </div>
        )}
        {activePanel === 'tasks' && (
          <div className="flex-1">
            <TaskList />
          </div>
        )}
        {activePanel === 'employees' && (
          <div className="flex-1">
            <EmployeePanel />
          </div>
        )}
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
