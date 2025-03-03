import chatModel from "./chat.model";
import { roomModel, directMessageModel, channelModel, teamRoomModel } from "./room.model";
import messageModel from "./message.model";

const odm = {
    chatModel,
    roomModel,
    channelModel,
    teamRoomModel,
    directMessageModel,
    messageModel
};

export default odm;