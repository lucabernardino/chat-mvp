import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CometChatToolCallArgumentBubbleProps {
  message?: CometChat.AIToolArgumentMessage; // You can replace this with the proper CometChat message type
}

const CometChatToolCallArgumentBubble: React.FC<CometChatToolCallArgumentBubbleProps> = ({ message }) => {

  const [toolCalls, setToolCalls] = useState(message?.getToolArgumentMessageData().getToolCalls() || [])


  useEffect(() => {
    setToolCalls(message?.getToolArgumentMessageData().getToolCalls() || [])
  }, [message])


  const formatArguments = (argumentsString: string) => {
    try {
      return JSON.stringify(JSON.parse(argumentsString), null, 2);
    } catch (e) {
      return argumentsString;
    }
  };
  return (
    <div className='cometchat'
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div className='cometchat-toolcall-argument-bubble'>
        {toolCalls.map((toolCall: any, index: number) => (
          <div key={toolCall.id || index} className='cometchat-toolcall-argument__item'>
            <div className='cometchat-toolcall-argument__name'>
              {toolCall?.displayName || 'Tool'}
            </div>
            {toolCall?.executionText && (
              <div className='cometchat-toolcall-argument__execution-text'>
                {toolCall?.executionText}
              </div>
            )}

            <div className='cometchat-toolcall-argument__arguments'>
              <div className='cometchat-toolcall-argument__label'>Arguments:</div>
              <SyntaxHighlighter
                language="json"
                style={oneDark}
                customStyle={{
                  margin: '8px 0',
                  borderRadius: '4px',
                }}
              >
                {toolCall.function?.arguments ?
                  formatArguments(toolCall.function.arguments) :
                  '{}'
                }
              </SyntaxHighlighter>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CometChatToolCallArgumentBubble };
