import type { Message } from '@/types/chat';
import { MarkdownRenderer } from '@/lib/markdown-renderer';

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
}

export const MessageBubble = ({ message, isDarkMode }: MessageBubbleProps) => {
  const isUser = message.role === 'user';

  const renderContent = (content: string) => {
    return (
      <MarkdownRenderer
        content={content}
        isDarkMode={isDarkMode}
        isUserMessage={isUser}
      />
    );
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
          isUser
            ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
            : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`
        }`}
      >
        {renderContent(message.content)}
        <span
          className={`text-xs mt-2 block ${
            isUser
              ? 'text-blue-100'
              : isDarkMode
                ? 'text-gray-400'
                : 'text-gray-500'
          }`}
        >
          {message.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
};
