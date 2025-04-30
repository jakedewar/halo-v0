import { useState, useEffect } from 'react';
import { Plus, Link, Link2Off, CheckSquare, Square, X, Globe, CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card } from '@/components/ui/card.tsx';
import { Calendar } from '@/components/ui/calendar.tsx';
import { format } from 'date-fns';

interface Task {
  id: string;
  content: string;
  completed: boolean;
  url?: string;
  timestamp: number;
  dueDate?: number;
}

interface TasksProps {
  showGlobal: boolean;
  onToggleView?: () => void;
}

export default function Tasks({ showGlobal, onToggleView }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [linkToUrl, setLinkToUrl] = useState(!showGlobal);
  const [dueDate, setDueDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const currentUrl = window.location.href;

  // Load existing tasks when component mounts
  useEffect(() => {
    chrome.storage.local.get(['tasks'], (result) => {
      if (result.tasks) {
        setTasks(result.tasks);
      }
    });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: crypto.randomUUID(),
      content: newTask,
      completed: false,
      url: linkToUrl ? currentUrl : undefined,
      timestamp: Date.now(),
      dueDate: dueDate?.getTime()
    };

    chrome.storage.local.get(['tasks'], (result) => {
      const updatedTasks = [...(result.tasks || []), task];
      chrome.storage.local.set({ tasks: updatedTasks });
      setTasks(updatedTasks);
      setNewTask('');
      setDueDate(undefined);
      setIsCalendarOpen(false);
    });
  };

  const toggleTask = (taskId: string) => {
    chrome.storage.local.get(['tasks'], (result) => {
      const updatedTasks = (result.tasks || []).map((t: Task) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      chrome.storage.local.set({ tasks: updatedTasks });
      setTasks(updatedTasks);
    });
  };

  const deleteTask = (taskId: string) => {
    chrome.storage.local.get(['tasks'], (result) => {
      const updatedTasks = (result.tasks || []).filter((t: Task) => t.id !== taskId);
      chrome.storage.local.set({ tasks: updatedTasks });
      setTasks(updatedTasks);
    });
  };

  // Filter tasks based on showGlobal
  const filteredTasks = showGlobal 
    ? tasks 
    : tasks.filter(task => task.url === currentUrl);

  return (
    <div className="ext-flex ext-flex-col ext-gap-3">
      {/* Input Area */}
      <div className="ext-flex ext-flex-col ext-gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addTask()}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          className="ext-bg-transparent ext-border ext-border-input/50 ext-shadow-sm focus-visible:ext-ring-1 focus-visible:ext-ring-ring ext-text-sm"
        />
        
        <div className="ext-flex ext-gap-2 ext-mb-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setLinkToUrl(!linkToUrl)}
            className="ext-h-8 ext-px-0 hover:ext-bg-transparent"
          >
            {linkToUrl ? <Link size={16} /> : <Link2Off size={16} />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="ext-flex ext-items-center ext-gap-2 ext-flex-1 ext-h-8 ext-justify-start ext-px-0 hover:ext-bg-transparent"
          >
            <CalendarIcon size={16} />
            <span className="ext-text-sm">
              {dueDate ? format(dueDate, "MMM d, yyyy") : "Set due date"}
            </span>
            {isCalendarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>

        {/* Calendar */}
        {isCalendarOpen && (
          <div className="ext-border-t ext-border-b ext-border-border/40 ext-bg-accent/5">
            <div className="ext-px-4">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  if (date) setIsCalendarOpen(false);
                }}
                fromDate={new Date()}
                initialFocus
              />
            </div>
          </div>
        )}

        <Button
          size="sm"
          onClick={addTask}
          className="ext-w-full ext-h-9 ext-bg-primary ext-text-primary-foreground hover:ext-bg-primary/90"
        >
          <Plus size={16} className="ext-mr-2" /> Add Task
        </Button>
      </div>

      {/* View Toggle */}
      <div className="ext-flex ext-gap-2">
        <Button
          size="sm"
          variant={showGlobal ? "default" : "outline"}
          className="ext-flex-1 ext-items-center ext-gap-2 ext-h-9"
          onClick={onToggleView}
        >
          <Globe size={16} />
          All Tasks
        </Button>
        <Button
          size="sm"
          variant={!showGlobal ? "default" : "outline"}
          className="ext-flex-1 ext-items-center ext-gap-2 ext-h-9"
          onClick={onToggleView}
        >
          <Link size={16} />
          Page Tasks
        </Button>
      </div>

      {/* Tasks List */}
      <div className="ext-flex ext-flex-col ext-gap-2">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="ext-w-full">
            <div className="ext-flex ext-items-center ext-gap-2 ext-p-3">
              <Button
                size="sm"
                variant="ghost"
                className="ext-p-0 hover:ext-bg-transparent ext-shrink-0"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? (
                  <CheckSquare size={16} className="ext-text-primary" />
                ) : (
                  <Square size={16} />
                )}
              </Button>
              <div className="ext-flex ext-flex-col ext-flex-1 ext-min-w-0">
                <span className={`ext-text-sm ext-truncate ${task.completed ? 'ext-line-through ext-text-muted-foreground' : ''}`}>
                  {task.content}
                </span>
                {task.dueDate && (
                  <span className="ext-text-xs ext-text-muted-foreground ext-flex ext-items-center ext-gap-1">
                    <CalendarIcon size={12} />
                    {format(task.dueDate, 'MMM d, yyyy')}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="ext-p-0 hover:ext-bg-transparent ext-h-6 ext-w-6 ext-shrink-0"
                onClick={() => deleteTask(task.id)}
              >
                <X size={14} className="ext-text-muted-foreground hover:ext-text-destructive" />
              </Button>
            </div>
            {task.url && (
              <div className="ext-px-3 ext-pb-3 ext-min-w-0">
                <a
                  href={task.url}
                  className="ext-text-xs ext-text-muted-foreground ext-mt-2 ext-block ext-truncate"
                >
                  {task.url}
                </a>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
} 