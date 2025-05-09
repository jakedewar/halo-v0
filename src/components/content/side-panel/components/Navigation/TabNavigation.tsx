import React from 'react';

interface TabNavigationProps {
  activeTab: 'notes' | 'tasks';
  onTabChange: (tab: 'notes' | 'tasks') => void;
  isDarkMode: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange,
  isDarkMode 
}) => {
  return (
    <div className="ext-flex ext-gap-2 ext-mb-6">
      <button
        onClick={() => onTabChange('notes')}
        className={`ext-flex-1 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ext-transition-colors ${
          activeTab === 'notes'
            ? 'ext-bg-indigo-500 ext-text-white'
            : isDarkMode 
              ? 'ext-text-white/50 hover:ext-text-white' 
              : 'ext-text-gray-500 hover:ext-text-gray-900'
        }`}
      >
        Notes
      </button>
      <button
        onClick={() => onTabChange('tasks')}
        className={`ext-flex-1 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ext-transition-colors ${
          activeTab === 'tasks'
            ? 'ext-bg-indigo-500 ext-text-white'
            : isDarkMode 
              ? 'ext-text-white/50 hover:ext-text-white' 
              : 'ext-text-gray-500 hover:ext-text-gray-900'
        }`}
      >
        Tasks
      </button>
    </div>
  );
};

export default TabNavigation; 