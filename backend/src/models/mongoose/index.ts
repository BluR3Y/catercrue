import chatModel from "./chat.model";
import { roomModel, dmModel, channelModel, teamRoomModel } from "./roomModels";
import messageModel from "./message.model";
import { workerModel, employeeModel, contractorModel } from "./workerModels";
import eventModel from "./eventModel";

const odm = {
    chatModel,
    roomModel,
    channelModel,
    teamRoomModel,
    dmModel,
    messageModel,
    eventModel,
    workerModel,
    employeeModel,
    contractorModel,
};

export default odm;