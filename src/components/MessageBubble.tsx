import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
  isDarkMode: boolean;
}

export const MessageBubble = ({ message, isDarkMode }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  // Detecta blocos de código
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  codeBlockRegex.test(message.content);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (content: string) => {
    // Se contém código, renderiza com suporte
    if (content.includes('```')) {
      return (
        <div className="space-y-2">
          {content.split(/```/g).map((block, i) => {
            if (i % 2 === 0) {
              // Texto normal
              return block && <p key={i} className="whitespace-pre-wrap">{block}</p>;
            } else {
              // Bloco de código
              const lines = block.split('\n');
              const lang = lines[0] || 'text';
              const code = lines.slice(1).join('\n').trim();

              return (
                <div
                  key={i}
                  className={`relative rounded-lg overflow-hidden ${
                    isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between px-4 py-2 ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}
                  >
                    <span className="text-xs font-mono text-gray-500">{lang}</span>
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copiar código"
                    >
                      {copied ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} className="text-gray-400" />
                      )}
                    </button>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                      {code}
                    </code>
                  </pre>
                </div>
              );
            }
          })}
        </div>
      );
    }

    return <p className="whitespace-pre-wrap">{content}</p>;
  };

  return (
    <div
      className={`flex gap-3 animate-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
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
