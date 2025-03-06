import { Document, model, Schema, Types } from "mongoose";
import { IRoom, roomSchema } from "./room.schema";
import { dmSchema } from "./dm.schema";
import { ITeamRoom, teamRoomSchema } from "./teamRoom.schema";
import { IChannel, channelSchema } from "./channel.schema";

export const roomModel = model<IRoom>("Room", roomSchema);

export const dmModel = model<IRoom>("DM", dmSchema);

export const teamRoomModel = model<ITeamRoom>("TeamRoom", teamRoomSchema);

export const channelModel = model<IChannel>("Channel", channelSchema);