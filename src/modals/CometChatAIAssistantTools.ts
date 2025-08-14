/**
 * Type definition for toolkit action functions
 * Each function can return any value or a Promise for async operations
 */
type CometChatAIAssistantToolsFunction = (args: any) => void;

/**
 * Interface for the toolkit actions map
 * Key: string (function name)
 * Value: CometChatAIAssistantToolsFunction
 */
interface ICometChatAIAssistantToolsMap {
  [functionName: string]: CometChatAIAssistantToolsFunction;
}

/**
 * CometChatAIAssistantTools class for managing action functions
 * 
 * Usage:
 * ```typescript
 * const toolkit = new CometChatAIAssistantTools({
 *   // Weather related functions
 *   getCurrentWeather: (params: {location: string}) => {
 *     // Implementation for getting current weather
 *     fetch(`/api/weather?location=${params.location}`);
 *   },
 * });
 * 
 * ```
 */
class CometChatAIAssistantTools {
  private actionsMap: ICometChatAIAssistantToolsMap;
  
  [functionName: string]: any;
  constructor(actions: ICometChatAIAssistantToolsMap) {
    this.actionsMap = actions;
    
    // Make functions directly accessible as properties
    Object.keys(actions).forEach(functionName => {
      this[functionName] = actions[functionName];
    });
  }

  /**
   * Get the implementation of a specific action
   * 
   * @param functionName - Name of the function
   * @returns The function implementation or undefined if not found
   */
  getAction(functionName: string): CometChatAIAssistantToolsFunction | undefined {
    return this.actionsMap[functionName];
  }


  /**
   * Get a copy of all actions
   * 
   * @returns A copy of the actions map
   */
  getActions(): ICometChatAIAssistantToolsMap {
    return { ...this.actionsMap };
  }
}

export { CometChatAIAssistantTools, type ICometChatAIAssistantToolsMap, type CometChatAIAssistantToolsFunction };
