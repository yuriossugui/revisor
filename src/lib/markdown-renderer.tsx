import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  isDarkMode: boolean;
  isUserMessage?: boolean;
}

export const MarkdownRenderer = ({ 
  content, 
  isDarkMode,
  isUserMessage = false
}: MarkdownRendererProps) => {
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCodeBlock(code);
      setTimeout(() => setCopiedCodeBlock(null), 2000);
    });
  };

  const shouldShowCopyButton = (lang: string): boolean => {
    const copiableLangs = ['sql', 'javascript', 'typescript', 'jsx', 'tsx', 'html', 'css', 'json', 'python', 'bash', 'shell', 'sh', 'yaml', 'yml', 'xml', 'java', 'c', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin'];
    return copiableLangs.includes(lang.toLowerCase());
  };
  const components = {
    h1: ({ children }: { children: ReactNode }) => (
      <h1 className={`text-2xl font-bold mt-4 mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {children}
      </h1>
    ),
    h2: ({ children }: { children: ReactNode }) => (
      <h2 className={`text-xl font-bold mt-3 mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {children}
      </h2>
    ),
    h3: ({ children }: { children: ReactNode }) => (
      <h3 className={`text-lg font-bold mt-2 mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </h3>
    ),
    h4: ({ children }: { children: ReactNode }) => (
      <h4 className={`text-base font-bold mt-2 mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </h4>
    ),
    h5: ({ children }: { children: ReactNode }) => (
      <h5 className={`text-sm font-bold mt-1 mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {children}
      </h5>
    ),
    h6: ({ children }: { children: ReactNode }) => (
      <h6 className={`text-xs font-bold mt-1 mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {children}
      </h6>
    ),
    p: ({ children }: { children: ReactNode }) => (
      <p className={`mb-2 leading-relaxed text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {children}
      </p>
    ),
    strong: ({ children }: { children: ReactNode }) => (
      <strong className={`font-bold ${isDarkMode ? 'text-gray-50' : 'text-gray-950'}`}>
        {children}
      </strong>
    ),
    em: ({ children }: { children: ReactNode }) => (
      <em className={`italic ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {children}
      </em>
    ),
    ul: ({ children }: { children: ReactNode }) => (
      <ul className={`list-disc list-inside mb-2 space-y-1 text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {children}
      </ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
      <ol className={`list-decimal list-inside mb-2 space-y-1 text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {children}
      </ol>
    ),
    li: ({ children }: { children: ReactNode }) => (
      <li className="ml-2">
        {children}
      </li>
    ),
    a: ({ href, children }: { href: string; children: ReactNode }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`font-medium underline ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
      >
        {children}
      </a>
    ),
    code: ({ 
      inline,
      className,
      children
    }: {
      inline?: boolean;
      className?: string;
      children: ReactNode;
    }) => {
      if (inline) {
        return (
          <code className={`px-1.5 py-0.5 rounded font-mono text-sm ${
            isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-900'
          }`}>
            {children}
          </code>
        );
      }

      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : 'text';
      const code = String(children).replace(/\n$/, '');
      const isCopied = copiedCodeBlock === code;

      if (isUserMessage) {
        return (
          <div className={`relative rounded-lg overflow-hidden mb-2 ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
          }`}>
            <div className={`flex items-center px-4 py-3 ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <span className={`text-xs font-mono font-semibold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {lang}
              </span>
            </div>
            <pre className={`p-4 overflow-x-auto ${
              isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
            }`}>
              <code className={`font-mono text-sm leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-800'
              }`}>
                {code}
              </code>
            </pre>
          </div>
        );
      }

      return (
        <div className={`relative rounded-lg overflow-hidden mb-2 group ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
          <div className={`code-block-header flex items-center justify-between px-4 py-3 gap-2 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <span className={`lang-label text-xs font-mono font-semibold ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {lang}
            </span>
            {shouldShowCopyButton(lang) && (
              <button
                onClick={() => handleCopyCode(code)}
                className={`code-copy-btn ${isCopied ? 'copied' : ''} px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                  isCopied 
                    ? isDarkMode 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-green-200 text-green-900'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
                title={isCopied ? 'Copiado!' : 'Copiar código'}
                aria-label="Copiar código"
              >
                {isCopied ? (
                  <span className="flex items-center gap-1">
                    <span>✓</span>
                    <span>Copiado!</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span>📋</span>
                    <span>Copiar</span>
                  </span>
                )}
              </button>
            )}
          </div>
          <pre className={`p-4 overflow-x-auto ${
            isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
          }`}>
            <code className={`font-mono text-sm leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>
              {code}
            </code>
          </pre>
        </div>
      );
    },
    blockquote: ({ children }: { children: ReactNode }) => (
      <blockquote className={`border-l-4 pl-4 py-2 mb-2 ${
        isDarkMode 
          ? 'border-gray-600 text-gray-300 bg-gray-800 bg-opacity-50' 
          : 'border-gray-400 text-gray-700 bg-gray-100'
      }`}>
        {children}
      </blockquote>
    ),
    hr: () => (
      <hr className={`my-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`} />
    ),
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown 
        rehypePlugins={[rehypeSanitize]}
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
