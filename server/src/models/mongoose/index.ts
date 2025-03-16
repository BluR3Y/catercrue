import mongoose from "mongoose";
import workerModel from "./worker.model";
import vendorModel from "./vendor.model";
import eventModel from "./event.model";
import eventVendorModel from "./eventVendor.model";

const odm = {
    mongoose,
    workerModel,
    vendorModel,
    eventModel,
    eventVendorModel
};

export default odm;