import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CometChatFrameContextValue {
  iframeDocument: Document | null;
  iframeWindow: Window | null;
  iframe: HTMLIFrameElement | null;
}

interface CometChatFrameProviderProps {
  children: ReactNode;
  iframeId: string;
}

const CometChatFrameContext = createContext<CometChatFrameContextValue>({
  iframeDocument: null,
  iframeWindow: null,
  iframe: null
});

export const useCometChatFrameContext = () => {
  const context = useContext(CometChatFrameContext);
  if (context === undefined) {
    throw new Error('useCometChatFrameContext must be used within a CometChatFrameProvider');
  }
  return context;
};

export const CometChatFrameProvider: React.FC<CometChatFrameProviderProps> = ({ children, iframeId }) => {
  const [iframeDocument, setIframeDocument] = useState<Document | null>(null);
  const [iframeWindow, setIframeWindow] = useState<Window | null>(null);
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let retryCount = 0;
    let mutationObserver: MutationObserver | null = null;
    const maxRetries = 10;
    const baseDelay = 100; // Start with 100ms
    const maxDelay = 5000; // Cap at 5 seconds

    const initializeIframe = (): boolean => {
      const iframeElement = document.getElementById(iframeId) as HTMLIFrameElement | null;

      if (!iframeElement || !iframeElement.contentWindow) {
        setIframe(null);
        setIframeWindow(null);
        setIframeDocument(null);
        return false;
      }

      try {
        const win = iframeElement.contentWindow;
        const doc = iframeElement.contentDocument || iframeElement.contentWindow.document;

        if (!doc) {
          return false;
        }

        setIframe(iframeElement);
        setIframeWindow(win);
        setIframeDocument(doc);

        // Stop observing once we successfully initialize
        if (mutationObserver) {
          mutationObserver.disconnect();
          mutationObserver = null;
        }

        return true;
      } catch (error) {
        // Handle cross-origin access errors
        console.warn('Failed to access iframe content:', error);
        return false;
      }
    };

    const scheduleRetry = () => {
      if (retryCount >= maxRetries) {
        console.warn(`Failed to initialize iframe after ${maxRetries} attempts`);
        return;
      }

      // Exponential backoff with jitter
      const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
      const jitter = Math.random() * 0.1 * delay; // Add up to 10% jitter
      const finalDelay = delay + jitter;

      timeoutId = setTimeout(() => {
        retryCount++;
        if (!initializeIframe()) {
          scheduleRetry();
        }
      }, finalDelay);
    };

    const setupMutationObserver = () => {
      // Use MutationObserver to watch for iframe addition to DOM
      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                if (element.id === iframeId || element.querySelector(`#${iframeId}`)) {
                  // Clear any pending retry
                  if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                  }
                  retryCount = 0;
                  initializeIframe();
                }
              }
            });
          }
        });
      });

      // Observe changes to the document body and its subtree
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    };

    // Initial check
    if (!initializeIframe()) {
      // Set up MutationObserver to watch for iframe appearance
      setupMutationObserver();
      // Also use exponential backoff as fallback
      scheduleRetry();
    }

    // Listen for load events on the iframe
    const handleIframeLoad = () => {
      // Clear any pending retry
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      retryCount = 0; // Reset retry count on successful load
      initializeIframe();
    };

    const iframeElement = document.getElementById(iframeId);
    if (iframeElement) {
      iframeElement.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (mutationObserver) {
        mutationObserver.disconnect();
      }
      if (iframeElement) {
        iframeElement.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [iframeId]);

  const contextValue: CometChatFrameContextValue = {
    iframeDocument,
    iframeWindow,
    iframe
  };

  return (
    <CometChatFrameContext.Provider value={contextValue}>
      {children}
    </CometChatFrameContext.Provider>
  );
};

export default CometChatFrameContext;
