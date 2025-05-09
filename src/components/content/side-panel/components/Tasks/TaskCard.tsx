import { Check, Calendar, Trash } from 'lucide-react';
import { Task } from '@/lib/types';
import { OrbitDropdown } from '../../components/Shared/OrbitDropdown';

interface TaskCardProps {
  task: Task;
  isDarkMode: boolean;
  isOrbitAssignmentOpen: string | null;
  handleOrbitAssignmentToggle: (e: React.MouseEvent, taskId: string) => void;
  setTaskToDelete: (taskId: string | null) => void;
  toggleTask: (taskId: string) => void;
  handleOrbitAssignment: (taskId: string, orbit: string) => void;
  setIsNewOrbitInputVisible: (isVisible: boolean) => void;
  setIsOrbitAssignmentOpen: (id: string | null) => void;
  existingOrbits: string[];
}

export function TaskCard({
  task,
  isDarkMode,
  setTaskToDelete,
  toggleTask,
  handleOrbitAssignment,
  setIsNewOrbitInputVisible,
  setIsOrbitAssignmentOpen,
  existingOrbits,
}: TaskCardProps) {
  const themeClasses = isDarkMode
    ? 'ext-bg-[#030303] ext-text-white/70 ext-border-white/[0.05]'
    : 'ext-bg-white ext-text-gray-800 ext-border-gray-200';

  const themeHoverClasses = isDarkMode
    ? 'hover:ext-bg-white/[0.03] hover:ext-border-indigo-500/20'
    : 'hover:ext-bg-gray-50 hover:ext-border-indigo-200';

  return (
    <div
      className={`ext-p-4 ext-rounded-lg ext-border ${themeClasses} ${themeHoverClasses} ext-transition-colors ext-group`}
    >
      <div className="ext-flex ext-items-start ext-gap-3">
        <button
          onClick={() => toggleTask(task.id)}
          className={`ext-flex ext-items-center ext-justify-center ext-w-5 ext-h-5 ext-rounded-full ext-border ext-transition-colors ${
            task.completed
              ? isDarkMode
                ? 'ext-bg-brand-600 ext-border-brand-600 ext-text-white'
                : 'ext-bg-brand-600 ext-border-brand-600 ext-text-white'
              : isDarkMode
              ? 'ext-border-white/20 hover:ext-border-brand-500'
              : 'ext-border-gray-300 hover:ext-border-brand-500'
          }`}
        >
          {task.completed && <Check className="ext-w-3 ext-h-3" />}
        </button>

        <div className="ext-flex-1">
          <div className="ext-flex ext-items-center ext-gap-2 ext-mb-2">
            <OrbitDropdown
              value={task.orbit || 'Ungrouped'}
              onChange={(orbit) => handleOrbitAssignment(task.id, orbit)}
              orbits={['Ungrouped', ...existingOrbits.filter(orbit => orbit !== 'Ungrouped')]}
              isDarkMode={isDarkMode}
              onNewOrbit={() => {
                setIsNewOrbitInputVisible(true);
                setIsOrbitAssignmentOpen(task.id);
              }}
              variant="default"
              className="ext-min-w-[120px]"
            />

            {task.dueDate && (
              <span
                className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ext-px-2 ext-py-1 ext-rounded-full ext-font-medium ${
                  isDarkMode
                    ? 'ext-bg-brand-600/20 ext-text-brand-300'
                    : 'ext-bg-brand-100 ext-text-brand-600'
                }`}
              >
                <Calendar className="ext-w-3 ext-h-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <p
            className={`ext-text-sm ${
              task.completed
                ? isDarkMode
                  ? 'ext-text-white/30 ext-line-through'
                  : 'ext-text-gray-400 ext-line-through'
                : isDarkMode
                ? 'ext-text-white/70'
                : 'ext-text-gray-800'
            }`}
          >
            {task.content}
          </p>
        </div>

        <button
          onClick={() => setTaskToDelete(task.id)}
          className={`ext-p-1 ext-rounded ext-invisible group-hover:ext-visible ${
            isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'
          } ext-transition-colors`}
        >
          <Trash
            className={`ext-w-3 ext-h-3 ${
              isDarkMode
                ? 'ext-text-red-400 hover:ext-text-red-300'
                : 'ext-text-red-500 hover:ext-text-red-600'
            }`}
          />
        </button>
      </div>
    </div>
  );
} 