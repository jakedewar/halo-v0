// Components Structure: 

// Component Structure
src/components/content/side-panel/
├── SidePanel.tsx                    // Main container
├── components/
│   ├── Header/                      
│   │   ├── Header.tsx              // Panel header with logo and close button
│   │   └── SearchBar.tsx           // Search functionality
│   ├── Navigation/
│   │   └── TabNavigation.tsx       // Notes/Tasks tabs
│   ├── Notes/
│   │   ├── NotesView.tsx           // Already exists
│   │   ├── NoteDetail.tsx          // Note detail view
│   │   └── NoteCard.tsx            // Individual note component
│   ├── Tasks/
│   │   ├── TasksView.tsx           // Already exists
│   │   └── TaskCard.tsx            // Individual task component
│   ├── Creation/
│   │   ├── CreationBar.tsx         // New note/task creation area
│   │   ├── OrbitSelector.tsx       // Orbit selection dropdown
│   │   └── DatePicker.tsx          // Date picker for tasks
│   ├── Shared/
│   │   ├── OrbitDropdown.tsx       // Reusable orbit dropdown
│   │   └── ConfirmationDialog.tsx  // Reusable confirmation dialog
│   └── Footer/
│       └── Footer.tsx              // Panel footer
└── hooks/
    ├── useOrbitManagement.tsx      // Orbit-related logic
    ├── useNoteManagement.tsx       // Note CRUD operations
    ├── useTaskManagement.tsx       // Task CRUD operations
    └── usePanelState.tsx           // Panel-level state management

// State Management: 

// hooks/useOrbitManagement.ts

export const useOrbitManagement = () => {
  const [creationOrbit, setCreationOrbit] = useState<string>('Ungrouped');
  const [isNewOrbitInputVisible, setIsNewOrbitInputVisible] = useState(false);
  const [newOrbitName, setNewOrbitName] = useState('');

  const handleCreateNewOrbit = (name: string) => {
    // Orbit creation logic
  };

  return {
    creationOrbit,
    setCreationOrbit,
    isNewOrbitInputVisible,
    setIsNewOrbitInputVisible,
    newOrbitName,
    setNewOrbitName,
    handleCreateNewOrbit
  };
};

// components/Creation/OrbitSelector.tsx
export const OrbitSelector = () => {
  const {
    creationOrbit,
    setCreationOrbit,
    isNewOrbitInputVisible,
    setIsNewOrbitInputVisible,
    handleCreateNewOrbit
  } = useOrbitManagement();

  return (
    <div className="ext-relative">
      {/* Orbit selection UI */}
    </div>
  );
};

// components/Creation/NewOrbitInput.tsx

interface NewOrbitInputProps {
  onSubmit: (orbitName: string) => void;
  onCancel: () => void;
}

export const NewOrbitInput = ({ onSubmit, onCancel }: NewOrbitInputProps) => {
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSubmit(name);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      onClick={e => e.stopPropagation()}
      className="new-orbit-input ext-absolute ..."
    >
      {/* Input UI */}
    </form>
  );
};

// hooks/useClickOutside.ts

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void,
  excludeRefs: RefObject<HTMLElement>[] = []
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      // Check if click was inside any excluded elements
      const clickedInsideExcluded = excludeRefs.some(
        excludeRef => excludeRef.current?.contains(event.target as Node)
      );

      if (!clickedInsideExcluded) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, handler, excludeRefs]);
};

// Main Component Simplification:

export default function SidePanel() {
  const { isOpen, setIsOpen } = usePanelState();
  const { activeTab, setActiveTab } = useNavigation();
  const { theme, toggleTheme } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <PanelBackdrop onClose={() => setIsOpen(false)} />
          <motion.div className="...">
            <Header onClose={() => setIsOpen(false)} />
            <SearchBar />
            <TabNavigation 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <main className="ext-flex-1 ext-overflow-y-auto">
              {activeTab === 'notes' ? <NotesView /> : <TasksView />}
            </main>
            <CreationBar />
            <Footer onThemeToggle={toggleTheme} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}