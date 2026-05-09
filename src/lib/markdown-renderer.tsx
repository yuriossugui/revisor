import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import type { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  isDarkMode: boolean;
  onCopyCode?: (code: string) => void;
  copied?: boolean;
}

export const MarkdownRenderer = ({ 
  content, 
  isDarkMode,
  onCopyCode,
  copied 
}: MarkdownRendererProps) => {
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
      <p className={`mb-2 leading-relaxed ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
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
      <ul className={`list-disc list-inside mb-2 space-y-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
        {children}
      </ul>
    ),
    ol: ({ children }: { children: ReactNode }) => (
      <ol className={`list-decimal list-inside mb-2 space-y-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
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
    code: ({ inline, children, className }: { inline?: boolean; children: ReactNode; className?: string }) => {
      if (inline) {
        return (
          <code className={`px-1.5 py-0.5 rounded font-mono text-sm ${
            isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-900'
          }`}>
            {children}
          </code>
        );
      }
      return <code>{children}</code>;
    },
    pre: ({ children }: { children: ReactNode }) => (
      <pre className={`rounded-lg overflow-x-auto mb-2 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        {children}
      </pre>
    ),
    codeblock: ({ 
      node,
      inline,
      className,
      children,
      ...props
    }: {
      node?: any;
      inline?: boolean;
      className?: string;
      children: ReactNode;
    } & Record<string, any>) => {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : 'text';
      const code = String(children).replace(/\n$/, '');

      return (
        <div className={`relative rounded-lg overflow-hidden mb-2 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
        }`}>
          <div className={`flex items-center justify-between px-4 py-2 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <span className="text-xs font-mono text-gray-500">{lang}</span>
            {onCopyCode && (
              <button
                onClick={() => onCopyCode(code)}
                className="p-1 hover:bg-gray-700 rounded transition-colors"
                title="Copiar código"
              >
                <span className={`text-sm ${copied ? 'text-green-500' : 'text-gray-400'}`}>
                  {copied ? '✓' : '📋'}
                </span>
              </button>
            )}
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className={`font-mono text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
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
