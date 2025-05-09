import { OrbitDropdown } from '../Shared/OrbitDropdown';

interface OrbitSelectorProps {
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
  newOrbitName: string;
  setNewOrbitName: (name: string) => void;
  existingOrbits: string[];
}

export function OrbitSelector({
  isDarkMode,
  creationOrbit,
  setCreationOrbit,
  isNewOrbitInputVisible,
  setIsNewOrbitInputVisible,
  isOrbitAssignmentOpen,
  setIsOrbitAssignmentOpen,
  handleCreateNewOrbit,
  newOrbitName,
  setNewOrbitName,
  existingOrbits,
}: OrbitSelectorProps) {
  return (
    <div className="ext-relative">
      <OrbitDropdown
        value={creationOrbit}
        onChange={setCreationOrbit}
        orbits={['Ungrouped', ...existingOrbits.filter(orbit => orbit !== 'Ungrouped')]}
        isDarkMode={isDarkMode}
        onNewOrbit={() => {
          setIsNewOrbitInputVisible(true);
          setIsOrbitAssignmentOpen('creation');
        }}
      />

      {/* New Orbit Input */}
      {isNewOrbitInputVisible && isOrbitAssignmentOpen === 'creation' && (
        <div 
          className={`ext-absolute ext-right-0 ext-bottom-[calc(100%+0.5rem)] ext-w-[200px] ext-p-3 ext-rounded-lg ${
            isDarkMode 
              ? 'ext-bg-[#1A1A1A]' 
              : 'ext-bg-white ext-shadow-lg'
          } ext-z-50`}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={newOrbitName}
            onChange={(e) => setNewOrbitName(e.target.value)}
            placeholder="Enter orbit name..."
            className={`ext-w-full ext-px-3 ext-py-2 ext-rounded-lg ext-text-sm ${
              isDarkMode 
                ? 'ext-bg-white/[0.03] ext-text-white/70 placeholder:ext-text-white/30' 
                : 'ext-bg-gray-50 ext-text-gray-800 placeholder:ext-text-gray-400'
            } focus:ext-outline-none`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleCreateNewOrbit();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setIsNewOrbitInputVisible(false);
                setIsOrbitAssignmentOpen(null);
              }
            }}
          />
          <div className="ext-flex ext-gap-2 ext-mt-3">
            <button
              type="button"
              onClick={() => {
                setIsNewOrbitInputVisible(false);
                setIsOrbitAssignmentOpen(null);
                setNewOrbitName('');
              }}
              className={`ext-flex-1 ext-px-3 ext-py-2 ext-rounded-lg ext-text-sm ${
                isDarkMode 
                  ? 'ext-bg-white/[0.03] ext-text-white/50 hover:ext-text-white' 
                  : 'ext-bg-gray-50 ext-text-gray-600 hover:ext-text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateNewOrbit}
              className="ext-flex-1 ext-px-3 ext-py-2 ext-rounded-lg ext-text-sm ext-bg-[#6366F1] ext-text-white hover:ext-opacity-90"
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 