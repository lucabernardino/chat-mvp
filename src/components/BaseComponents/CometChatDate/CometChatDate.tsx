import { useCallback } from "react";
import { CometChatLocalize } from "../../../resources/CometChatLocalize/cometchat-localize";
import { CalendarObject } from "../../../utils/CalendarObject";
interface DateProps {
    /* Timestamp of the time to be displayed in the component. */
    timestamp: number;
    /* configuration for date customization */
    calendarObject:CalendarObject
}

/**
 * CometChatDate is a generic component used to display dates in the required format.
 * It accepts a timestamp of the time to be displayed and the pattern in which the time should be displayed.
 * It also accepts the customDateString prop, whose value is used as is for displaying the time.
 */
const CometChatDate = (props: DateProps) => {
    const {
        timestamp,
        calendarObject
    } = props;
    /**
    * Retrieves the converted timestamp value based on the provided date pattern.
   */
    const getFormattedDate = useCallback(()=>{
            return CometChatLocalize.formatDate(timestamp,calendarObject)
        
    },[calendarObject,timestamp])

    return (
        <div className="cometchat">
            <div className="cometchat-date">
                {getFormattedDate()}
            </div>
        </div>
    )
}

export { CometChatDate };
