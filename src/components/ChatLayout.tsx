import { useState } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';

export const ChatLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    conversations,
    currentConversationId,
    currentMode,
    isDarkMode,
    isLoading,
    createConversation,
    sendMessage,
    setMode,
  } = useChatContext();

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  return (
    <div className={`flex h-screen w-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Sidebar
        isDarkMode={isDarkMode}
        onNewChat={createConversation}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        currentMode={currentMode}
        onModeChange={setMode}
      />

      <ChatWindow
        conversation={currentConversation || null}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
        onSendMessage={sendMessage}
      />
    </div>
  );
};
