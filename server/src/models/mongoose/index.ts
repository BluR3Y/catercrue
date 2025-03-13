import chatModel from "./chat.model";
// import { roomModel, privateRoomModel, channelModel, teamRoomModel } from "./roomModels";
import messageModel from "./message.model";
import coordinatorModel from "./coordinator.model";
import workerModel from "./worker.model";
import eventModel from "./eventModel";
import shiftModel from "./shift.model";
import { getMongooseInstance } from "../../config/mongoose";

// const mongo = getMongooseInstance();

const odm = {

    chatModel,
    // roomModel,
    // channelModel,
    // teamRoomModel,
    // privateRoomModel,
    messageModel,
    eventModel,
    coordinatorModel,
    workerModel,
    shiftModel
};

export default odm;