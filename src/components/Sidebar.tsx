import { Plus, ChevronUp, Code2, Database, Settings } from 'lucide-react';
import type { ChatMode } from '@/types/chat';

interface SidebarProps {
  isDarkMode: boolean;
  onNewChat: (mode: ChatMode) => void;
  onToggleDarkMode: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const modeConfig: Record<ChatMode, { icon: React.ReactNode; label: string }> = {
  chat: { icon: '💬', label: 'Chat' },
  'code-review': { icon: <Code2 size={16} />, label: 'Code Review' },
  'sql-review': { icon: <Database size={16} />, label: 'SQL Review' },
};

export const Sidebar = ({
  isDarkMode,
  onNewChat,
  onToggleDarkMode,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {

  return (
    <div
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
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
          <div className="space-y-1 pt-2 border-t border-gray-600">
            {(Object.keys(modeConfig) as ChatMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onNewChat(mode)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={modeConfig[mode].label}
              >
                <span className="text-base">{modeConfig[mode].icon}</span>
                {modeConfig[mode].label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conversations List - REMOVED */}

      {/* Footer - Settings */}
      <div
        className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-center`}
      >
        <button
          onClick={onToggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          title="Alternar tema"
        >
          <Settings size={18} />
        </button>
      </div>
    </div>
  );
};
