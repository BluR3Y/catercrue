import { getSequelizeInstance } from "@/config/postgres";
import { initUserModels, associateUserModels } from "./userModels";
import { initVendorModels, associateVendorModels } from "./vendorModels";
import { initWorkerModels, associateWorkerModels } from "./workerModels";
import { initEventModels, associateEventModels } from "./eventModels";
import { initScheduleModels, associateScheduleModels } from "./scheduleModels";

const sequelize = getSequelizeInstance();

const { User, Password, RefreshToken, LoginAttempt } = initUserModels(sequelize);
const { Coordinator, Vendor, ServiceIndustry, VendorService, IndustryService } = initVendorModels(sequelize);
const { Worker, Contractor, IndustryRole, WorkerAvailability, WorkerException } = initWorkerModels(sequelize);
const { Event, EventType, ContractedVendor } = initEventModels(sequelize);
const { Shift } = initScheduleModels(sequelize);

const orm = {
    sequelize,
    User,
    Password,
    RefreshToken,
    LoginAttempt,
    Coordinator,
    Vendor,
    ServiceIndustry,
    VendorService,
    IndustryService,
    Contractor,
    Worker,
    IndustryRole,
    WorkerAvailability,
    WorkerException,
    Event,
    EventType,
    ContractedVendor,
    Shift
};

associateUserModels(orm);
associateVendorModels(orm);
associateWorkerModels(orm);
associateEventModels(orm);
associateScheduleModels(orm);

export default orm;