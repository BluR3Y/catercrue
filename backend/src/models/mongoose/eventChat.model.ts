import { Document, model, Schema } from "mongoose";

export interface IEventChat extends Document {

}

const eventChatSchema = new Schema<IEventChat>({

});

export default model<IEventChat>("EventChat", eventChatSchema);