import { getSequelizeInstance } from "@/config/postgres";
import { initUserModels, associateUserModels } from "./userModels";
import { initVendorModels, associateVendorModels } from "./vendorModels";
import { initWorkerModels, associateWorkerModels } from "./workerModels";
import { initEventModels, associateEventModels } from "./eventModels";

const sequelize = getSequelizeInstance();

const { User, Password, ContactMethod, RefreshToken, LoginAttempt } = initUserModels(sequelize);
const { Vendor, VendorIndustry, VendorService } = initVendorModels(sequelize);
const { Worker, IndustryRole, WorkerAvailability, WorkerException } = initWorkerModels(sequelize);
const { Event, EventType, EventVendor } = initEventModels(sequelize);

const orm = {
    sequelize,
    User,
    Password,
    ContactMethod,
    RefreshToken,
    LoginAttempt,
    Vendor,
    VendorIndustry,
    VendorService,
    Worker,
    IndustryRole,
    WorkerAvailability,
    WorkerException,
    Event,
    EventType,
    EventVendor
};

associateUserModels(orm);
associateVendorModels(orm);
associateWorkerModels(orm);
associateEventModels(orm);

export default orm;