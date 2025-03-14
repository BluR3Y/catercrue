import { Types, Document } from "mongoose";
import { CatererServices } from "./caterer.types";

export interface IEventCaterer extends Document {
    event: Types.ObjectId;
    caterer: Types.ObjectId;
    services: ReadonlyArray<CatererServices>;
}