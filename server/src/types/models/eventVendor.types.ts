import { Types, Document } from "mongoose";

export interface IEventVendor extends Document {
    event: Types.ObjectId;
    vendor: Types.ObjectId;
    services: number[];
}