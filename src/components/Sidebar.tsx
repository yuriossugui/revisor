import { Plus, ChevronUp } from 'lucide-react';
import type { ChatMode } from '@/types/chat';
import { ModeSelector } from './ModeSelector';

interface SidebarProps {
  isDarkMode: boolean;
  onNewChat: (mode: ChatMode) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export const Sidebar = ({
  isDarkMode,
  onNewChat,
  isCollapsed,
  onToggleCollapse,
  currentMode,
  onModeChange,
}: SidebarProps) => {

  return (
    <div
      className={`${
        isCollapsed ? 'w-12' : 'w-48'
      } transition-all duration-300 ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      } border-r flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Revisor
          </h1>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded hover:bg-gray-700 transition-colors ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          title={isCollapsed ? 'Expandir' : 'Colapsar'}
        >
          <ChevronUp size={18} className={`transition-transform ${isCollapsed ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* New Chat Buttons */}
      <div className={`p-3 space-y-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => onNewChat('chat')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          }`}
          title="Nova conversa"
        >
          <Plus size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Nova chat</span>}
        </button>

        {!isCollapsed && (
          <ModeSelector
            currentMode={currentMode}
            isDarkMode={isDarkMode}
            isCollapsed={isCollapsed}
            onModeChange={onModeChange}
          />
        )}
      </div>

      {/* Conversations List - REMOVED */}
    </div>
  );
};
