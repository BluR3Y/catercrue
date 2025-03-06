import { Document, model, Schema, Types } from "mongoose";
import { IRoom } from "./room.schema";

export const dmSchema = new Schema<IRoom>(
    {
        variant: 'DirectMessage'
    }
);

dmSchema.pre("save", function(next) {
    if (this.members.length !== 2) {
        throw new Error("DMRoom must have exactly two participants");
    }
    next();
});