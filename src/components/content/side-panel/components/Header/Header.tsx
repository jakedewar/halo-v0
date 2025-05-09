import React from 'react';
import { Circle } from 'lucide-react';
import { X } from 'lucide-react';

interface HeaderProps {
  onClose: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onClose, isDarkMode }) => {
  return (
    <div className="ext-flex ext-justify-between ext-items-center ext-mb-6">
      <div className="ext-flex ext-items-center ext-gap-2">
        <Circle className={`ext-w-5 ext-h-5 ${isDarkMode ? 'ext-text-indigo-300' : 'ext-text-indigo-500'}`} strokeWidth={2.5} />
        <h2 className={`ext-text-lg ext-font-medium ${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'}`}>
          Halo
        </h2>
      </div>
      <button
        onClick={onClose}
        className={`ext-p-1 ext-rounded-full ${isDarkMode ? 'hover:ext-bg-white/10' : 'hover:ext-bg-gray-100'} ext-transition-colors`}
      >
        <X className={`ext-w-5 ext-h-5 ${isDarkMode ? 'ext-text-white/50' : 'ext-text-gray-400'}`} />
      </button>
    </div>
  );
};

export default Header; 