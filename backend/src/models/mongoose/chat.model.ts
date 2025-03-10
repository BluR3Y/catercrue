import { Document, model, Schema, Types } from "mongoose";

interface IChat extends Document {
    name: string;
    admin: string;
    members: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

const chatSchema = new Schema<IChat>(
    {
        name: {
            type: String,
            required: true
        },
        admin: {
            type: Schema.Types.String,
            required: true
        },
        members: {
            type: [{
                type: Schema.Types.String,
                required: true
            }]
        },
    },
    {
        timestamps: true,
        collection: 'chats'
    }
);

export default model<IChat>("Chat", chatSchema);