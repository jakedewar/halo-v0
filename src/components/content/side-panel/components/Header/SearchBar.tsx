import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  isDarkMode: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ isDarkMode }) => {
  return (
    <div className="ext-relative ext-mb-6">
      <Search className={`ext-absolute ext-left-3 ext-top-1/2 -ext-translate-y-1/2 ext-w-4 ext-h-4 ${isDarkMode ? 'ext-text-white/30' : 'ext-text-gray-400'}`} />
      <input
        type="text"
        placeholder="Search your thoughts..."
        className={`ext-w-full ext-pl-10 ext-pr-4 ext-py-2 ext-rounded-lg ${
          isDarkMode 
            ? 'ext-bg-white/[0.03] ext-border-white/[0.05] ext-text-white/70 ext-placeholder-white/30' 
            : 'ext-bg-gray-50 ext-border-gray-200 ext-text-gray-800 ext-placeholder-gray-400'
        } ext-border ext-text-sm focus:ext-outline-none focus:ext-border-indigo-500/30 ext-transition-colors`}
      />
    </div>
  );
};

export default SearchBar; 