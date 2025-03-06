import { Document, model, Schema, Types } from "mongoose";
import { IRoom } from "./room.schema";

export interface IChannel extends IRoom {
    name: string;
    chatId: Types.ObjectId;
}

export const channelSchema = new Schema<IChannel>(
    {
        name: {
            type: Schema.Types.String,
            required: true
        },
        chatId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Chat'
        },
        variant: 'Channel'
    }
);