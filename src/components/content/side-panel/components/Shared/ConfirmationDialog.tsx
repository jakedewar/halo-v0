import { AlertCircle } from 'lucide-react';

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDarkMode?: boolean;
  isDestructive?: boolean;
}

export function ConfirmationDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDarkMode = false,
  isDestructive = false
}: ConfirmationDialogProps) {
  return (
    <div className="ext-fixed ext-inset-0 ext-bg-black/50 ext-backdrop-blur-sm ext-z-50 ext-flex ext-items-center ext-justify-center">
      <div
        className={`ext-w-[400px] ext-p-6 ext-rounded-lg ext-border ${
          isDarkMode ? 'ext-bg-[#030303] ext-border-white/[0.05] ext-text-white/70' : 'ext-bg-white ext-border-gray-200 ext-text-gray-800'
        }`}
      >
        <div className="ext-flex ext-items-center ext-gap-3 ext-mb-4">
          <AlertCircle
            className={`ext-w-5 ext-h-5 ${
              isDestructive
                ? isDarkMode
                  ? 'ext-text-red-400'
                  : 'ext-text-red-500'
                : isDarkMode
                ? 'ext-text-blue-400'
                : 'ext-text-blue-500'
            }`}
          />
          <h3 className={`ext-text-lg ext-font-medium ${isDarkMode ? 'ext-text-white' : 'ext-text-gray-900'}`}>
            {title}
          </h3>
        </div>

        <p className="ext-mb-6">{message}</p>

        <div className="ext-flex ext-gap-3 ext-justify-end">
          <button
            onClick={onCancel}
            className={`ext-px-4 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ${
              isDarkMode
                ? 'ext-text-white/70 hover:ext-text-white ext-bg-white/[0.05] hover:ext-bg-white/[0.1]'
                : 'ext-text-gray-600 hover:ext-text-gray-900 ext-bg-gray-100 hover:ext-bg-gray-200'
            } ext-transition-colors`}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`ext-px-4 ext-py-2 ext-rounded-lg ext-text-sm ext-font-medium ext-text-white ext-transition-colors ${
              isDestructive
                ? 'ext-bg-red-500 hover:ext-bg-red-600'
                : 'ext-bg-blue-500 hover:ext-bg-blue-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
} 