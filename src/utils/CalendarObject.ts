/**
 * Represents the configuration for a calendar object.
 */
export class CalendarObject {
        /** Custom formatting for dates that fall on the same day. */
        today?: string;
        /** Custom formatting for dates that fall on the previous day. */
        yesterday?: string;
        /** Custom formatting for dates within the last week. */
        lastWeek?: string;
        /** Custom formatting for dates that do not fit other categories. */
        otherDays?: string;
        /**
         * Relative time formatting for specific time units.
         */
        relativeTime?: {
            /** Formatting for minutes (singular). */
            minute?: string;
            /** Formatting for minutes (plural). */
            minutes?: string;
            /** Formatting for hours (singular). */
            hour?: string;
            /** Formatting for hours (plural). */
            hours?: string;
        };

        constructor(calendaObject:CalendarObject){
            this.today = calendaObject.today;
            this.yesterday = calendaObject.yesterday;
            this.lastWeek = calendaObject.lastWeek;
            this.otherDays = calendaObject.otherDays;
            this.relativeTime = calendaObject.relativeTime;
        }
}