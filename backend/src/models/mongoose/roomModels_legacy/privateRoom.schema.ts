import { Document, model, Schema, Types } from "mongoose";
import { IRoom } from "./room.schema";

export interface IPrivateRoom extends IRoom {}

export const privateRoomSchema = new Schema<IPrivateRoom>();

privateRoomSchema.pre("save", function(next) {
    if (this.members.length !== 2) {
        throw new Error("DMRoom must have exactly two participants");
    }
    next();
});