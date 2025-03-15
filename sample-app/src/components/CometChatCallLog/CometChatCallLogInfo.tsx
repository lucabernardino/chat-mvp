import { useCallback, useEffect, useState } from "react";
import outgoingCallSuccess from "../../assets/outgoingCallSuccess.svg";
import callRejectedIcon from "../../assets/callRejectedIcon.svg";
import incomingCallIcon from "../../assets/incomingCallIcon.svg";
import incomingCallSuccessIcon from "../../assets/incomingCallSuccess.svg";
import missedCallIcon from "../../assets/missedCallIcon.svg";
import "../../styles/CometChatCallLog/CometChatCallLogInfo.css";
import { CalendarObject, CometChatDate, CometChatListItem, CometChatLocalize, CometChatUIKit, CometChatUIKitConstants, convertMinutesToHoursMinutesSeconds, getLocalizedString } from "@cometchat/chat-uikit-react";

export const CometChatCallDetailsInfo = (props: { call: any }) => {
    const { call } = props;
    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>(null);

    useEffect(
        () => {
            CometChatUIKit.getLoggedinUser().then(
                (user) => {
                    setLoggedInUser(user);
                }
            );
        },
        [setLoggedInUser]
    );
    function getDateFormat():CalendarObject{
        const defaultFormat = {
          yesterday: `DD MMM, hh:mm A`,
          otherDays: `DD MMM, hh:mm A`,
          today: `DD MMM, hh:mm A`
        };
    
        const finalFormat = {
          ...defaultFormat,
          ...CometChatLocalize.calendarObject    };
    
        return finalFormat;
      }
    const getListItemSubtitleView = useCallback((item: any): JSX.Element => {
        return (
            <div className="cometchat-call-log-info__subtitle">
                <CometChatDate
                    calendarObject={getDateFormat()}
                    timestamp={item?.getInitiatedAt()}
                ></CometChatDate>
            </div>
        );
    }, [])

    const getCallDuration = useCallback((item: any) => {
        try {
            if (item?.getTotalDurationInMinutes()) {
                return convertMinutesToHoursMinutesSeconds(item?.getTotalDurationInMinutes());
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }, []);

    const getListItemTailView = useCallback((item: any): JSX.Element => {
        return (
            <div className={getCallDuration(item) ? "cometchat-call-log-info__trailing-view" : "cometchat-call-log-info__trailing-view-disabled"}>
                {getCallDuration(item) ? getCallDuration(item) : '00:00'}
            </div>
        );
    }, [getCallDuration]);

    const getCallStatus = (call: CometChat.Call, loggedInUser: CometChat.User): string => {
        const isSentByMe = (call: any, loggedInUser: CometChat.User) => {
            const senderUid: string = call.initiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        }
        const callStatus: string = call.getStatus();
        const isSentByMeFlag: boolean = isSentByMe(call, loggedInUser!);
        switch (callStatus) {
            case CometChatUIKitConstants.calls.initiated: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString('calls_incoming_call');
                }
            }
            case CometChatUIKitConstants.calls.cancelled: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString("calls_missed_call");
                }
            }
            case CometChatUIKitConstants.calls.rejected: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString("calls_missed_call");
                }
            }
            case CometChatUIKitConstants.calls.busy: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString("calls_missed_call");
                }
            }
            case CometChatUIKitConstants.calls.ended: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString('calls_incoming_call');
                }
            }
            case CometChatUIKitConstants.calls.ongoing: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString('calls_incoming_call');
                }
            }
            case CometChatUIKitConstants.calls.unanswered: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString("calls_missed_call");
                }
            }
            default: {
                if (isSentByMeFlag) {
                    return getLocalizedString("calls_outgoing_call");
                } else {
                    return getLocalizedString('calls_incoming_call');
                }
            }
        }
    }

    function getAvatarUrlForCall(call: CometChat.Call) {
        const isSentByMe = (call: any, loggedInUser: CometChat.User) => {
            const senderUid: string = call.initiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        }
        const isSentByMeFlag: boolean = isSentByMe(call, loggedInUser!);
        const callStatus = getCallStatus(call, loggedInUser!);
        switch (callStatus) {
            case getLocalizedString("calls_outgoing_call"): {
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return incomingCallSuccessIcon;
                }
            }
            case getLocalizedString("calls_incoming_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return incomingCallSuccessIcon;
                }
            case getLocalizedString("calls_cancelled_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return missedCallIcon;
                }
            case getLocalizedString("calls_rejected_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return missedCallIcon;
                }
            case getLocalizedString("calls_busy_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return missedCallIcon;
                }
            case getLocalizedString("calls_ended_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return incomingCallSuccessIcon;
                }
            case getLocalizedString("calls_answered_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return incomingCallSuccessIcon;
                }
            case getLocalizedString("calls_unanswered_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return missedCallIcon;
                }
            case getLocalizedString("calls_missed_call"):
                if (isSentByMeFlag) {
                    return outgoingCallSuccess;
                } else {
                    return missedCallIcon;
                }
            default:
                return "";
        }
    }

    return (
        <div className="cometchat-call-log-info">
            <CometChatListItem
                title={getCallStatus(call, loggedInUser!)}
                avatarURL={getAvatarUrlForCall(call)}
                subtitleView={getListItemSubtitleView(call)}
                trailingView={getListItemTailView(call)}
            />
        </div>
    )
}