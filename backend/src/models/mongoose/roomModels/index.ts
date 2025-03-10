import { Document, model, Schema, Types } from "mongoose";
import { IRoom, roomSchema } from "./room.schema";
import { IPrivateRoom, privateRoomSchema } from "./privateRoom.schema";
import { ITeamRoom, teamRoomSchema } from "./teamRoom.schema";
import { IChannel, channelSchema } from "./channel.schema";

export const roomModel = model<IRoom>("Room", roomSchema);

export const privateRoomModel = roomModel.discriminator<IPrivateRoom>("PrivateRoom", privateRoomSchema);

export const teamRoomModel = roomModel.discriminator<ITeamRoom>("TeamRoom", teamRoomSchema);

export const channelModel = roomModel.discriminator<IChannel>("Channel", channelSchema);