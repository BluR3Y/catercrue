import mongoose from "mongoose";
import workerModel from "./worker.model";
import catererModel from "./caterer.model";
import eventModel from "./event.model";

const odm = {
    mongoose,
    workerModel,
    catererModel,
    eventModel
};

export default odm;