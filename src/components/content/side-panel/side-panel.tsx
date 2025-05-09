import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Circle,
  HelpCircle, Sun, Moon,
  Settings,
} from 'lucide-react';

import { useSettings } from '@/hooks/useSettings';
import { MESSAGE_TYPES, Note, Task } from '@/lib/types';
import { NotesView } from './components/Notes/NotesView';
import { TasksView } from './components/Tasks/TasksView';
import { Header } from './components/Header/Header';
import { SearchBar } from './components/Header/SearchBar';
import { TabNavigation } from './components/Navigation/TabNavigation';
import { CreationBar } from './components/Creation/CreationBar';
import { ConfirmationDialog } from './components/Shared/ConfirmationDialog';

export default function SidePanel() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { settings, setSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [isDarkMode, setIsDarkMode] = useState(settings.theme === 'dark');
  const [filterOrbit, setFilterOrbit] = useState<string>('All Orbits');
  const [filterScope, setFilterScope] = useState<'url' | 'global'>('global');
  const [creationOrbit, setCreationOrbit] = useState<string>('Ungrouped');
  const [isCreationOrbitDropdownOpen, setIsCreationOrbitDropdownOpen] = useState(false);
  const [isOrbitDropdownOpen, setIsOrbitDropdownOpen] = useState(false);
  const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
  const [activeMoreMenu, setActiveMoreMenu] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [newOrbitName, setNewOrbitName] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedDueDate, setSelectedDueDate] = useState<Date | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [isNewOrbitInputVisible, setIsNewOrbitInputVisible] = useState(false);

  // Add date picker ref
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Initialize notes and tasks from Chrome storage
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add new state for orbit assignment
  const [isOrbitAssignmentOpen, setIsOrbitAssignmentOpen] = useState<string | null>(null);

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

  // Add effect to focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Add useEffect for date picker outside click handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsDatePickerOpen(false);
      }
    }

    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen]);

  const handleAddNote = (content: string, isGlobal: boolean) => {
    if (content.trim()) {
      const newNoteObj: Note = {
        id: Date.now().toString(),
        content: content,
        url: isGlobal ? null : currentUrl,
        orbit: creationOrbit,
        scope: isGlobal ? 'global' : 'url',
        createdAt: Date.now()
      };

      chrome.storage.local.get(['notes'], (result) => {
        const updatedNotes = [...(result.notes || []), newNoteObj];
        chrome.storage.local.set({ notes: updatedNotes }, () => {
          setNotes(updatedNotes);
        });
      });
    }
  };

  const handleAddTask = (content: string, isGlobal: boolean) => {
    if (content.trim()) {
      const newTaskObj: Task = {
        id: Date.now().toString(),
        content: content,
        url: isGlobal ? null : currentUrl,
        scope: isGlobal ? 'global' : 'url',
        orbit: creationOrbit,
        completed: false,
        createdAt: Date.now(),
        dueDate: selectedDueDate ? selectedDueDate.getTime() : undefined
      };

      chrome.storage.local.get(['tasks'], (result) => {
        const updatedTasks = [...(result.tasks || []), newTaskObj];
        chrome.storage.local.set({ tasks: updatedTasks }, () => {
          setTasks(updatedTasks);
          setSelectedDueDate(null);
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

  
  // Add click handlers for the filter dropdowns
  const handleOrbitFilter = (orbit: string) => {
    setFilterOrbit(orbit);
    setIsOrbitDropdownOpen(false);
  };

  const handleScopeFilter = (scope: 'url' | 'global') => {
    setFilterScope(scope);
    setIsScopeDropdownOpen(false);
  };

  // Update the click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Check if clicking inside any of our dropdowns or inputs
      const isInsideDropdown = 
        target.closest('.orbit-dropdown') || 
        target.closest('.scope-dropdown') || 
        target.closest('.orbit-assignment-dropdown') ||
        target.closest('.creation-orbit-dropdown') ||
        target.closest('.new-orbit-input') ||
        target.closest('.date-picker-dropdown') ||
        target.closest('button') || // Don't close when clicking buttons
        target.closest('input'); // Don't close when clicking inputs

      // If clicking inside dropdowns, buttons, or inputs, don't close anything
      if (isInsideDropdown) {
        console.log('Click inside dropdown detected, not closing');
        return;
      }

      // Log the current state before closing
      console.log('Click outside detected, current state:', {
        isNewOrbitInputVisible,
        isOrbitAssignmentOpen,
        isCreationOrbitDropdownOpen
      });

      // Only close dropdowns that aren't part of the orbit creation flow if we're creating an orbit
      if (isNewOrbitInputVisible && isOrbitAssignmentOpen === 'creation') {
        // Keep the creation-related dropdowns open
        console.log('In orbit creation flow, keeping creation dropdowns open');
        setIsOrbitDropdownOpen(false);
        setIsScopeDropdownOpen(false);
        setIsDatePickerOpen(false);
      } else {
        // Close all dropdowns when clicking outside
        console.log('Closing all dropdowns');
        setIsOrbitDropdownOpen(false);
        setIsScopeDropdownOpen(false);
        setIsCreationOrbitDropdownOpen(false);
        setIsOrbitAssignmentOpen(null);
        setIsNewOrbitInputVisible(false);
        setNewOrbitName('');
        setIsDatePickerOpen(false);
      }
    };

    // Add the event listener to the document
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => document.removeEventListener('mousedown', handleClickOutside, true);
  }, [isNewOrbitInputVisible, isOrbitAssignmentOpen]);

  // Update the orbit dropdown button to stop propagation
  const handleOrbitDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOrbitDropdownOpen(!isOrbitDropdownOpen);
    setIsScopeDropdownOpen(false);
  };

  // Update the scope dropdown button to stop propagation
  const handleScopeDropdownToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsScopeDropdownOpen(!isScopeDropdownOpen);
    setIsOrbitDropdownOpen(false);
  };

  // Add function to handle orbit assignment toggle
  const handleOrbitAssignmentToggle = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    setIsOrbitAssignmentOpen(isOrbitAssignmentOpen === noteId ? null : noteId);
  };



  const handleOpenSettings = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.OPEN_OPTIONS });
  };

  // Add share note functionality
  const handleShareNote = (note: Note) => {
    const shareText = `${note.content}\n\nSource: ${note.url || 'Unlinked note'}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setCopiedNoteId(note.id);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedNoteId(null);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
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

  // Add function to handle orbit assignment
  const handleOrbitAssignment = (itemId: string, orbit: string) => {
    // Handle notes
    chrome.storage.local.get(['notes', 'tasks'], (result) => {
      // Try to find the item in notes first
      const updatedNotes = (result.notes || []).map((note: Note) =>
        note.id === itemId ? { ...note, orbit } : note
      );
      
      // Try to find the item in tasks
      const updatedTasks = (result.tasks || []).map((task: Task) =>
        task.id === itemId ? { ...task, orbit } : task
      );

      // Update both notes and tasks
      chrome.storage.local.set({ 
        notes: updatedNotes,
        tasks: updatedTasks
      }, () => {
        setNotes(updatedNotes);
        setTasks(updatedTasks);
        setIsOrbitAssignmentOpen(null);
      });
    });
  };

  // Update handleCreateNewOrbit to handle creation case
  const handleCreateNewOrbit = () => {
    if (newOrbitName.trim()) {
      const orbit = newOrbitName.trim();
      if (isOrbitAssignmentOpen === 'creation') {
        setCreationOrbit(orbit);
      } else if (isOrbitAssignmentOpen) {
        handleOrbitAssignment(isOrbitAssignmentOpen, orbit);
      }
      setNewOrbitName('');
      setIsNewOrbitInputVisible(false);
      setIsOrbitAssignmentOpen(null);
      setIsCreationOrbitDropdownOpen(false); // Close the dropdown after successful creation
    }
  };

  // Add function to get unique orbits
  const getUniqueOrbits = () => {
    const noteOrbits = notes.map(note => note.orbit).filter((orbit): orbit is string => orbit !== undefined);
    const taskOrbits = tasks.map(task => task.orbit).filter((orbit): orbit is string => orbit !== undefined);
    return Array.from(new Set([...noteOrbits, ...taskOrbits]));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {noteToDelete && (
            <ConfirmationDialog
              title="Delete Note"
              message="Are you sure you want to delete this note? This action cannot be undone."
              onConfirm={() => deleteNote(noteToDelete)}
              onCancel={() => setNoteToDelete(null)}
              isDarkMode={isDarkMode}
              isDestructive={true}
            />
          )}
          {taskToDelete && (
            <ConfirmationDialog
              title="Delete Task"
              message="Are you sure you want to delete this task? This action cannot be undone."
              onConfirm={() => deleteTask(taskToDelete)}
              onCancel={() => setTaskToDelete(null)}
              isDarkMode={isDarkMode}
              isDestructive={true}
            />
          )}

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ext-fixed ext-inset-0 ext-bg-black/50 ext-backdrop-blur-sm ext-z-40"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`ext-fixed ext-right-0 ext-top-0 ext-h-full ext-w-[400px] ext-border-l ${themeClasses} ext-z-50`}
            onMouseDown={(e) => {
              if (!(e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLButtonElement)) {
                e.preventDefault();
              }
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (!(e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLButtonElement)) {
                e.stopPropagation();
              }
            }}
          >
            <div className="ext-p-6 ext-h-full ext-flex ext-flex-col">
              <Header onClose={() => setIsOpen(false)} isDarkMode={isDarkMode} />
              <SearchBar isDarkMode={isDarkMode} />
              <TabNavigation 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isDarkMode={isDarkMode}
              />

              {/* Content Area */}
              <div className="ext-flex-1 ext-overflow-y-auto">
                {activeTab === 'notes' ? (
                  <NotesView
                    notes={notes}
                    isDarkMode={isDarkMode}
                    currentUrl={currentUrl}
                    filterOrbit={filterOrbit}
                    filterScope={filterScope}
                    isOrbitDropdownOpen={isOrbitDropdownOpen}
                    isScopeDropdownOpen={isScopeDropdownOpen}
                    isOrbitAssignmentOpen={isOrbitAssignmentOpen}
                    handleOrbitDropdownToggle={handleOrbitDropdownToggle}
                    handleScopeDropdownToggle={handleScopeDropdownToggle}
                    handleOrbitFilter={handleOrbitFilter}
                    handleScopeFilter={handleScopeFilter}
                    handleOrbitAssignmentToggle={handleOrbitAssignmentToggle}
                    handleShareNote={handleShareNote}
                    setNoteToDelete={setNoteToDelete}
                    copiedNoteId={copiedNoteId}
                    handleOrbitAssignment={handleOrbitAssignment}
                    setIsNewOrbitInputVisible={setIsNewOrbitInputVisible}
                    setIsOrbitAssignmentOpen={setIsOrbitAssignmentOpen}
                  />
                ) : (
                  <TasksView
                    tasks={tasks}
                    isDarkMode={isDarkMode}
                    currentUrl={currentUrl}
                    filterOrbit={filterOrbit}
                    filterScope={filterScope}
                    isOrbitDropdownOpen={isOrbitDropdownOpen}
                    isScopeDropdownOpen={isScopeDropdownOpen}
                    isOrbitAssignmentOpen={isOrbitAssignmentOpen}
                    handleOrbitDropdownToggle={handleOrbitDropdownToggle}
                    handleScopeDropdownToggle={handleScopeDropdownToggle}
                    handleOrbitFilter={handleOrbitFilter}
                    handleScopeFilter={handleScopeFilter}
                    handleOrbitAssignmentToggle={handleOrbitAssignmentToggle}
                    setTaskToDelete={setTaskToDelete}
                    toggleTask={toggleTask}
                    handleOrbitAssignment={handleOrbitAssignment}
                    setIsNewOrbitInputVisible={setIsNewOrbitInputVisible}
                    setIsOrbitAssignmentOpen={setIsOrbitAssignmentOpen}
                  />
                )}
              </div>

              {/* Replace old creation UI with new CreationBar */}
              <CreationBar
                activeTab={activeTab}
                isDarkMode={isDarkMode}
                creationOrbit={creationOrbit}
                setCreationOrbit={setCreationOrbit}
                isCreationOrbitDropdownOpen={isCreationOrbitDropdownOpen}
                setIsCreationOrbitDropdownOpen={setIsCreationOrbitDropdownOpen}
                isNewOrbitInputVisible={isNewOrbitInputVisible}
                setIsNewOrbitInputVisible={setIsNewOrbitInputVisible}
                isOrbitAssignmentOpen={isOrbitAssignmentOpen}
                setIsOrbitAssignmentOpen={setIsOrbitAssignmentOpen}
                handleCreateNewOrbit={handleCreateNewOrbit}
                selectedDueDate={selectedDueDate}
                setSelectedDueDate={setSelectedDueDate}
                isDatePickerOpen={isDatePickerOpen}
                setIsDatePickerOpen={setIsDatePickerOpen}
                onCreateNote={handleAddNote}
                onCreateTask={handleAddTask}
                newOrbitName={newOrbitName}
                setNewOrbitName={setNewOrbitName}
                existingOrbits={getUniqueOrbits()}
              />

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
                  <div className="ext-flex ext-items-center ext-gap-2">
                    <Circle className="ext-w-4 ext-h-4 ext-text-indigo-500" strokeWidth={2.5} />
                    <span className={`ext-text-xs ext-font-medium ${isDarkMode ? 'ext-text-white/70' : 'ext-text-gray-600'}`}>Halo</span>
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
