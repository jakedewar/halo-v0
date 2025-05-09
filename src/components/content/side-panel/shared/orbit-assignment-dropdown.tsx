import { Note, Task } from '@/lib/types';
import { OrbitDropdown } from '../components/Shared/OrbitDropdown';

interface OrbitAssignmentDropdownProps {
  itemId: string;
  isDarkMode: boolean;
  items: (Note | Task)[];
  handleOrbitAssignment: (itemId: string, orbit: string) => void;
  setIsNewOrbitInputVisible: (isVisible: boolean) => void;
  setIsOrbitAssignmentOpen: (id: string | null) => void;
}

export function OrbitAssignmentDropdown({
  itemId,
  isDarkMode,
  items,
  handleOrbitAssignment,
  setIsNewOrbitInputVisible,
  setIsOrbitAssignmentOpen,
}: OrbitAssignmentDropdownProps) {
  // Get unique orbits from items
  const getUniqueOrbits = () => {
    const orbits = ['Ungrouped'];
    const itemOrbits = items.map(item => item.orbit).filter((orbit): orbit is string => orbit !== undefined);
    return [...orbits, ...Array.from(new Set(itemOrbits))];
  };

  return (
    <OrbitDropdown
      value=""
      onChange={(orbit) => handleOrbitAssignment(itemId, orbit)}
      orbits={getUniqueOrbits()}
      isDarkMode={isDarkMode}
      onNewOrbit={() => {
        setIsNewOrbitInputVisible(true);
        setIsOrbitAssignmentOpen(itemId);
      }}
      placeholder="Move to orbit..."
      className="orbit-assignment-dropdown"
    />
  );
} 