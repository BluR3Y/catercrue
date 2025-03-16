import { Types, Document } from "mongoose";
import { CatererServices } from "./caterer.types";

export interface IEventVendor extends Document {
    event: Types.ObjectId;
    vendor: Types.ObjectId;
    services: ReadonlyArray<CatererServices>;
}