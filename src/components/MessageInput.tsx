import { Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export const MessageInput = ({
  onSendMessage,
  isLoading,
  isDarkMode,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(
        textareaRef.current.scrollHeight,
        200
      ) + 'px';
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`p-4 border-t ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem... (Shift+Enter para nova linha)"
          disabled={isLoading}
          className={`flex-1 px-4 py-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? 'bg-gray-700 text-white placeholder-gray-400'
              : 'bg-gray-100 text-gray-900 placeholder-gray-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className={`p-2 rounded-lg transition-colors ${
            isLoading || !message.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-600'
          } ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
          title="Enviar mensagem (Enter)"
        >
          <Send size={20} />
        </button>
      </div>
      <p
        className={`text-xs mt-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        Shift + Enter para nova linha
      </p>
    </div>
  );
};
