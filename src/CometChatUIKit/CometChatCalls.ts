/**
 * A variable to hold the CometChat UIKit Calls instance.
 * 
 * This variable is initially set to `null` and can be assigned to an instance
 * of CometChat UIKit Calls or any relevant object as needed.
 * 
 * @type {any}
 */
var callsSDK: any = null;
try{
    callsSDK = require('@cometchat/calls-sdk-javascript');
}catch(e){
    console.warn("⚠️ Calls SDK is not installed. If you want to enable call functionality, install it using:\n\n" + "npm install @cometchat/calls-sdk-javascript\n");
}

export var CometChatUIKitCalls: any = callsSDK?.CometChatCalls;
