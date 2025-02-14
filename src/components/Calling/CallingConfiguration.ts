import { CometChatUIKitCalls } from "../../CometChatUIKit/CometChatCalls";
import { CalendarObject } from "../../utils/CalendarObject";
import { CallButtonConfiguration } from "./CallButtonConfiguration";

export class CallingConfiguration {
    public groupCallSettingsBuilder?: (message: CometChat.CustomMessage) => typeof CometChatUIKitCalls.CallSettingsBuilder;
    callButtonConfiguration?: CallButtonConfiguration = new CallButtonConfiguration({});
    callInitiatedDateTimeFormat?:CalendarObject;
    constructor(configuration?: CallingConfiguration) {
        this.groupCallSettingsBuilder = configuration?.groupCallSettingsBuilder;
        this.callButtonConfiguration = configuration?.callButtonConfiguration;
        this.callInitiatedDateTimeFormat = configuration?.callInitiatedDateTimeFormat;
    }
}
