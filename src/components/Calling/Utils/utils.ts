import {getLocalizedString} from "../../../resources/CometChatLocalize/cometchat-localize";
import { CometChatUIKitConstants } from "../../../constants/CometChatUIKitConstants";

export function isSentByMe(call: CometChat.Call | any, loggedInUser: CometChat.User) {
  let senderUid:string ="";
  try {
    senderUid = (call.getCallInitiator && call.getCallInitiator()?.getUid()) || call?.getInitiator()?.getUid();
  } catch (error) {
    console.error(error)
  }
  return !senderUid || senderUid === loggedInUser?.getUid();
}


export function isMissedCall(
  call: CometChat.Call,
  loggedInUser: CometChat.User
) {
  const callStatus = call.getStatus();
  const sentByMe = isSentByMe(call, loggedInUser);

  if (sentByMe) {
    return false;
  }

  const missedStatuses = [
    CometChatUIKitConstants.calls.unanswered,
    CometChatUIKitConstants.calls.cancelled,
    CometChatUIKitConstants.calls.busy,
    CometChatUIKitConstants.calls.rejected,
  ];

  // If the user didn't send the call and the status matches one of the missed statuses, it's a missed call
  return !sentByMe && missedStatuses.includes(callStatus);
}

export function verifyCallUser(call: any, loggedInUser: CometChat.User) {
  if (call.getInitiator().getUid() === loggedInUser.getUid()) {
    return call.getReceiver();
  } else {
    return call.getInitiator();
  }
}



export function convertMinutesToHoursMinutesSeconds(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  const seconds = Math.floor((minutes - Math.floor(minutes)) * 60);

  let hoursString = "";
  let minutesString = "";
  let secondsString = "";

  if (hours > 0) {
    hoursString = `${hours}h`;
  }

  if (remainingMinutes > 0) {
    minutesString = `${remainingMinutes}m`;
  }

  if (seconds >= 0) {
    secondsString = `${seconds}s`;
  }

  return `${hoursString} ${minutesString} ${secondsString}`;
}

export function convertSecondsToHoursMinutesSeconds(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const remainingMinutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor((seconds % 3600) % 60);

  let hoursString = "";
  let minutesString = "";
  let secondsString = "";

  if (hours > 0) {
    hoursString = `${hours}h`;
  }

  if (remainingMinutes > 0) {
    minutesString = `${remainingMinutes}m`;
  }

  if (remainingSeconds >= 0) {
    secondsString = `${remainingSeconds}s`;
  }

  return `${hoursString} ${minutesString} ${secondsString}`;
}

export function downloadRecordingFromURL(url: string) {
  fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;
      a.download = "recording.mp4";
      document.body.appendChild(a);
      a.click();
    })
    .catch((error: any) => console.error(error));
}
