import { getSequelizeInstance } from "@/config/postgres";
import { initUserModels, associateUserModels } from "./userModels";
import { initVendorModels, associateVendorModels } from "./vendorModels";
import { initWorkerModels, associateWorkerModels } from "./workerModels";
import { initEventModels, associateEventModels } from "./eventModels";
import { initScheduleModels, associateScheduleModels } from "./scheduleModels";
import { initClientModels, associateClientModels } from "./clientModels";

const sequelize = getSequelizeInstance();

const { User, Password, ContactMethod, RefreshToken, LoginAttempt } = initUserModels(sequelize);
const { Client } = initClientModels(sequelize);
const { Vendor, VendorIndustry, VendorService, IndustryService } = initVendorModels(sequelize);
const { Worker, IndustryRole, WorkerAvailability, WorkerException } = initWorkerModels(sequelize);
const { Event, EventType, EventVendor } = initEventModels(sequelize);
const { Shift } = initScheduleModels(sequelize);

const orm = {
    sequelize,
    User,
    Password,
    ContactMethod,
    RefreshToken,
    LoginAttempt,
    Client,
    Vendor,
    VendorIndustry,
    VendorService,
    IndustryService,
    Worker,
    IndustryRole,
    WorkerAvailability,
    WorkerException,
    Event,
    EventType,
    EventVendor,
    Shift
};

associateUserModels(orm);
associateClientModels(orm);
associateVendorModels(orm);
associateWorkerModels(orm);
associateEventModels(orm);
associateScheduleModels(orm);

export default orm;