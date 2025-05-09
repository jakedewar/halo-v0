import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date | null) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export function DatePicker({
  selectedDate,
  onSelect,
  onClose,
  isDarkMode,
}: DatePickerProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day;
    return new Date(today.setDate(diff));
  });

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isCurrentWeek = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfToday = new Date(today);
    startOfToday.setDate(today.getDate());
    return date.getTime() === startOfToday.getTime();
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  return (
    <div 
      className={`ext-absolute ext-left-0 ext-bottom-[calc(100%+0.75rem)] ext-w-[280px] ext-p-4 ext-rounded-[20px] ${
        isDarkMode 
          ? 'ext-bg-[#1A1A1A]' 
          : 'ext-bg-white ext-shadow-lg'
      } ext-z-50`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Navigation */}
      <div className="ext-flex ext-items-center ext-justify-between ext-mb-4">
        <button
          type="button"
          onClick={handlePrevWeek}
          className={`ext-p-2 ext-rounded-full ${
            isDarkMode 
              ? 'ext-text-white/50 hover:ext-text-white' 
              : 'ext-text-gray-400 hover:ext-text-gray-600'
          }`}
        >
          <ChevronLeft className="ext-w-5 ext-h-5" />
        </button>
        <span className={`ext-text-sm ${
          isDarkMode ? 'ext-text-white/70' : 'ext-text-gray-600'
        }`}>
          {currentWeekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={handleNextWeek}
          className={`ext-p-2 ext-rounded-full ${
            isDarkMode 
              ? 'ext-text-white/50 hover:ext-text-white' 
              : 'ext-text-gray-400 hover:ext-text-gray-600'
          }`}
        >
          <ChevronRight className="ext-w-5 ext-h-5" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="ext-grid ext-grid-cols-7 ext-gap-2 ext-mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className={`ext-text-center ext-text-sm ${
              isDarkMode ? 'ext-text-white/40' : 'ext-text-gray-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="ext-grid ext-grid-cols-7 ext-gap-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date(currentWeekStart);
          date.setDate(currentWeekStart.getDate() + i);
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isPast = isDateInPast(date);
          const isCurrent = isCurrentWeek(date);

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => {
                if (isSelected) {
                  onSelect(null);
                } else {
                  onSelect(date);
                }
                onClose();
              }}
              className={`
                ext-p-2 ext-rounded-full ext-text-sm ext-transition-colors
                ${isPast 
                  ? isDarkMode 
                    ? 'ext-text-white/30 ext-cursor-not-allowed' 
                    : 'ext-text-gray-300 ext-cursor-not-allowed'
                  : isSelected
                    ? 'ext-bg-[#6366F1] ext-text-white'
                    : isCurrent
                      ? isDarkMode
                        ? 'ext-text-[#6366F1] hover:ext-bg-white/[0.03]'
                        : 'ext-text-[#6366F1] hover:ext-bg-gray-50'
                      : isDarkMode
                        ? 'ext-text-white/70 hover:ext-bg-white/[0.03]'
                        : 'ext-text-gray-600 hover:ext-bg-gray-50'
                }
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Clear Date Button */}
      <button
        type="button"
        onClick={() => {
          onSelect(null);
          onClose();
        }}
        className={`ext-w-full ext-mt-4 ext-px-4 ext-py-2 ext-text-sm ext-rounded-full ${
          isDarkMode
            ? 'ext-text-white/50 hover:ext-text-white hover:ext-bg-white/[0.03]'
            : 'ext-text-gray-400 hover:ext-text-gray-600 hover:ext-bg-gray-50'
        }`}
      >
        Clear Date
      </button>
    </div>
  );
} 