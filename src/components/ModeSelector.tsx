import type { ChatMode } from '@/types/chat';
import { modeConfig } from '@/lib/prompts';

interface ModeSelectorProps {
  currentMode: ChatMode;
  isDarkMode: boolean;
  isCollapsed: boolean;
  onModeChange: (mode: ChatMode) => void;
}

const modes: ChatMode[] = ['chat', 'code-review', 'sql-review'];

export const ModeSelector = ({
  currentMode,
  isDarkMode,
  isCollapsed,
  onModeChange,
}: ModeSelectorProps) => {
  return (
    <div className="space-y-1 pt-2 border-t border-gray-600">
      {modes.map((mode) => {
        const isActive = currentMode === mode;

        return (
          <button
            key={mode}
            onClick={() => onModeChange(mode)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-all duration-200 will-change-transform ${
              isActive
                ? isDarkMode
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/50 scale-105'
                  : 'bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/50 scale-105'
                : isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
            }`}
            title={modeConfig[mode].label}
          >
            <span className="text-base shrink-0">{modeConfig[mode].icon}</span>
            {!isCollapsed && <span>{modeConfig[mode].label}</span>}
          </button>
        );
      })}
    </div>
  );
};

