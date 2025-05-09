import { useState } from 'react';
import { Globe, LinkIcon } from 'lucide-react';
import { Note } from '@/lib/types';
import { NoteDetail } from './NoteDetail';
import { NoteCard } from './NoteCard';
import { OrbitDropdown } from '../../components/Shared/OrbitDropdown';

interface NotesViewProps {
  notes: Note[];
  isDarkMode: boolean;
  currentUrl: string;
  filterOrbit: string;
  filterScope: 'url' | 'global';
  isOrbitDropdownOpen: boolean;
  isScopeDropdownOpen: boolean;
  isOrbitAssignmentOpen: string | null;
  handleOrbitDropdownToggle: (e: React.MouseEvent) => void;
  handleScopeDropdownToggle: (e: React.MouseEvent) => void;
  handleOrbitFilter: (orbit: string) => void;
  handleScopeFilter: (scope: 'url' | 'global') => void;
  handleOrbitAssignmentToggle: (e: React.MouseEvent, noteId: string) => void;
  handleShareNote: (note: Note) => void;
  setNoteToDelete: (noteId: string | null) => void;
  copiedNoteId: string | null;
  handleOrbitAssignment: (noteId: string, orbit: string) => void;
  setIsNewOrbitInputVisible: (isVisible: boolean) => void;
  setIsOrbitAssignmentOpen: (id: string | null) => void;
}

export function NotesView({
  notes,
  isDarkMode,
  currentUrl,
  filterOrbit,
  filterScope,
  isScopeDropdownOpen,
  isOrbitAssignmentOpen,
  handleScopeDropdownToggle,
  handleOrbitFilter,
  handleScopeFilter,
  handleOrbitAssignmentToggle,
  handleShareNote,
  setNoteToDelete,
  copiedNoteId,
  handleOrbitAssignment,
  setIsNewOrbitInputVisible,
  setIsOrbitAssignmentOpen,
}: NotesViewProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // Get unique orbits for the dropdown
  const getUniqueOrbits = () => {
    const orbits = ['All Orbits', 'Only Ungrouped Notes'];
    const noteOrbits = Array.from(new Set(notes.map(note => note.orbit).filter((orbit): orbit is string => orbit !== undefined)));
    return [...orbits, ...noteOrbits];
  };

  // Get unique orbits for assignment
  const getAssignmentOrbits = () => {
    return Array.from(new Set(notes.map(note => note.orbit).filter((orbit): orbit is string => orbit !== undefined)));
  };

  // Render scope dropdown
  const renderScopeDropdown = () => (
    <div 
      className={`scope-dropdown ext-absolute ext-left-0 ext-right-0 ext-mt-1 ext-py-1 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05]' : 'ext-bg-white ext-border-gray-200'} ext-shadow-lg ext-z-50`}
      onClick={(e) => e.stopPropagation()}
    >
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

  return (
    <div className="ext-space-y-4">
      {/* Filter Bar */}
      <div className="ext-flex ext-gap-2 ext-mb-4">
        {/* Orbit Filter */}
        <div className="ext-relative ext-flex-1">
          <OrbitDropdown
            value={filterOrbit}
            onChange={handleOrbitFilter}
            orbits={getUniqueOrbits()}
            isDarkMode={isDarkMode}
            className="orbit-dropdown"
            variant="filter"
          />
        </div>

        {/* Scope Filter */}
        <div className="ext-relative ext-flex-1">
          <button
            onClick={handleScopeDropdownToggle}
            className={`ext-w-full ext-px-3 ext-py-1.5 ext-rounded-lg ext-border ext-flex ext-items-center ext-gap-2 ext-text-xs ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800'} ext-transition-colors`}
          >
            {filterScope === 'global' && <Globe className="ext-w-4 ext-h-4 ext-opacity-70" />}
            {filterScope === 'url' && <LinkIcon className="ext-w-4 ext-h-4 ext-opacity-70" />}
            <span className="ext-truncate">
              {filterScope === 'global' ? 'All Notes' : 'Page Notes'}
            </span>
            <span className={`ext-ml-auto ext-transform ext-transition-transform ${isScopeDropdownOpen ? 'ext-rotate-180' : ''}`}>▾</span>
          </button>
          {isScopeDropdownOpen && renderScopeDropdown()}
        </div>
      </div>

      {selectedNote ? (
        <NoteDetail
          note={selectedNote}
          onBack={() => setSelectedNote(null)}
          isDarkMode={isDarkMode}
          handleShareNote={handleShareNote}
          setNoteToDelete={setNoteToDelete}
          copiedNoteId={copiedNoteId}
          isOrbitAssignmentOpen={isOrbitAssignmentOpen}
          handleOrbitAssignmentToggle={handleOrbitAssignmentToggle}
          handleOrbitAssignment={handleOrbitAssignment}
          setIsNewOrbitInputVisible={setIsNewOrbitInputVisible}
          setIsOrbitAssignmentOpen={setIsOrbitAssignmentOpen}
          existingOrbits={getAssignmentOrbits()}
        />
      ) : (
        <div className="ext-space-y-4">
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
              <NoteCard
                key={note.id}
                note={note}
                isDarkMode={isDarkMode}
                handleShareNote={handleShareNote}
                setNoteToDelete={setNoteToDelete}
                copiedNoteId={copiedNoteId}
                isOrbitAssignmentOpen={isOrbitAssignmentOpen}
                handleOrbitAssignmentToggle={handleOrbitAssignmentToggle}
                handleOrbitAssignment={handleOrbitAssignment}
                setIsNewOrbitInputVisible={setIsNewOrbitInputVisible}
                setIsOrbitAssignmentOpen={setIsOrbitAssignmentOpen}
                onSelect={setSelectedNote}
                existingOrbits={getAssignmentOrbits()}
              />
            ))}
        </div>
      )}
    </div>
  );
} 