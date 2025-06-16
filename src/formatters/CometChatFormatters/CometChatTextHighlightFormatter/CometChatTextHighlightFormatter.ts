import { CometChatTextFormatter } from "../CometChatTextFormatter";

/**
 * Class that handles the text highlighting for specific patterns.
 * CometChatTextHighlightFormatter is a child class of CometChatTextFormatter.
 * It extends the functionality of text formatting to specifically highlight text patterns.
 * It can be used to highlight specific words or patterns.
 */
export class CometChatTextHighlightFormatter extends CometChatTextFormatter {

  constructor(pattern?: string | RegExp) {
    super();

    if (pattern) {
      const regexPattern = typeof pattern === 'string'
        ? new RegExp(`(${pattern})`, 'gi')
        : pattern;

      this.setRegexPatterns([regexPattern]);
    }

    this.cssClassMapping = ["cometchat-text-highlight"];
  }

  /**
   * Sets the text pattern to highlight
   * @param pattern The text pattern (string or RegExp) to highlight
   */
  setText(pattern: string | RegExp): void {
    const regexPattern = typeof pattern === 'string'
      ? new RegExp(`(${pattern})`, 'gi')
      : pattern;

    this.setRegexPatterns([regexPattern]);
  }
  /**
   * Generates a unique ID for the highlight span
   */
  getUniqueId(){
    return `HIGHLIGHT_${Math.random().toString(36).substr(2, 9)}`
  }


  /**
   * Format the text by applying highlighting to matches of the regex pattern
   * @param inputText The text to format
   * @param params Optional parameters
   * @returns The formatted text with highlights
   */
  getFormattedText(inputText: string | null): string | void {
    if (!inputText) {
      return;
    }

    // If input already contains highlighting spans, don't process it again
    const highlightSpanRegex = /<span[^>]*class="[^"]*cometchat-text-highlight[^"]*"[^>]*data-highlight="[^"]*"[^>]*>/;
    if (highlightSpanRegex.test(inputText)) {
      return inputText;
    }

    const highlightClass = this.cssClassMapping[0];
    let result = inputText;
    for (let i = 0; i < this.regexPatterns.length; i++) {
      let regexPattern = this.regexPatterns[i];

      const urlSpanRegex = /(<span[^>]*class="[^"]*cometchat-url[^"]*"[^>]*>)(.*?)(<\/span>)/gi;
      result = result.replace(urlSpanRegex, (match, openTag, content, closeTag) => {
        const highlightedContent = content.replace(regexPattern, (match:string) => {
          const uniqueId = this.getUniqueId();
          return `<span class="${highlightClass}" data-highlight="${uniqueId}" data-processed="true">${match}</span>`;
        });
        
        return openTag + highlightedContent + closeTag;
      });

      // Split text by mention spans to avoid processing inside them
      const mentionSpanRegex = /(<span[^>]*class="[^"]*mentions[^"]*"[^>]*>.*?<\/span>)/gi;
      const parts = result.split(mentionSpanRegex);

      result = parts.map((part, index) => {
        // If this part is a mention span (odd indices after split), return as-is
        if (index % 2 === 1) {
          return part;
        }

        // Otherwise, apply highlighting to this part
        return part.replace(regexPattern, (match) => {
          const urlSpanCheck = /<span[^>]*class="[^"]*cometchat-url[^"]*"[^>]*>/gi;
          if (urlSpanCheck.test(part)) {
            return match;
          }
          // Use a unique marker to prevent recursive matching
          const uniqueId = this.getUniqueId();
          return `<span class="${highlightClass}" data-highlight="${uniqueId}" data-processed="true">${match}</span>`;
        });
      }).join('');
    }

    return result;
  }
}