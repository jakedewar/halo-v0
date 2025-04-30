import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Note {
  id: string;
  content: string;
  url?: string;
  createdAt: number;
}

interface Task {
  id: string;
  content: string;
  completed: boolean;
  url?: string;
  createdAt: number;
}

const Content: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newTask, setNewTask] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Get current URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });

    // Load existing notes and tasks
    chrome.storage.local.get(['notes', 'tasks'], (result) => {
      if (result.notes) setNotes(result.notes);
      if (result.tasks) setTasks(result.tasks);
    });
  }, []);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      url: currentUrl,
      createdAt: Date.now(),
    };

    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    chrome.storage.local.set({ notes: updatedNotes });
    setNewNote('');
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      content: newTask,
      completed: false,
      url: currentUrl,
      createdAt: Date.now(),
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    chrome.storage.local.set({ tasks: updatedTasks });
    setNewTask('');
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    chrome.storage.local.set({ tasks: updatedTasks });
  };

  return (
    <div className={cn(
      'fixed top-0 right-0 h-full w-80 bg-background shadow-lg transition-transform duration-300 ease-in-out',
      !isOpen && 'translate-x-full'
    )}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Halo</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '→' : '←'}
          </Button>
        </div>

        <div className="space-y-4 flex-1 overflow-auto">
          <div>
            <h2 className="text-lg font-semibold mb-2">Quick Note</h2>
            <div className="flex gap-2">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
              />
              <Button onClick={addNote}>Add</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Quick Task</h2>
            <div className="flex gap-2">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a task..."
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <Button onClick={addTask}>Add</Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Notes</h2>
              <div className="space-y-2">
                {notes.map(note => (
                  <div key={note.id} className="p-2 bg-muted rounded-md">
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Tasks</h2>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span className={task.completed ? 'line-through' : ''}>
                      {task.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
