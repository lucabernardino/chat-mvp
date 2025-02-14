import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import outgoingCallSuccess from "../../assets/outgoingCallSuccess.svg";
import callRejectedIcon from "../../assets/callRejectedIcon.svg";
import incomingCallIcon from "../../assets/incomingCallIcon.svg";
import incomingCallSuccessIcon from "../../assets/incomingCallSuccess.svg";
import missedCallIcon from "../../assets/missedCallIcon.svg";
import "../../styles/CometChatCallLog/CometChatCallLogHistory.css";
import { CalendarObject, CometChatDate, CometChatList, CometChatListItem, CometChatLocalize, CometChatUIKit, CometChatUIKitCalls, CometChatUIKitConstants, States, convertMinutesToHoursMinutesSeconds, getLocalizedString } from "@cometchat/chat-uikit-react";

export const CometChatCallDetailsHistory = (props: { call: any }) => {
    const { call } = props;
    const [callList, setCallList] = useState<any[]>([]);
    const [callListState, setCallListState] = useState(States.loading);
    const requestBuilder = useRef<any>(null);
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

    useEffect(() => {
        if (loggedInUser) {
            requestBuilder.current = setRequestBuilder();
            getCallList?.();
        }
    }, [loggedInUser]);

    const setRequestBuilder = useCallback((): any => {
        try {
            let builder;
            let callUserId;
            if (call.getInitiator().getUid() === loggedInUser!.getUid()) {
                callUserId = call.getReceiver().getUid();
            } else {
                callUserId = call.getInitiator().getUid();
            }
            const authToken = loggedInUser!.getAuthToken() || "";
            builder = new CometChatUIKitCalls.CallLogRequestBuilder()
                .setLimit(30)
                .setCallCategory("call")
                .setAuthToken(authToken);

            if (callUserId) {
                builder = builder.setUid(callUserId);
            }

            return builder.build();
        } catch (e) {
            console.log(e);
        }
    }, [loggedInUser]);


    const fetchNextCallList = useCallback(async (): Promise<any[]> => {
        try {
            const calls = await requestBuilder?.current?.fetchNext();
            return calls;
        } catch (e) {
            throw new Error("Error while fetching call list");
        }
    }, [requestBuilder]);

    const getCallList = useCallback(async () => {
        try {
            const calls = await fetchNextCallList();
            if (calls && calls.length > 0) {
                setCallList((prevCallList) => {
                    return [...prevCallList, ...calls]
                })
                setCallListState(States.loaded);
            } else if (callList.length === 0) {
                setCallListState(States.empty);
            }
        } catch (e) {
            if (callList.length === 0) {
                setCallListState(States.error);
            }
        }
    }, [fetchNextCallList, setCallList, setCallListState, callList])
    
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
            <div className="cometchat-call-log-history__subtitle">
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
            <div className={getCallDuration(item) ? "cometchat-call-log-history__trailing-view" : "cometchat-call-log-history__trailing-view-disabled"}>
                {getCallDuration(item) ? getCallDuration(item) : '00:00'}
            </div>
        );
    }, [getCallDuration]);

    const getCallStatus = (call: CometChat.Call, loggedInUser: CometChat.User): string => {
        const isSentByMe = (call: any, loggedInUser: CometChat.User) => {
            const senderUid: string = call.callInitiator?.getUid();
            return !senderUid || senderUid === loggedInUser?.getUid();
        }
        const callStatus: string = call.getStatus();
        const isSentByMeFlag: boolean = isSentByMe(call, loggedInUser!);
        if (isSentByMeFlag) {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return getLocalizedString("calls_outgoing_call");
                case CometChatUIKitConstants.calls.cancelled:
                    return getLocalizedString("calls_cancelled_call");
                case CometChatUIKitConstants.calls.rejected:
                    return getLocalizedString("calls_rejected_call");
                case CometChatUIKitConstants.calls.busy:
                    return getLocalizedString("calls_missed_call");
                case CometChatUIKitConstants.calls.ended:
                    return getLocalizedString("calls_ended_call");
                case CometChatUIKitConstants.calls.ongoing:
                    return getLocalizedString("calls_answered_call");
                case CometChatUIKitConstants.calls.unanswered:
                    return getLocalizedString("calls_unanswered_call");
                default:
                    return getLocalizedString("calls_outgoing_call");
            }
        } else {
            switch (callStatus) {
                case CometChatUIKitConstants.calls.initiated:
                    return getLocalizedString("calls_incoming_call");
                case CometChatUIKitConstants.calls.ongoing:
                    return getLocalizedString("calls_answered_call");
                case CometChatUIKitConstants.calls.ended:
                    return getLocalizedString("calls_ended_call");
                case CometChatUIKitConstants.calls.unanswered:
                case CometChatUIKitConstants.calls.cancelled:
                    return getLocalizedString("calls_missed_call");
                case CometChatUIKitConstants.calls.busy:
                    return getLocalizedString("calls_busy_call");
                case CometChatUIKitConstants.calls.rejected:
                    return getLocalizedString("calls_rejected_call");
                default:
                    return getLocalizedString("calls_outgoing_call");
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
        if (isSentByMeFlag) {
            switch (callStatus) {
                case getLocalizedString("calls_outgoing_call"):
                    return outgoingCallSuccess;
                case getLocalizedString("calls_incoming_call"):
                    return outgoingCallSuccess;
                case getLocalizedString("calls_cancelled_call"):
                    return outgoingCallSuccess;
                case getLocalizedString("calls_rejected_call"):
                    return callRejectedIcon;
                case getLocalizedString("calls_busy_call"):
                    return missedCallIcon;
                case getLocalizedString("calls_ended_call"):
                    return outgoingCallSuccess;
                case getLocalizedString("calls_answered_call"):
                    return outgoingCallSuccess;
                case getLocalizedString("calls_unanswered_call"):
                    return missedCallIcon;
                case getLocalizedString("calls_missed_call"):
                    return missedCallIcon;
                default:
                    return "";
            }
        } else {
            switch (callStatus) {
                case getLocalizedString("calls_outgoing_call"):
                    return incomingCallSuccessIcon;
                case getLocalizedString("calls_incoming_call"):
                    return incomingCallSuccessIcon;
                case getLocalizedString("calls_cancelled_call"):
                    return incomingCallIcon;
                case getLocalizedString("calls_rejected_call"):
                    return callRejectedIcon;
                case getLocalizedString("calls_busy_call"):
                    return missedCallIcon;
                case getLocalizedString("calls_ended_call"):
                    return incomingCallSuccessIcon;
                case getLocalizedString("calls_answered_call"):
                    return incomingCallSuccessIcon;
                case getLocalizedString("calls_unanswered_call"):
                    return missedCallIcon;
                case getLocalizedString("calls_missed_call"):
                    return missedCallIcon;
                default:
                    return "";
            }
        }
    }

    const getListItem = useMemo(() => {
        return function (item: any, index: number): any {
            return (
                <>
                    <CometChatListItem
                        title={getCallStatus(item, loggedInUser!)}
                        avatarURL={getAvatarUrlForCall(item)}
                        subtitleView={getListItemSubtitleView(item)}
                        trailingView={getListItemTailView(item)}
                    />
                </>
            )
        };
    }, [getAvatarUrlForCall, getListItemSubtitleView, getListItemTailView, loggedInUser]);

    return (
        <div className="cometchat-call-log-history">
            <CometChatList
                hideSearch={true}
                list={callList}
                onScrolledToBottom={getCallList}
                listItemKey="getSessionID"
                itemView={getListItem}
                state={callListState}
                showSectionHeader={false}
            />
        </div>
    )
}