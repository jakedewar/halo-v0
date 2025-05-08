import { Orbit, Plus } from 'lucide-react';
import { Note } from '@/lib/types';

interface OrbitAssignmentDropdownProps {
  itemId: string;
  isDarkMode: boolean;
  notes: Note[];
  handleOrbitAssignment: (itemId: string, orbit: string) => void;
  setIsNewOrbitInputVisible: (isVisible: boolean) => void;
  setIsOrbitAssignmentOpen: (id: string | null) => void;
}

export function OrbitAssignmentDropdown({
  itemId,
  isDarkMode,
  notes,
  handleOrbitAssignment,
  setIsNewOrbitInputVisible,
  setIsOrbitAssignmentOpen,
}: OrbitAssignmentDropdownProps) {
  // Get unique orbits from notes
  const getUniqueOrbits = () => {
    const orbits = notes.map(note => note.orbit).filter((orbit): orbit is string => orbit !== undefined);
    return Array.from(new Set(orbits));
  };

  return (
    <div 
      className={`orbit-assignment-dropdown ext-absolute ext-left-0 ext-right-0 ext-mt-1 ext-py-1 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05]' : 'ext-bg-white ext-border-gray-200'} ext-shadow-lg ext-z-50`}
    >
      <button
        onClick={() => handleOrbitAssignment(itemId, 'Ungrouped')}
        className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
      >
        <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" /> Ungrouped
      </button>
      {getUniqueOrbits().map((orbit) => (
        <button
          key={orbit}
          onClick={() => handleOrbitAssignment(itemId, orbit)}
          className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
        >
          <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" /> {orbit}
        </button>
      ))}
      <button
        onClick={() => {
          setIsNewOrbitInputVisible(true);
          setIsOrbitAssignmentOpen(itemId);
        }}
        className={`ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2 ${isDarkMode ? 'ext-text-white/70 hover:ext-bg-white/[0.05]' : 'ext-text-gray-800 hover:ext-bg-gray-50'} ext-transition-colors`}
      >
        <Plus className="ext-w-4 ext-h-4 ext-opacity-70" /> New Orbit
      </button>
    </div>
  );
} 