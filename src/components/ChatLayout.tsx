import { useState } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';

export const ChatLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    conversations,
    currentConversationId,
    isDarkMode,
    isLoading,
    createConversation,
    sendMessage,
    toggleDarkMode,
  } = useChatContext();

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId
  );

  return (
    <div className={`flex h-screen w-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <Sidebar
        isDarkMode={isDarkMode}
        onNewChat={createConversation}
        onToggleDarkMode={toggleDarkMode}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
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
