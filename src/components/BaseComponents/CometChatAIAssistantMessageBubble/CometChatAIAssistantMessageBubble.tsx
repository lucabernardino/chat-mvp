import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface CometChatAIAssistantMessageBubbleProps {
  message?: CometChat.AIAssistantMessage
}

const CometChatAIAssistantMessageBubble: React.FC<CometChatAIAssistantMessageBubbleProps> = ({ message }) => {
      const [theme, setTheme] = useState<any>(window.matchMedia('(prefers-color-scheme: dark)').matches ? oneDark : oneLight);

    useEffect(() => {
        const handleThemeChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? oneDark : oneLight);
        };
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? oneDark : oneLight);
        mediaQuery.addEventListener('change', handleThemeChange);
        return () => {
            mediaQuery.removeEventListener('change', handleThemeChange);
        };
    }, [message]);
  return (
    <div className='cometchat'
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        className='cometchat-ai-assistant-message-bubble'
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          children={message?.getAssistantMessageData()?.getText() || ''}
          components={{
            code({ node, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !className || !match;
              return !isInline && match ? (
                <SyntaxHighlighter
                            className="cometchat-ai-assistant-message-bubble__code-block"
                language={match[1]} PreTag="div" style={theme}>
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code 
                className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        />
      </div>
    </div>
  );


};

export { CometChatAIAssistantMessageBubble };