import { Document, model, Schema, Types } from "mongoose";
import { IRoom } from "./room.schema";

export interface ITeamRoom extends IRoom {
    eventId: Types.ObjectId;
}

export const teamRoomSchema = new Schema<ITeamRoom>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Events'
        }
    }
);