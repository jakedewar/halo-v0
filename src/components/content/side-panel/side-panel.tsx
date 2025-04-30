import { useRef, useState, useCallback, memo, useEffect } from 'react';
import { ChevronsRight, CircleHelp, CircleX, Settings, Circle } from 'lucide-react';

import { Button } from '@/components/ui/button.tsx';
import CardSwitch from '@/components/ui/card-switch.tsx';
import { useSettings } from '@/hooks/useSettings.tsx';
import { MESSAGE_TYPES } from '@/lib/types.ts';
import Notes from './notes';
import Tasks from './tasks';

const MemoizedNotes = memo(Notes);
const MemoizedTasks = memo(Tasks);

// Separate component for the toggle button to prevent unnecessary re-renders
const ToggleButton = memo(({ isOpen, onToggle, onClose }: { isOpen: boolean; onToggle: () => void; onClose: () => void }) => (
  <div
    className={`halo-toggle-button ${
      isOpen && 'ext-hidden'
    } ext-bg-background ext-text-foreground ext-shadow-lg ext-flex ext-items-center ext-group ext-fixed ext-right-0 ext-top-1/2 ext-border-secondary-2 ext-border-2 ext-rounded-l-full ext-px-2 ext-py-1 hover:ext-rounded-full`}
  >
    <button className="" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
      <Circle size={29} className="ext-text-primary" />
    </button>
    <button 
      className="ext-cursor-default ext-hidden group-hover:ext-block ext-pl-2" 
      onClick={(e) => { e.stopPropagation(); onClose(); }}
    >
      <CircleX className="ext-text-red-500" size={16} />
    </button>
  </div>
));

// Separate component for the header to prevent unnecessary re-renders
const Header = memo(({ theme, onSettingsClick, onToggle }: { theme: string; onSettingsClick: () => void; onToggle: () => void }) => (
  <div className="ext-flex ext-flex-row ext-justify-between ext-items-center">
    <div className="ext-flex">
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={(e) => { e.stopPropagation(); onSettingsClick(); }}
      >
        <Settings size={12} />
      </Button>
    </div>
    <div className="ext-flex">
      <div className="ext-flex ext-flex-row ext-items-center">
        <Circle className="ext-pl-3 ext-text-primary" size={32} />
        <p className={`ext-text-center ext-text ext-ml-2 ext-font-black ${theme === 'dark' ? 'ext-text-white' : 'ext-text-black'}`}>
          Halo
        </p>
      </div>
    </div>
    <div className="ext-flex">
      <Button 
        size="icon" 
        variant="ghost" 
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        <ChevronsRight size={12} />
      </Button>
    </div>
  </div>
));

export default function SidePanel() {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { settings, setSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'notes' | 'tasks'>('notes');
  const [showGlobal, setShowGlobal] = useState<boolean>(false);

  const handleClose = useCallback(() => {
    const closeConfirmed = window.confirm('You can enable it again in settings.');
    if (closeConfirmed) {
      setSettings({ hide_sidebar_button: true });
    }
  }, [setSettings]);

  const handleSettingsClick = useCallback(() => {
    chrome?.runtime?.sendMessage({ type: MESSAGE_TYPES.OPEN_OPTIONS });
  }, []);

  const handleToggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleTabChange = useCallback((tab: 'notes' | 'tasks') => {
    setActiveTab(tab);
  }, []);

  const handleToggleView = useCallback(() => {
    setShowGlobal(prev => !prev);
  }, []);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if the target is an input or textarea to prevent triggering while typing
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      } else if (
        event.key.toLowerCase() === 'h' && 
        event.shiftKey && 
        (event.metaKey || event.ctrlKey) // metaKey for Cmd (Mac), ctrlKey for Ctrl (Windows/Linux)
      ) {
        event.preventDefault(); // Prevent any default behavior
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen]);

  return (
    <>
      {!settings.hide_sidebar_button && (
        <ToggleButton isOpen={isOpen} onToggle={handleToggleOpen} onClose={handleClose} />
      )}

      {/* SIDEBAR */}
      <div
        ref={sidebarRef}
        className={`${
          isOpen ? 'ext-shadow-2xl' : '-ext-mr-72'
        } ext-w-72 ext-p-4 ext-fixed ext-right-0 ext-top-0 ext-h-full ext-transform ext-transition-all ext-duration-200 ext-ease-in-out ext-bg-background ext-overflow-hidden ext-flex ext-rounded-l-2xl`}
      >
        <div className="ext-w-full ext-h-full ext-text-foreground ext-flex ext-flex-col">
          <Header theme={settings.theme} onSettingsClick={handleSettingsClick} onToggle={handleToggleOpen} />

          {/* Tabs */}
          <div className="ext-flex ext-gap-2 ext-mt-4">
            <Button
              size="sm"
              variant={activeTab === 'notes' ? 'default' : 'ghost'}
              onClick={(e) => { e.stopPropagation(); handleTabChange('notes'); }}
              className="ext-flex-1"
            >
              Notes
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'tasks' ? 'default' : 'ghost'}
              onClick={(e) => { e.stopPropagation(); handleTabChange('tasks'); }}
              className="ext-flex-1"
            >
              Tasks
            </Button>
          </div>

          {/* Content Area */}
          <div className="ext-flex-1 ext-overflow-y-auto ext-mt-4">
            {activeTab === 'notes' ? 
              <MemoizedNotes showGlobal={showGlobal} onToggleView={handleToggleView} /> : 
              <MemoizedTasks showGlobal={showGlobal} onToggleView={handleToggleView} />
            }
          </div>

          {/* Settings */}
          <div className="ext-mt-4">
            <CardSwitch
              title={'Dark Mode'}
              checked={settings.theme === 'dark'}
              onChecked={(checked) => setSettings({ theme: checked ? 'dark' : 'light' })}
              subtitle={'Switch between dark mode applied to all extension modules.'}
            />
          </div>

          {/* FOOTER */}
          <div className="ext-flex ext-mt-4">
            <div className="ext-flex ext-flex-row ext-justify-between ext-items-center ext-w-full">
              <Button size="icon" variant="ghost">
                <CircleHelp size={12} />
              </Button>
              <p className="ext-text-xs">Version 0.0.1</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
