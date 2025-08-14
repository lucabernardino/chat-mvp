import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CometChatToolCallResultBubbleProps {
  message?: CometChat.AIToolResultMessage; // You can replace this with the proper CometChat message type
}

const CometChatToolCallResultBubble: React.FC<CometChatToolCallResultBubbleProps> = ({ message }) => {
  // Extract tool result data from message
  const resultText = message?.getToolResultMessageData().getText() || '';
  
  if (!resultText) {
    return null;
  }

  // Try to parse the result as JSON for better formatting
  let formattedResult = resultText;
  let isJsonResult = false;
  
  try {
    const parsedResult = JSON.parse(resultText);
    formattedResult = JSON.stringify(parsedResult, null, 2);
    isJsonResult = true;
  } catch (e) {
    // If it's not valid JSON, use as plain text
    formattedResult = resultText;
  }
  return (
    <div className='cometchat'
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div className='cometchat-toolcall-result-bubble'>
        <div className='cometchat-toolcall-result__item'>
                  {/* <div >
              {message?.getData()?.displayName || 'Tool'}
            </div>
            {message?.getData()?.executionText && (
              <div >
                {message?.getData()?.executionText}
              </div>
            )} */}
          <div className='cometchat-toolcall-result__label'>Result:</div>
          <SyntaxHighlighter 
            language={isJsonResult ? "json" : "text"} 
            style={oneDark} 
            customStyle={{
              margin: '8px 0',
              borderRadius: '4px',
            }}
          >
            {formattedResult}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export { CometChatToolCallResultBubble };
