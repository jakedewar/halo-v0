import { useState, useEffect } from 'react';
import { Plus, Link, Link2Off, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Card } from '@/components/ui/card.tsx';

interface Note {
  id: string;
  content: string;
  url?: string;
  timestamp: number;
}

interface NotesProps {
  showGlobal: boolean;
  onToggleView?: () => void;
}

export default function Notes({ showGlobal, onToggleView }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [linkToUrl, setLinkToUrl] = useState(!showGlobal);
  const currentUrl = window.location.href;

  // Load existing notes when component mounts
  useEffect(() => {
    chrome.storage.local.get(['notes'], (result) => {
      if (result.notes) {
        setNotes(result.notes);
      }
    });
  }, []);

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: crypto.randomUUID(),
      content: newNote,
      url: linkToUrl ? currentUrl : undefined,
      timestamp: Date.now()
    };

    chrome.storage.local.get(['notes'], (result) => {
      const updatedNotes = [...(result.notes || []), note];
      chrome.storage.local.set({ notes: updatedNotes });
      setNotes(updatedNotes);
      setNewNote('');
    });
  };

  const deleteNote = (noteId: string) => {
    chrome.storage.local.get(['notes'], (result) => {
      const updatedNotes = (result.notes || []).filter((n: Note) => n.id !== noteId);
      chrome.storage.local.set({ notes: updatedNotes });
      setNotes(updatedNotes);
    });
  };

  // Filter notes based on showGlobal
  const filteredNotes = showGlobal 
    ? notes 
    : notes.filter(note => note.url === currentUrl);

  return (
    <div className="ext-flex ext-flex-col ext-gap-3">
      {/* Input Area */}
      <div className="ext-flex ext-flex-col ext-gap-2">
        <div className="ext-flex ext-items-center ext-gap-2">
          <Textarea
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
            className="ext-resize-none ext-h-20 ext-border ext-border-input/50 ext-shadow-sm focus-visible:ext-ring-1 focus-visible:ext-ring-ring"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
          />
        </div>
        <div className="ext-flex ext-justify-between ext-items-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setLinkToUrl(!linkToUrl)}
          >
            {linkToUrl ? <Link size={16} /> : <Link2Off size={16} />}
          </Button>
          <Button
            size="sm"
            onClick={addNote}
          >
            <Plus size={16} className="ext-mr-1" /> Add Note
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="ext-flex ext-gap-2 ext-mt-2 ext-mb-2">
        <Button
          size="sm"
          variant="outline"
          className={`ext-flex-1 ext-items-center ext-gap-2 ${
            showGlobal ? 'ext-bg-primary/10 ext-text-primary ext-border-primary/20' : ''
          }`}
          onClick={onToggleView}
        >
          <Globe size={16} />
          All Notes
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`ext-flex-1 ext-items-center ext-gap-2 ${
            !showGlobal ? 'ext-bg-primary/10 ext-text-primary ext-border-primary/20' : ''
          }`}
          onClick={onToggleView}
        >
          <Link size={16} />
          Page Notes
        </Button>
      </div>

      {/* Notes List */}
      <div className="ext-flex ext-flex-col ext-gap-2">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="ext-w-full">
            <div className="ext-flex ext-items-start ext-gap-2 ext-p-3">
              <div className="ext-flex-1 ext-min-w-0">
                <p className="ext-text-sm">{note.content}</p>
                {note.url && (
                  <a
                    href={note.url}
                    className="ext-text-xs ext-text-muted-foreground ext-mt-2 ext-block ext-truncate"
                  >
                    {note.url}
                  </a>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="ext-p-0 hover:ext-bg-transparent ext-h-6 ext-w-6 ext-shrink-0"
                onClick={() => deleteNote(note.id)}
              >
                <X size={14} className="ext-text-muted-foreground hover:ext-text-destructive" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 