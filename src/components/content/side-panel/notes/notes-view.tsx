import { useState } from 'react';
import {
  Orbit, Globe, LinkIcon, Share2, Trash,
} from 'lucide-react';
import { Note } from '@/lib/types';
import { NoteDetailView } from './note-detail-view';
import { OrbitAssignmentDropdown } from '../shared/orbit-assignment-dropdown';

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
  isOrbitDropdownOpen,
  isScopeDropdownOpen,
  isOrbitAssignmentOpen,
  handleOrbitDropdownToggle,
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

  const themeClasses = isDarkMode
    ? 'ext-bg-[#030303] ext-text-white/70 ext-border-white/[0.05]'
    : 'ext-bg-white ext-text-gray-800 ext-border-gray-200';

  const themeHoverClasses = isDarkMode
    ? 'hover:ext-bg-white/[0.03] hover:ext-border-indigo-500/20'
    : 'hover:ext-bg-gray-50 hover:ext-border-indigo-200';

  // Render orbit dropdown
  const renderOrbitDropdown = () => (
    <div 
      className={`orbit-dropdown ext-absolute ext-left-0 ext-right-0 ext-mt-1 ext-py-1 ext-rounded-lg ext-border ${isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05]' : 'ext-bg-white ext-border-gray-200'} ext-shadow-lg ext-z-50`}
      onClick={(e) => e.stopPropagation()}
    >
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
          <button
            onClick={handleOrbitDropdownToggle}
            className={`ext-w-full ext-px-3 ext-py-1.5 ext-rounded-lg ext-border ext-flex ext-items-center ext-gap-2 ext-text-xs ${isDarkMode ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800'} ext-transition-colors`}
          >
            <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" />
            <span className="ext-truncate">{filterOrbit}</span>
            <span className={`ext-ml-auto ext-transform ext-transition-transform ${isOrbitDropdownOpen ? 'ext-rotate-180' : ''}`}>▾</span>
          </button>
          {isOrbitDropdownOpen && renderOrbitDropdown()}
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
        <NoteDetailView
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
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`ext-p-4 ext-rounded-lg ext-border ${themeClasses} ${themeHoverClasses} ext-transition-colors ext-group ext-cursor-pointer`}
              >
                <div className="ext-flex ext-items-center ext-gap-2 ext-mb-2">
                  <div className="ext-flex ext-items-center ext-gap-1">
                    <span
                      onClick={(e) => handleOrbitAssignmentToggle(e, note.id)}
                      className={`orbit-button ext-flex ext-items-center ext-gap-1 ext-text-xs ext-px-2 ext-py-1 ext-rounded-full ext-font-medium ext-cursor-pointer ext-transition-colors ${note.orbit === 'Ungrouped'
                        ? isDarkMode
                          ? 'ext-bg-white/[0.05] ext-text-white/50 hover:ext-bg-white/[0.1]'
                          : 'ext-bg-gray-100 ext-text-gray-500 hover:ext-bg-gray-200'
                        : isDarkMode
                          ? 'ext-bg-indigo-500/20 ext-text-indigo-300 hover:ext-bg-indigo-500/30'
                          : 'ext-bg-indigo-100 ext-text-indigo-600 hover:ext-bg-indigo-200'}`}
                    >
                      <Orbit className="ext-w-3 ext-h-3" /> {note.orbit}
                      {isOrbitAssignmentOpen === note.id && (
                        <OrbitAssignmentDropdown
                          itemId={note.id}
                          isDarkMode={isDarkMode}
                          notes={notes}
                          handleOrbitAssignment={handleOrbitAssignment}
                          setIsNewOrbitInputVisible={setIsNewOrbitInputVisible}
                          setIsOrbitAssignmentOpen={setIsOrbitAssignmentOpen}
                        />
                      )}
                    </span>
                  </div>
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
                <p className={`ext-text-sm ${isDarkMode ? 'ext-text-white/70' : 'ext-text-gray-800'} ext-mb-2 ext-line-clamp-3`}>{note.content}</p>
                <div className="ext-flex ext-items-center ext-justify-between">
                  <div className="ext-flex ext-items-center ext-gap-2">
                    {note.url && (
                      <a
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ${isDarkMode ? 'ext-text-white/30 hover:ext-text-indigo-300' : 'ext-text-gray-400 hover:ext-text-indigo-500'} ext-transition-colors ext-max-w-[200px]`}
                      >
                        <LinkIcon className="ext-w-3 ext-h-3 ext-shrink-0" />
                        <span className="ext-truncate">{new URL(note.url).hostname}</span>
                      </a>
                    )}
                  </div>
                  <div className="ext-flex ext-items-center ext-gap-1 ext-invisible group-hover:ext-visible">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareNote(note);
                      }}
                      className={`ext-p-1 ext-rounded ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors ext-relative`}
                    >
                      <Share2 className={`ext-w-3 ext-h-3 ${isDarkMode ? 'ext-text-white/50 hover:ext-text-indigo-300' : 'ext-text-gray-500 hover:ext-text-indigo-500'}`} />
                      {copiedNoteId === note.id && (
                        <span className={`ext-absolute ext-left-1/2 ext-top-1/2 -ext-translate-x-1/2 -ext-translate-y-1/2 ext-text-xs ext-font-medium ext-px-2 ext-py-1 ext-rounded ext-bg-indigo-500 ext-text-white ext-whitespace-nowrap`}>
                          Copied!
                        </span>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
      )}
    </div>
  );
} 