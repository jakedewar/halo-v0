import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Circle, Plus, Search, Check, Link as LinkIcon, 
  Orbit, Share2, HelpCircle, Sun, Moon, 
  Settings, Globe, Calendar,
  Trash,
  AlertCircle,
  Unlink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { useSettings } from '@/hooks/useSettings';
import { MESSAGE_TYPES, Note, Task } from '@/lib/types';

export default function SidePanel() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { settings, setSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [newNote, setNewNote] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(settings.theme === 'dark');
  const [selectedOrbit, setSelectedOrbit] = useState<string | null>(null);
  const [filterOrbit, setFilterOrbit] = useState<string>('All Orbits');
  const [filterScope, setFilterScope] = useState<'url' | 'global'>('global');
  const [creationScope, setCreationScope] = useState<'url' | 'global'>('url');
  const [isOrbitDropdownOpen, setIsOrbitDropdownOpen] = useState(false);
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [activeMoreMenu, setActiveMoreMenu] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    return today;
  });

  // Initialize notes and tasks from Chrome storage
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Helper function to check if a date is in the past
  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Helper function to check if we're viewing the current week
  const isCurrentWeek = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = new Date(today);
    startOfToday.setDate(today.getDate());
    return date.getTime() === startOfToday.getTime();
  };

  // Load notes and tasks from Chrome storage on mount
  useEffect(() => {
    console.log('Initializing storage access...');
    if (!chrome?.storage?.local) {
      console.error('Chrome storage API not available');
      return;
    }
    
    chrome.storage.local.get(['notes', 'tasks'], (result) => {
      console.log('Storage access result:', result);
      if (chrome.runtime.lastError) {
        console.error('Error accessing storage:', chrome.runtime.lastError);
        return;
      }
      if (result.notes) setNotes(result.notes);
      if (result.tasks) setTasks(result.tasks);
    });
  }, []);

  // Get current URL when component mounts
  useEffect(() => {
    if (window.location.href) {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj: Note = {
        id: Date.now().toString(),
        content: newNote,
        url: creationScope === 'url' ? currentUrl : null,
        orbit: 'Ungrouped',
        scope: creationScope,
        createdAt: Date.now()
      };
      
      chrome.storage.local.get(['notes'], (result) => {
        const updatedNotes = [...(result.notes || []), newNoteObj];
        chrome.storage.local.set({ notes: updatedNotes }, () => {
          setNotes(updatedNotes);
          setNewNote('');
          if (contentEditableRef.current) {
            contentEditableRef.current.textContent = '';
          }
        });
      });
    }
  };

  const handleAddTask = () => {
    if (newNote.trim()) {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        content: newNote,
        url: creationScope === 'url' ? currentUrl : null,
        scope: creationScope,
        completed: false,
        createdAt: Date.now(),
        dueDate: selectedDueDate ? selectedDueDate.getTime() : undefined
      };
      
      chrome.storage.local.get(['tasks'], (result) => {
        const updatedTasks = [...(result.tasks || []), newTaskObj];
        chrome.storage.local.set({ tasks: updatedTasks }, () => {
          setTasks(updatedTasks);
          setNewNote('');
          setSelectedDueDate(null);
          if (contentEditableRef.current) {
            contentEditableRef.current.textContent = '';
          }
        });
      });
    }
  };

  const deleteTask = (id: string) => {
    console.log('Deleting task:', id);
    
    // Check if Chrome API is available
    if (!chrome?.storage?.local) {
      console.error('Chrome storage API not available');
      return;
    }

    try {
      chrome.storage.local.get(['tasks'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error accessing tasks:', chrome.runtime.lastError);
          return;
        }

        try {
          const updatedTasks = (result.tasks || []).filter((task: Task) => task.id !== id);
          chrome.storage.local.set({ tasks: updatedTasks }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error saving tasks:', chrome.runtime.lastError);
              return;
            }
            setTasks(updatedTasks);
            setActiveMoreMenu(null);
            setTaskToDelete(null); // Clear the taskToDelete state
            console.log('Successfully deleted task:', id);
          });
        } catch (error) {
          console.error('Error updating tasks:', error);
        }
      });
    } catch (error) {
      console.error('Error in deleteTask:', error);
    }
  };

  const toggleTask = (id: string) => {
    chrome.storage.local.get(['tasks'], (result) => {
      const updatedTasks = (result.tasks || []).map((task: Task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      chrome.storage.local.set({ tasks: updatedTasks }, () => {
        setTasks(updatedTasks);
      });
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMoreMenu !== null && !(event.target as Element).closest('.more-menu')) {
        setActiveMoreMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMoreMenu]);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    setSettings({ theme: newTheme });
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      } else if (
        ((event.altKey || event.metaKey) && event.key === ' ') || // Alt/Cmd + Space
        (event.shiftKey && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'h') // Cmd/Ctrl + Shift + H
      ) {
        event.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const themeClasses = isDarkMode
    ? 'ext-bg-[#030303] ext-text-white/70 ext-border-white/[0.05]'
    : 'ext-bg-white ext-text-gray-800 ext-border-gray-200';

  const themeHoverClasses = isDarkMode
    ? 'hover:ext-bg-white/[0.03] hover:ext-border-indigo-500/20'
    : 'hover:ext-bg-gray-50 hover:ext-border-indigo-200';

  // Add click handlers for the filter dropdowns
  const handleOrbitFilter = (orbit: string) => {
    setFilterOrbit(orbit);
    setIsOrbitDropdownOpen(false);
  };

  const handleScopeFilter = (scope: 'url' | 'global') => {
    setFilterScope(scope);
    setIsScopeDropdownOpen(false);
  };

  // Update the dropdown content JSX
  const renderOrbitDropdown = () => (
    <div className={`ext-absolute ext-left-0 ext-right-0 ext-mt-1 ext-py-1 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05]' : 'ext-bg-white ext-border-gray-200'} ext-shadow-lg ext-z-50`}>
      <button
        onClick={() => handleOrbitFilter('All Orbits')}
        className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
      >
        <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" /> All Orbits
      </button>
      <button
        onClick={() => handleOrbitFilter('Only Ungrouped Notes')}
        className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
      >
        <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" /> Only Ungrouped Notes
      </button>
      {Array.from(new Set(notes.map(note => note.orbit).filter((orbit): orbit is string => orbit !== undefined))).map((orbit) => (
        <button
          key={orbit}
          onClick={() => handleOrbitFilter(orbit)}
          className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
        >
          <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" /> {orbit}
        </button>
      ))}
    </div>
  );

  const renderScopeDropdown = () => (
    <div className={`ext-absolute ext-left-0 ext-right-0 ext-mt-1 ext-py-1 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05]' : 'ext-bg-white ext-border-gray-200'} ext-shadow-lg ext-z-50`}>
      <button
        onClick={() => handleScopeFilter('global')}
        className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
      >
        <Globe className="ext-w-4 ext-h-4 ext-opacity-70" /> All Notes
      </button>
      <button
        onClick={() => handleScopeFilter('url')}
        className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
      >
        <LinkIcon className="ext-w-4 ext-h-4 ext-opacity-70" /> Page Notes
      </button>
    </div>
  );

  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_OPTIONS });
  };

  // Update deleteNote function to handle the actual deletion
  const deleteNote = (noteId: string) => {
    console.log('Attempting to delete note ID:', noteId);
    
    // Check if Chrome API is available
    if (!chrome?.storage?.local) {
      console.error('Chrome storage API not available');
      return;
    }

    try {
      chrome.storage.local.get(['notes'], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Error accessing notes:', chrome.runtime.lastError);
          return;
        }

        try {
          const currentNotes = result.notes || [];
          const updatedNotes = currentNotes.filter((n: Note) => n.id !== noteId);
          chrome.storage.local.set({ notes: updatedNotes }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error saving notes:', chrome.runtime.lastError);
              return;
            }
            setNotes(updatedNotes);
            setActiveMoreMenu(null);
            setNoteToDelete(null); // Clear the noteToDelete state
            console.log('Successfully deleted note:', noteId);
          });
        } catch (error) {
          console.error('Error updating notes:', error);
        }
      });
    } catch (error) {
      console.error('Error in deleteNote:', error);
    }
  };

  // Add confirmation dialog component
  const DeleteConfirmationDialog = ({ noteId }: { noteId: string }) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return null;

    return (
      <div className="ext-fixed ext-inset-0 ext-bg-black/50 ext-backdrop-blur-sm ext-z-50 ext-flex ext-items-center ext-justify-center">
        <div className={`ext-w-[400px] ext-p-6 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-white ext-border-gray-200 ext-text-gray-800'}`}>
          <div className="ext-flex ext-items-center ext-gap-3 ext-mb-4">
            <AlertCircle className={`ext-w-5 ext-h-5 ${isDarkMode ? 'ext-text-red-400' : 'ext-text-red-500'}`} />
            <h3 className={`ext-text-lg ext-font-medium ${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'}`}>Delete Note</h3>
          </div>
          <p className="ext-mb-6">Are you sure you want to delete this note? This action cannot be undone.</p>
          <div className="ext-flex ext-gap-3 ext-justify-end">
            <button
              onClick={() => setNoteToDelete(null)}
              className={`ext-px-4 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ${isDarkMode ? 'ext-text-white/70 hover:ext-text-white ext-bg-white/[0.05] hover:ext-bg-white/[0.1]' : 'ext-text-gray-600 hover:ext-text-gray-900 ext-bg-gray-100 hover:ext-bg-gray-200'} ext-transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={() => deleteNote(noteId)}
              className="ext-px-4 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ext-bg-red-500 ext-text-white hover:ext-bg-red-600 ext-transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add Task confirmation dialog component
  const DeleteTaskConfirmationDialog = ({ taskId }: { taskId: string }) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    return (
      <div className="ext-fixed ext-inset-0 ext-bg-black/50 ext-backdrop-blur-sm ext-z-50 ext-flex ext-items-center ext-justify-center">
        <div className={`ext-w-[400px] ext-p-6 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-white ext-border-gray-200 ext-text-gray-800'}`}>
          <div className="ext-flex ext-items-center ext-gap-3 ext-mb-4">
            <AlertCircle className={`ext-w-5 ext-h-5 ${isDarkMode ? 'ext-text-red-400' : 'ext-text-red-500'}`} />
            <h3 className={`ext-text-lg ext-font-medium ${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'}`}>Delete Task</h3>
          </div>
          <p className="ext-mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="ext-flex ext-gap-3 ext-justify-end">
            <button
              onClick={() => setTaskToDelete(null)}
              className={`ext-px-4 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ${isDarkMode ? 'ext-text-white/70 hover:ext-text-white ext-bg-white/[0.05] hover:ext-bg-white/[0.1]' : 'ext-text-gray-600 hover:ext-text-gray-900 ext-bg-gray-100 hover:ext-bg-gray-200'} ext-transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={() => deleteTask(taskId)}
              className="ext-px-4 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ext-bg-red-500 ext-text-white hover:ext-bg-red-600 ext-transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Existing modal content */}
          {noteToDelete && <DeleteConfirmationDialog noteId={noteToDelete} />}
          {taskToDelete && <DeleteTaskConfirmationDialog taskId={taskToDelete} />}
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ext-fixed ext-inset-0 ext-bg-black/50 ext-backdrop-blur-sm ext-z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`ext-fixed ext-right-0 ext-top-0 ext-h-full ext-w-[400px] ext-border-l ${themeClasses} ext-z-50`}
          >
            <div className="ext-p-6 ext-h-full ext-flex ext-flex-col">
              {/* Header */}
              <div className="ext-flex ext-justify-between ext-items-center ext-mb-6">
                <div className="ext-flex ext-items-center ext-gap-2">
                  <Circle className={`ext-w-5 ext-h-5 ${isDarkMode ? 'ext-text-indigo-300' : 'ext-text-indigo-500'}`} strokeWidth={2.5} />
                  <h2 className={`ext-text-lg ext-font-medium ${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'}`}>
                    Halo
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`ext-p-1 ext-rounded-full ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors`}
                >
                  <X className={`ext-w-5 ext-h-5 ${isDarkMode ? 'ext-text-white/50' : 'ext-text-gray-400'}`} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="ext-relative ext-mb-6">
                <Search className={`ext-absolute ext-left-3 ext-top-1/2 -ext-translate-y-1/2 ext-w-4 ext-h-4 ${isDarkMode ? 'ext-text-white/30' : 'ext-text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search your thoughts..."
                  className={`ext-w-full ext-pl-10 ext-pr-4 ext-py-2 ext-rounded-lg ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70 ext-placeholder-white/30' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800 ext-placeholder-gray-400'} ext-border ext-text-sm focus:ext-outline-none focus:ext-border-indigo-500/30 ext-transition-colors`}
                />
              </div>

              {/* Tabs */}
              <div className="ext-flex ext-gap-2 ext-mb-6">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`ext-flex-1 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ext-transition-colors ${activeTab === 'notes'
                    ? 'ext-bg-indigo-500 ext-text-white'
                    : isDarkMode ? 'ext-text-white/50 hover:ext-text-white' : 'ext-text-gray-500 hover:ext-text-gray-900'
                    }`}
                >
                  Notes
                </button>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className={`ext-flex-1 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ext-transition-colors ${activeTab === 'tasks'
                    ? 'ext-bg-indigo-500 ext-text-white'
                    : isDarkMode ? 'ext-text-white/50 hover:ext-text-white' : 'ext-text-gray-500 hover:ext-text-gray-900'
                    }`}
                >
                  Tasks
                </button>
              </div>

              {/* Content Area */}
              <div className="ext-flex-1 ext-overflow-y-auto">
                {activeTab === 'notes' ? (
                  <div className="ext-space-y-4">
                    {/* Filter Bar */}
                    <div className="ext-flex ext-gap-2 ext-mb-4">
                      {/* Orbit Filter */}
                      <div className="ext-relative ext-flex-1">
                        <button
                          onClick={() => setIsOrbitDropdownOpen(!isOrbitDropdownOpen)}
                          className={`ext-w-full ext-px-3 ext-py-1.5 ext-rounded-lg ext-border ext-flex ext-items-center ext-gap-2 ext-text-xs ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800'} ext-transition-colors`}
                        >
                          <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" />
                          <span className="ext-truncate">{filterOrbit}</span>
                          <span className={`ext-ml-auto ext-transform ext-transition-transform ${isOrbitDropdownOpen ? 'ext-rotate-180' : ''}`}>▾</span>
                        </button>
                        {/* Orbit Dropdown */}
                        {isOrbitDropdownOpen && renderOrbitDropdown()}
                      </div>

                      {/* Scope Filter */}
                      <div className="ext-relative ext-flex-1">
                        <button
                          onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                          className={`ext-w-full ext-px-3 ext-py-1.5 ext-rounded-lg ext-border ext-flex ext-items-center ext-gap-2 ext-text-xs ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800'} ext-transition-colors`}
                        >
                          {filterScope === 'global' && <Globe className="ext-w-4 ext-h-4 ext-opacity-70" />}
                          {filterScope === 'url' && <LinkIcon className="ext-w-4 ext-h-4 ext-opacity-70" />}
                          <span className="ext-truncate">
                            {filterScope === 'global' ? 'All Notes' : 'Page Notes'}
                          </span>
                          <span className={`ext-ml-auto ext-transform ext-transition-transform ${isScopeDropdownOpen ? 'ext-rotate-180' : ''}`}>▾</span>
                        </button>
                        {/* Scope Dropdown */}
                        {isScopeDropdownOpen && renderScopeDropdown()}
                      </div>
                    </div>

                    {/* Notes List */}
                    {notes
                      .filter(note => {
                        // First filter by orbit
                        if (filterOrbit === 'All Orbits') return true;
                        if (filterOrbit === 'Only Ungrouped Notes') return note.orbit === 'Ungrouped';
                        return note.orbit === filterOrbit;
                      })
                      .filter(note => {
                        // If global is selected, show all notes
                        if (filterScope === 'global') return true;
                        
                        // If url is selected, only show notes that match current URL
                        return note.url === currentUrl;
                      })
                      .map(note => (
                        <div
                          key={note.id}
                          className={`ext-p-4 ext-rounded-lg ext-border ${themeClasses} ${themeHoverClasses} ext-transition-colors ext-group`}
                        >
                          <div className="ext-flex ext-items-center ext-gap-2 ext-mb-2">
                            {/* Orbit pill */}
                            <div className="ext-flex ext-items-center ext-gap-1">
                              <span
                                onClick={() => setSelectedOrbit(selectedOrbit === note.id ? null : note.id)}
                                className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ext-px-2 ext-py-1 ext-rounded-full ext-font-medium ext-cursor-pointer ext-transition-colors ${note.orbit === 'Ungrouped'
                                  ? isDarkMode
                                    ? 'ext-bg-white/[0.05] ext-text-white/50 hover:ext-bg-white/[0.1]'
                                    : 'ext-bg-gray-100 ext-text-gray-500 hover:ext-bg-gray-200'
                                  : isDarkMode
                                    ? 'ext-bg-indigo-500/20 ext-text-indigo-300 hover:ext-bg-indigo-500/30'
                                    : 'ext-bg-indigo-100 ext-text-indigo-600 hover:ext-bg-indigo-200'}`}
                              >
                                <Orbit className="ext-w-3 ext-h-3" /> {note.orbit}
                              </span>
                            </div>
                            {/* Scope pill */}
                            <span className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ext-px-2 ext-py-1 ext-rounded-full ext-font-medium ${note.scope === 'global'
                              ? isDarkMode
                                ? 'ext-bg-purple-500/20 ext-text-purple-300'
                                : 'ext-bg-purple-100 ext-text-purple-600'
                              : isDarkMode
                                ? 'ext-bg-blue-500/20 ext-text-blue-300'
                                : 'ext-bg-blue-100 ext-text-blue-600'}`}>
                              {note.scope === 'global' ? <Globe className="ext-w-3 ext-h-3" /> : <LinkIcon className="ext-w-3 ext-h-3" />} {note.scope === 'global' ? 'Unlinked' : 'Linked'}
                            </span>
                          </div>
                          <p className={`ext-text-sm ${isDarkMode ? 'ext-text-white/70' : 'ext-text-gray-800'} ext-mb-2`}>{note.content}</p>
                          <div className="ext-flex ext-items-center ext-justify-between">
                            <div className="ext-flex ext-items-center ext-gap-2">
                              {note.url && (
                                <a
                                  href={note.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ${isDarkMode ? 'ext-text-white/30 hover:ext-text-indigo-300' : 'ext-text-gray-400 hover:ext-text-indigo-500'} ext-transition-colors ext-max-w-[200px]`}
                                >
                                  <LinkIcon className="ext-w-3 ext-h-3 ext-shrink-0" />
                                  <span className="ext-truncate">{new URL(note.url).hostname}</span>
                                </a>
                              )}
                              <button className={`ext-p-1 ext-rounded ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors`}>
                                <Orbit className={`ext-w-3 ext-h-3 ${isDarkMode ? 'ext-text-white/30 hover:ext-text-indigo-300' : 'ext-text-gray-400 hover:ext-text-indigo-500'}`} />
                              </button>
                            </div>
                            <div className="ext-flex ext-items-center ext-gap-1 ext-invisible group-hover:ext-visible">
                              <button className={`ext-p-1 ext-rounded ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors`}>
                                <Share2 className={`ext-w-3 ext-h-3 ${isDarkMode ? 'ext-text-white/50 hover:ext-text-indigo-300' : 'ext-text-gray-500 hover:ext-text-indigo-500'}`} />
                              </button>
                              <button
                                onClick={(e) => {
                                  console.log('Delete button clicked');
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setNoteToDelete(note.id);
                                }}
                                className={`ext-p-1 ext-rounded ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors`}
                              >
                                <Trash className={`ext-w-3 ext-h-3 ${isDarkMode ? 'ext-text-red-400 hover:ext-text-red-300' : 'ext-text-red-500 hover:ext-text-red-600'}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="ext-space-y-4">
                    {/* Filter Bar */}
                    <div className="ext-flex ext-gap-2 ext-mb-4">
                      {/* Orbit Filter */}
                      <div className="ext-relative ext-flex-1">
                        <button
                          onClick={() => setIsOrbitDropdownOpen(!isOrbitDropdownOpen)}
                          className={`ext-w-full ext-px-3 ext-py-1.5 ext-rounded-lg ext-border ext-flex ext-items-center ext-gap-2 ext-text-xs ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800'} ext-transition-colors`}
                        >
                          <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" />
                          <span className="ext-truncate">{filterOrbit}</span>
                          <span className={`ext-ml-auto ext-transform ext-transition-transform ${isOrbitDropdownOpen ? 'ext-rotate-180' : ''}`}>▾</span>
                        </button>
                        {/* Orbit Dropdown */}
                        {isOrbitDropdownOpen && renderOrbitDropdown()}
                      </div>

                      {/* Scope Filter */}
                      <div className="ext-relative ext-flex-1">
                        <button
                          onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                          className={`ext-w-full ext-px-3 ext-py-1.5 ext-rounded-lg ext-border ext-flex ext-items-center ext-gap-2 ext-text-xs ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800'} ext-transition-colors`}
                        >
                          {filterScope === 'global' && <Globe className="ext-w-4 ext-h-4 ext-opacity-70" />}
                          {filterScope === 'url' && <LinkIcon className="ext-w-4 ext-h-4 ext-opacity-70" />}
                          <span className="ext-truncate">
                            {filterScope === 'global' ? 'All Notes' : 'Page Notes'}
                          </span>
                          <span className={`ext-ml-auto ext-transform ext-transition-transform ${isScopeDropdownOpen ? 'ext-rotate-180' : ''}`}>▾</span>
                        </button>
                        {/* Scope Dropdown */}
                        {isScopeDropdownOpen && renderScopeDropdown()}
                      </div>
                    </div>

                    {/* Tasks List */}
                    {tasks
                      .filter(task => {
                        // First filter by scope
                        if (filterScope === 'global') return true;
                        return task.url === currentUrl;
                      })
                      .map(task => (
                        <div
                          key={task.id}
                          className={`ext-flex ext-items-center ext-gap-3 ext-p-4 ext-rounded-lg ext-border ${themeClasses} ${themeHoverClasses} ext-transition-colors ext-group`}
                        >
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`ext-w-5 ext-h-5 ext-rounded ext-border ext-flex ext-items-center ext-justify-center ext-transition-colors ${
                              task.completed
                                ? isDarkMode
                                  ? 'ext-bg-indigo-500 ext-border-indigo-500'
                                  : 'ext-bg-indigo-500 ext-border-indigo-500'
                                : isDarkMode
                                  ? 'ext-border-white/20 hover:ext-border-indigo-500'
                                  : 'ext-border-gray-300 hover:ext-border-indigo-500'
                            }`}
                          >
                            {task.completed && <Check className="ext-w-3 ext-h-3 ext-text-white" />}
                          </button>
                          <div className="ext-flex ext-flex-col ext-flex-1">
                            <span className={`ext-text-sm ${task.completed ? (isDarkMode ? 'ext-text-white/30' : 'ext-text-gray-400') : (isDarkMode ? 'ext-text-white/70' : 'ext-text-gray-800')} ${task.completed ? 'ext-line-through' : ''}`}>
                              {task.content}
                            </span>
                            {task.dueDate && (
                              <div className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ${isDarkMode ? 'ext-text-white/30' : 'ext-text-gray-400'} ext-mt-1`}>
                                <Calendar className="ext-w-3 ext-h-3" />
                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          <div className="ext-flex ext-items-center ext-gap-2">
                            <span className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ext-px-2 ext-py-1 ext-rounded-full ext-font-medium ${task.scope === 'global'
                              ? isDarkMode
                                ? 'ext-bg-purple-500/20 ext-text-purple-300'
                                : 'ext-bg-purple-100 ext-text-purple-600'
                              : isDarkMode
                                ? 'ext-bg-blue-500/20 ext-text-blue-300'
                                : 'ext-bg-blue-100 ext-text-blue-600'}`}>
                              {task.scope === 'global' ? <Globe className="ext-w-3 ext-h-3" /> : <LinkIcon className="ext-w-3 ext-h-3" />}
                              {task.scope === 'global' ? 'Unlinked' : 'Linked'}
                            </span>
                            <button
                              onClick={(e) => {
                                console.log('Delete button clicked');
                                e.stopPropagation();
                                e.preventDefault();
                                setTaskToDelete(task.id);
                              }}
                              className={`ext-p-1 ext-rounded ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors`}
                            >
                              <Trash className={`ext-w-3 ext-h-3 ${isDarkMode ? 'ext-text-red-400 hover:ext-text-red-300' : 'ext-text-red-500 hover:ext-text-red-600'}`} />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* New Note/Task Input */}
              <div className={`ext-pt-6 ext-mt-6 ext-border-t ${isDarkMode ? 'ext-border-white/[0.05]' : 'ext-border-gray-200'}`}>
                <div className="ext-space-y-4">
                  {/* Quick Toggle Buttons */}
                  <div className="ext-flex ext-gap-2 ext-relative ext-z-[51]">
                    {/* Linked/Unlinked Toggle Button */}
                    <button
                      onClick={() => setCreationScope(creationScope === 'url' ? 'global' : 'url')}
                      className={`ext-w-[40px] ext-flex ext-items-center ext-justify-center ext-px-3 ext-py-1.5 ext-text-xs ext-font-medium ext-rounded-lg ext-border ext-transition-colors ${
                        creationScope === 'url'
                          ? isDarkMode
                            ? 'ext-bg-indigo-500 ext-text-white ext-border-indigo-500'
                            : 'ext-bg-indigo-500 ext-text-white ext-border-indigo-500'
                          : isDarkMode
                            ? 'ext-bg-white/[0.03] ext-text-white/50 hover:ext-text-white ext-border-white/[0.05]'
                            : 'ext-bg-gray-50 ext-text-gray-500 hover:ext-text-gray-900 ext-border-gray-200'
                      }`}
                    >
                      {creationScope === 'url' ? (
                        <LinkIcon className="ext-w-3 ext-h-3" />
                      ) : (
                        <Unlink className="ext-w-3 ext-h-3" />
                      )}
                    </button>

                    {/* Due Date Button (only visible for tasks) */}
                    {activeTab === 'tasks' && (
                      <div className="ext-relative">
                        <button
                          onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                          className={`ext-w-[40px] ext-flex ext-items-center ext-justify-center ext-px-3 ext-py-1.5 ext-text-xs ext-font-medium ext-rounded-lg ext-border ext-transition-colors ${
                            selectedDueDate
                              ? isDarkMode
                                ? 'ext-bg-indigo-500 ext-text-white ext-border-indigo-500'
                                : 'ext-bg-indigo-500 ext-text-white ext-border-indigo-500'
                              : isDarkMode
                                ? 'ext-bg-white/[0.03] ext-text-white/50 hover:ext-text-white ext-border-white/[0.05]'
                                : 'ext-bg-gray-50 ext-text-gray-500 hover:ext-text-gray-900 ext-border-gray-200'
                          }`}
                        >
                          <Calendar className="ext-w-3 ext-h-3" />
                        </button>

                        {/* Date Picker Dropdown */}
                        {isDatePickerOpen && (
                          <div className={`ext-absolute ext-left-0 ext-bottom-[calc(100%+0.5rem)] ext-w-[300px] ext-p-4 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05]' : 'ext-bg-white ext-border-gray-200'} ext-shadow-lg ext-z-50`}>
                            {/* Navigation Controls */}
                            <div className="ext-flex ext-justify-between ext-items-center ext-mb-3">
                              <button
                                onClick={() => {
                                  const newStart = new Date(currentWeekStart);
                                  newStart.setDate(newStart.getDate() - 7);
                                  setCurrentWeekStart(newStart);
                                }}
                                disabled={isCurrentWeek(currentWeekStart)}
                                className={`ext-p-1 ext-rounded-full ${
                                  isCurrentWeek(currentWeekStart)
                                    ? isDarkMode
                                      ? 'ext-text-white/20 ext-cursor-not-allowed'
                                      : 'ext-text-gray-300 ext-cursor-not-allowed'
                                    : isDarkMode
                                      ? 'ext-text-white/50 hover:ext-text-white hover:ext-bg-white/[0.1]'
                                      : 'ext-text-gray-500 hover:ext-text-gray-900 hover:ext-bg-gray-100'
                                } ext-transition-colors`}
                              >
                                <ChevronLeft className="ext-w-4 ext-h-4" />
                              </button>
                              <span className={`ext-text-xs ext-font-medium ${
                                isDarkMode ? 'ext-text-white/70' : 'ext-text-gray-600'
                              }`}>
                                {currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                              <button
                                onClick={() => {
                                  const newStart = new Date(currentWeekStart);
                                  newStart.setDate(newStart.getDate() + 7);
                                  setCurrentWeekStart(newStart);
                                }}
                                className={`ext-p-1 ext-rounded-full ${
                                  isDarkMode
                                    ? 'ext-text-white/50 hover:ext-text-white hover:ext-bg-white/[0.1]'
                                    : 'ext-text-gray-500 hover:ext-text-gray-900 hover:ext-bg-gray-100'
                                } ext-transition-colors`}
                              >
                                <ChevronRight className="ext-w-4 ext-h-4" />
                              </button>
                            </div>
                            <div className="ext-grid ext-grid-cols-7 ext-gap-2">
                              {Array.from({ length: 7 }).map((_, i) => {
                                const date = new Date(currentWeekStart);
                                date.setDate(date.getDate() + i);
                                const isPastDate = isDateInPast(date);
                                
                                return (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      if (!isPastDate) {
                                        setSelectedDueDate(date);
                                        setIsDatePickerOpen(false);
                                      }
                                    }}
                                    disabled={isPastDate}
                                    className={`ext-p-2 ext-rounded ext-text-center ext-text-xs ${
                                      selectedDueDate?.toDateString() === date.toDateString()
                                        ? 'ext-bg-indigo-500 ext-text-white'
                                        : isPastDate
                                          ? isDarkMode
                                            ? 'ext-text-white/20 ext-cursor-not-allowed'
                                            : 'ext-text-gray-300 ext-cursor-not-allowed'
                                          : isDarkMode
                                            ? 'ext-text-white/70 hover:ext-bg-white/[0.05]'
                                            : 'ext-text-gray-800 hover:ext-bg-gray-50'
                                    }`}
                                  >
                                    <div className="ext-font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                    <div className="ext-mt-1">{date.getDate()}</div>
                                  </button>
                                );
                              })}
                            </div>
                            <button
                              onClick={() => {
                                setSelectedDueDate(null);
                                setIsDatePickerOpen(false);
                              }}
                              className={`ext-w-full ext-mt-3 ext-p-2 ext-text-xs ext-rounded ${
                                isDarkMode
                                  ? 'ext-text-white/50 hover:ext-text-white ext-bg-white/[0.05] hover:ext-bg-white/[0.1]'
                                  : 'ext-text-gray-500 hover:ext-text-gray-900 ext-bg-gray-50 hover:ext-bg-gray-100'
                              }`}
                            >
                              Clear Date
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Rich Text Input */}
                  <div className="ext-flex ext-gap-2 ext-mb-20">
                    <div
                      ref={contentEditableRef}
                      contentEditable
                      onInput={(e) => setNewNote(e.currentTarget.textContent || '')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          activeTab === 'notes' ? handleAddNote() : handleAddTask();
                        }
                      }}
                      className={`ext-flex-1 ext-px-4 ext-py-2 ext-rounded-lg ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70 ext-placeholder-white/30' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800 ext-placeholder-gray-400'} ext-border ext-text-sm focus:ext-outline-none focus:ext-border-indigo-500/30 ext-transition-colors ext-min-h-[40px] ext-max-h-[120px] ext-overflow-y-auto ext-relative ${!newNote ? 'before:ext-content-[attr(data-placeholder)] before:ext-absolute before:ext-top-2 before:ext-left-4 before:ext-text-sm before:ext-pointer-events-none' : ''}`}
                      data-placeholder={activeTab === 'notes' ? "Capture a thought..." : "Add a new task..."}
                      suppressContentEditableWarning
                    />
                    <button
                      onClick={activeTab === 'notes' ? handleAddNote : handleAddTask}
                      className="ext-p-2 ext-rounded-lg ext-bg-indigo-500 ext-text-white hover:ext-bg-indigo-400 ext-transition-colors"
                    >
                      <Plus className="ext-w-4 ext-h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`ext-pt-6 ext-mt-6 ext-border-t ${isDarkMode ? 'ext-border-white/[0.05]' : 'ext-border-gray-200'}`}>
                <div className={`ext-flex ext-items-center ext-justify-between ext-text-xs ${isDarkMode ? 'ext-text-white/30' : 'ext-text-gray-400'}`}>
                  <div className="ext-flex ext-items-center ext-gap-4">
                    <button className={`hover:${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'} ext-transition-colors`}>
                      <HelpCircle className="ext-w-4 ext-h-4" />
                    </button>
                    <button 
                      onClick={handleOpenSettings}
                      className={`hover:${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'} ext-transition-colors`}
                    >
                      <Settings className="ext-w-4 ext-h-4" />
                    </button>
                    <button
                      onClick={toggleDarkMode}
                      className={`hover:${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'} ext-transition-colors`}
                    >
                      {isDarkMode ? <Sun className="ext-w-4 ext-h-4" /> : <Moon className="ext-w-4 ext-h-4" />}
                    </button>
                  </div>
                  <div className="ext-flex ext-items-center">
                    <span>Alt + Space to toggle</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
