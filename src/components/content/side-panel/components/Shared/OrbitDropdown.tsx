import * as React from 'react';
import { Check, ChevronDown, Plus, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrbitDropdownProps {
  value: string;
  onChange: (value: string) => void;
  orbits: string[];
  isDarkMode?: boolean;
  onNewOrbit?: () => void;
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'filter';
}

export function OrbitDropdown({
  value,
  onChange,
  orbits,
  isDarkMode = false,
  onNewOrbit,
  className,
  placeholder = 'Select Orbit',
  variant = 'default'
}: OrbitDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonStyles = variant === 'filter'
    ? `ext-w-full ext-px-3 ext-py-1.5 ext-rounded-lg ext-border ext-flex ext-items-center ext-gap-2 ext-text-xs ${
        isDarkMode
          ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70'
          : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800'
      } ext-transition-colors`
    : `ext-w-full ext-flex ext-items-center ext-justify-between ext-px-3 ext-py-2 ext-rounded-lg ext-text-sm ${
        isDarkMode
          ? 'ext-bg-white/[0.05] ext-text-white/70 hover:ext-text-white'
          : 'ext-bg-gray-50 ext-text-gray-600 hover:ext-text-gray-900'
      } ext-transition-colors`;

  const itemStyles = variant === 'filter'
    ? `ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-xs ext-flex ext-items-center ext-gap-2`
    : `ext-w-full ext-px-3 ext-py-2 ext-text-left ext-text-sm ext-flex ext-items-center ext-justify-between`;

  return (
    <div ref={dropdownRef} className={cn('ext-relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyles}
      >
        {variant === 'filter' ? (
          <>
            <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" />
            <span className="ext-truncate">{value}</span>
            <span className={`ext-ml-auto ext-transform ext-transition-transform ${isOpen ? 'ext-rotate-180' : ''}`}>▾</span>
          </>
        ) : (
          <>
            <span>{value || placeholder}</span>
            <ChevronDown className={`ext-w-4 ext-h-4 ext-transition-transform ${isOpen ? 'ext-rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={`ext-absolute ext-z-50 ext-top-full ext-left-0 ext-right-0 ext-mt-1 ext-rounded-lg ext-border ext-shadow-lg ${
            isDarkMode
              ? 'ext-bg-[#030303] ext-border-white/[0.05]'
              : 'ext-bg-white ext-border-gray-200'
          }`}
        >
          <div className="ext-max-h-48 ext-overflow-y-auto">
            {orbits.map((orbit) => (
              <button
                key={orbit}
                onClick={() => {
                  onChange(orbit);
                  setIsOpen(false);
                }}
                className={`${itemStyles} ${
                  isDarkMode
                    ? 'ext-text-white/70 hover:ext-bg-white/[0.05]'
                    : 'ext-text-gray-800 hover:ext-bg-gray-50'
                } ext-transition-colors`}
              >
                {variant === 'filter' ? (
                  <>
                    <Orbit className="ext-w-4 ext-h-4 ext-opacity-70" /> {orbit}
                  </>
                ) : (
                  <>
                    <span>{orbit}</span>
                    {value === orbit && <Check className="ext-w-4 ext-h-4" />}
                  </>
                )}
              </button>
            ))}
          </div>

          {onNewOrbit && (
            <div className="ext-border-t ext-mt-1">
              <button
                onClick={() => {
                  onNewOrbit();
                  setIsOpen(false);
                }}
                className={`${itemStyles} ${
                  isDarkMode
                    ? 'ext-text-white/70 hover:ext-bg-white/[0.05]'
                    : 'ext-text-gray-800 hover:ext-bg-gray-50'
                } ext-transition-colors`}
              >
                <Plus className="ext-w-4 ext-h-4 ext-opacity-70" /> New Orbit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 