/**
 * This class is used to define the properties of a search filter option, 
 * including its unique identifier, display name, and an optional icon URL.
 */
export class CometChatSearchFilterOption {

    /**
     * A unique identifier for the filter option.
     * Example: 'photos', 'groups', etc.
     */
    id: string;

    /**
     * An optional display name for the filter option.
     * Example: 'Photos', 'Groups', etc.
     */
    name?: string;

    /**
     * An optional URL or path to the icon representing the filter option.
     * Example: 'path/to/icon.png'.
     */
    iconURL?: string;

    /**
     * Creates an instance of CometChatSearchFilterOption.
     * 
     * @param options - An object containing the properties of the filter option.
     * @param options.id - A unique identifier for the filter option.
     * @param options.name - An optional display name for the filter option.
     * @param options.iconURL - An optional URL or path to the icon for the filter option.
     */
    constructor(options: {
        id: string;
        name?: string;
        iconURL?: string;
    }) {
        this.id = options.id;
        this.name = options.name;
        this.iconURL = options.iconURL;
    }
}