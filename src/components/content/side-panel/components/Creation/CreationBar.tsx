import { useState, useRef } from 'react';
import { Calendar, Unlink, LinkIcon, Plus } from 'lucide-react';
import { OrbitSelector } from './OrbitSelector';
import { DatePicker } from './DatePicker';

interface CreationBarProps {
  activeTab: 'notes' | 'tasks';
  isDarkMode: boolean;
  creationOrbit: string;
  setCreationOrbit: (orbit: string) => void;
  isCreationOrbitDropdownOpen: boolean;
  setIsCreationOrbitDropdownOpen: (isOpen: boolean) => void;
  isNewOrbitInputVisible: boolean;
  setIsNewOrbitInputVisible: (isVisible: boolean) => void;
  isOrbitAssignmentOpen: string | null;
  setIsOrbitAssignmentOpen: (id: string | null) => void;
  handleCreateNewOrbit: () => void;
  selectedDueDate: Date | null;
  setSelectedDueDate: (date: Date | null) => void;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (isOpen: boolean) => void;
  onCreateNote: (content: string, isGlobal: boolean) => void;
  onCreateTask: (content: string, isGlobal: boolean) => void;
  newOrbitName: string;
  setNewOrbitName: (name: string) => void;
  existingOrbits: string[];
}

export function CreationBar({
  activeTab,
  isDarkMode,
  creationOrbit,
  setCreationOrbit,
  isCreationOrbitDropdownOpen,
  setIsCreationOrbitDropdownOpen,
  isNewOrbitInputVisible,
  setIsNewOrbitInputVisible,
  isOrbitAssignmentOpen,
  setIsOrbitAssignmentOpen,
  handleCreateNewOrbit,
  selectedDueDate,
  setSelectedDueDate,
  isDatePickerOpen,
  setIsDatePickerOpen,
  onCreateNote,
  onCreateTask,
  newOrbitName,
  setNewOrbitName,
  existingOrbits,
}: CreationBarProps) {
  const [content, setContent] = useState('');
  const [isGlobal, setIsGlobal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (activeTab === 'notes') {
      onCreateNote(content, isGlobal);
    } else {
      onCreateTask(content, isGlobal);
    }
    
    setContent('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ext-mt-6 ext-border-t ext-border-gray-200 dark:ext-border-white/[0.05] ext-relative ext-bg-white dark:ext-bg-transparent ext-mx-[-24px] ext-px-6">
      <div className="ext-py-2">
        {/* Controls */}
        <div className="ext-flex ext-items-center ext-justify-between ext-mb-3">
          {/* Left side controls */}
          <div className="ext-flex ext-items-center ext-gap-2">
            <button
              type="button"
              onClick={() => setIsGlobal(!isGlobal)}
              className={`ext-p-2 ext-rounded-full ${
                !isGlobal
                  ? 'ext-text-[#6366F1]'
                  : isDarkMode
                    ? 'ext-text-white/50'
                    : 'ext-text-gray-400'
              }`}
            >
              {isGlobal ? (
                <Unlink className="ext-w-5 ext-h-5" />
              ) : (
                <LinkIcon className="ext-w-5 ext-h-5" />
              )}
            </button>

            {activeTab === 'tasks' && (
              <div className="ext-relative">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className={`ext-p-2 ext-rounded-full ${
                    selectedDueDate
                      ? 'ext-text-[#6366F1]'
                      : isDarkMode 
                        ? 'ext-text-white/50' 
                        : 'ext-text-gray-400'
                  }`}
                >
                  <Calendar className="ext-w-5 ext-h-5" />
                </button>

                {/* Date Picker Dropdown */}
                {isDatePickerOpen && (
                  <DatePicker
                    selectedDate={selectedDueDate}
                    onSelect={setSelectedDueDate}
                    onClose={() => setIsDatePickerOpen(false)}
                    isDarkMode={isDarkMode}
                  />
                )}
              </div>
            )}
          </div>

          {/* Right side - Orbit Selection */}
          <OrbitSelector
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
            newOrbitName={newOrbitName}
            setNewOrbitName={setNewOrbitName}
            existingOrbits={existingOrbits}
          />
        </div>

        {/* Input Area */}
        <div className="ext-flex ext-gap-2">
          <textarea
            ref={inputRef}
            value={content}
            onChange={handleInput}
            placeholder={`Add a new ${activeTab === 'notes' ? 'note' : 'task'}...`}
            className={`ext-flex-1 ext-px-4 ext-py-2 ext-text-sm ext-resize-none ext-rounded-lg ext-border ext-transition-colors focus:ext-outline-none focus:ext-border-indigo-500/30 ${
              isDarkMode 
                ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70 placeholder:ext-text-white/30' 
                : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800 placeholder:ext-text-gray-400'
            }`}
            rows={1}
            style={{ minHeight: '2.75rem' }}
          />
          <button
            type="submit"
            className="ext-w-11 ext-h-11 ext-rounded-[14px] ext-flex ext-items-center ext-justify-center ext-bg-[#6366F1] ext-text-white hover:ext-opacity-90"
          >
            <Plus className="ext-w-6 ext-h-6" />
          </button>
        </div>
      </div>
    </form>
  );
} 