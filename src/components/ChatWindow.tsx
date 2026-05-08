import { useEffect, useRef } from 'react';
import type { Conversation } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  conversation: Conversation | null;
  isLoading: boolean;
  isDarkMode: boolean;
  onSendMessage: (message: string) => void;
}

export const ChatWindow = ({
  conversation,
  isLoading,
  isDarkMode,
  onSendMessage,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, isLoading]);

  if (!conversation) {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Comece uma nova conversa
          </h2>
          <p
            className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            Selecione uma conversa ou crie uma nova para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">👋</div>
              <p
                className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                Envie uma mensagem para começar
              </p>
            </div>
          </div>
        ) : (
          <>
            {conversation.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isDarkMode={isDarkMode}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 items-start">
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <MessageInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
