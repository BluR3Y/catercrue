import { model, Schema } from "mongoose";
import { IChat } from "@/types";

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