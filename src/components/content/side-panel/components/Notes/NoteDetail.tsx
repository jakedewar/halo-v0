import { ChevronLeft, Globe, LinkIcon, Share2, Trash } from 'lucide-react';
import { Note } from '@/lib/types';
import { OrbitDropdown } from '../../components/Shared/OrbitDropdown';

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
  isDarkMode: boolean;
  handleShareNote: (note: Note) => void;
  setNoteToDelete: (noteId: string | null) => void;
  copiedNoteId: string | null;
  isOrbitAssignmentOpen: string | null;
  handleOrbitAssignmentToggle: (e: React.MouseEvent, noteId: string) => void;
  handleOrbitAssignment: (noteId: string, orbit: string) => void;
  setIsNewOrbitInputVisible: (isVisible: boolean) => void;
  setIsOrbitAssignmentOpen: (id: string | null) => void;
  existingOrbits: string[];
}

export function NoteDetail({
  note,
  onBack,
  isDarkMode,
  handleShareNote,
  setNoteToDelete,
  copiedNoteId,
  handleOrbitAssignment,
  setIsNewOrbitInputVisible,
  setIsOrbitAssignmentOpen,
  existingOrbits,
}: NoteDetailProps) {
  const themeClasses = isDarkMode
    ? 'ext-bg-[#030303] ext-text-white/70 ext-border-white/[0.05]'
    : 'ext-bg-white ext-text-gray-800 ext-border-gray-200';

  const themeHoverClasses = isDarkMode
    ? 'hover:ext-bg-white/[0.03] hover:ext-border-indigo-500/20'
    : 'hover:ext-bg-gray-50 hover:ext-border-indigo-200';

  return (
    <div className="ext-h-full ext-flex ext-flex-col">
      {/* Header */}
      <div className="ext-flex ext-items-center ext-gap-2 ext-mb-6">
        <button
          onClick={onBack}
          className={`ext-p-1 ext-rounded-full ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors`}
        >
          <ChevronLeft className={`ext-w-5 ext-h-5 ${isDarkMode ? 'ext-text-white/50' : 'ext-text-gray-400'}`} />
        </button>
        <h2 className={`ext-text-md ext-font-medium ${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'}`}>
          Note Details
        </h2>
      </div>

      {/* Content */}
      <div className="ext-flex-1 ext-overflow-y-auto">
        <div className={`ext-p-6 ext-rounded-lg ext-border ${themeClasses} ${themeHoverClasses}`}>
          {/* Metadata */}
          <div className="ext-flex ext-items-center ext-gap-2 ext-mb-4">
            <div className="ext-flex ext-items-center ext-gap-1">
              <OrbitDropdown
                value={note.orbit || 'Ungrouped'}
                onChange={(orbit) => handleOrbitAssignment(note.id, orbit)}
                orbits={['Ungrouped', ...existingOrbits.filter(orbit => orbit !== 'Ungrouped')]}
                isDarkMode={isDarkMode}
                onNewOrbit={() => {
                  setIsNewOrbitInputVisible(true);
                  setIsOrbitAssignmentOpen(note.id);
                }}
                variant="default"
                className="ext-min-w-[120px]"
              />
            </div>
            <span className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ext-px-2 ext-py-1 ext-rounded-full ext-font-medium ${
              note.scope === 'global'
                ? isDarkMode
                  ? 'ext-bg-purple-500/20 ext-text-purple-300'
                  : 'ext-bg-purple-100 ext-text-purple-600'
                : isDarkMode
                  ? 'ext-bg-blue-500/20 ext-text-blue-300'
                  : 'ext-bg-blue-100 ext-text-blue-600'
            }`}>
              {note.scope === 'global' ? <Globe className="ext-w-3 ext-h-3" /> : <LinkIcon className="ext-w-3 ext-h-3" />} {note.scope === 'global' ? 'Unlinked' : 'Linked'}
            </span>
          </div>

          {/* Note Content */}
          <div className={`ext-text-sm ${isDarkMode ? 'ext-text-white/70' : 'ext-text-gray-800'} ext-whitespace-pre-wrap ext-mb-6`}>
            {note.content}
          </div>

          {/* URL on its own line */}
          {note.url && (
            <div className="ext-mb-3">
              <a
                href={note.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`ext-flex ext-items-center ext-gap-1 ext-text-xs ${isDarkMode ? 'ext-text-indigo-300 hover:ext-text-indigo-400' : 'ext-text-indigo-600 hover:ext-text-indigo-800'} ext-transition-colors ext-break-all`}
              >
                <LinkIcon className="ext-w-3 ext-h-3 ext-shrink-0" />
                <span>{note.url}</span>
              </a>
            </div>
          )}

          {/* Actions on their own line, right-aligned */}
          <div className="ext-flex ext-justify-end ext-items-center ext-gap-2">
            <button
              onClick={() => handleShareNote(note)}
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
    </div>
  );
} 