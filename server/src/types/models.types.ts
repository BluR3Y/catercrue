import { Client } from "@/models/sequelize/clientModels/client.model";
import { Worker } from "@/models/sequelize/workerModels/worker.model";
import { Vendor } from "@/models/sequelize/vendorModels/vendor.model";

export enum EventState {
    drafted = "drafted",
    scheduled = "scheduled",
    canceled = "canceled"
}

export enum WeekDay {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
}

export enum Manager {
    Client = "client",
    Worker = "worker",
    Vendor = "vendor"
}

export interface ILocation {
    type: 'Point';
    coordinates: [number, number];
};

export const roleMap: Record<string, any> = {
    client: Client,
    worker: Worker,
    vendor: Vendor
}