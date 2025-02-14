import { CalendarObject } from "./CalendarObject";

/**
 * Represents the localization settings for an application or component.
 */
export interface LocalizationSettings {
    /** The language code (e.g., 'en', 'fr') for the current localization. */
    language?: string;
    /** Object containing key-value pairs for translations in the current language. */
    translationsForLanguage?: { [key: string]: any };
    /** Whether to disable automatic language detection. */
    disableAutoDetection?: boolean;
    /** The fallback language code to use if the primary language is not available. */
    fallbackLanguage?: string;
    /** Whether to disable localization for date and time values. */
    disableDateTimeLocalization?: boolean;
    /** The timezone for date and time formatting. */
    timezone?: string;
    /** Custom calendar formatting defined using a CalendarObject. */
    calendarObject?: CalendarObject;
    /** Function to handle missing translation keys. */
    missingKeyHandler?: (key: string) => void;
}
