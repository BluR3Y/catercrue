import { Schema, model, Document, Types } from "mongoose";

interface IMessage extends Document {
    roomId: Types.ObjectId;
    sender: string;
    content: string;
    createdAt?: Date;
    updatedAt?:Date;
}

const messageSchema = new Schema<IMessage>({
    roomId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    sender: {
        type: Schema.Types.String,
        required: true
    },
    content: {
        type: Schema.Types.String,
        required: true
    }
}, { timestamps: true, collection: 'messages' });

export default model<IMessage>("Message", messageSchema);