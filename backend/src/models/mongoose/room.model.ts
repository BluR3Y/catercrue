import { Document, model, Schema, Types } from "mongoose";

interface IRoom extends Document {
    members: Types.UUID[],
    createdAt?: Date;
    updatedAt?: Date;
    variant: string;
}
const roomSchema = new Schema<IRoom>(
    {
        members: [{
            type: Schema.Types.UUID,
            required: true
        }]
    },
    { 
        timestamps: true,
        collection: 'rooms',
        discriminatorKey: 'variant'
    }
);


export const roomModel = model<IRoom>("Room", roomSchema);

const directMessageSchema = new Schema<IRoom>({
    variant: 'DirectMessage'
});

directMessageSchema.pre("save", function(next) {
    if (this.members.length !== 2) {
        throw new Error("DMRoom must have exactly two participants");
    }
    next();
});

// Room will be used to implement Direct Messaging
export const directMessageModel = roomModel.discriminator('DirectMessage', directMessageSchema);

interface ITeamRoom extends IRoom {
    eventId: Types.UUID;
}
const teamRoomSchema = new Schema<ITeamRoom>({
    eventId: {
        type: Schema.Types.UUID,
        required: true
    },
    variant: 'TeamRoom'
});

// Team Rooms will be used to implement event chats
export const teamRoomModel = roomModel.discriminator<ITeamRoom>('TeamRoom', teamRoomSchema);

interface IChannel extends IRoom {
    name: string;
    chatId: Types.ObjectId
}
const channelSchema = new Schema<IChannel>({
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
});

// channels will be used to implement standard group chatting
export const channelModel = roomModel.discriminator<IChannel>('Channel', channelSchema);