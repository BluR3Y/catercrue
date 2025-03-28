import { getSequelizeInstance } from "@/config/postgres";
import { initUserModels, associateUserModels } from "./userModels";
import { initVendorModels, associateVendorModels } from "./vendorModels";
import { initWorkerModels, associateWorkerModels } from "./workerModels";
import { initEventModels, associateEventModels } from "./eventModels";
import { initScheduleModels, associateScheduleModels } from "./scheduleModels";
import { initCoordinatorModels, associateCoordinatorModels } from "./coordinatorModels";

const sequelize = getSequelizeInstance();

const { User, Password, ContactMethod, RefreshToken, LoginAttempt } = initUserModels(sequelize);
const { Coordinator } = initCoordinatorModels(sequelize);
const { Vendor, ServiceIndustry, VendorService, IndustryService } = initVendorModels(sequelize);
const { Worker, IndustryRole, WorkerAvailability, WorkerException } = initWorkerModels(sequelize);
const { Event, EventType, ContractedVendor } = initEventModels(sequelize);
const { Shift } = initScheduleModels(sequelize);

const orm = {
    sequelize,
    User,
    Password,
    ContactMethod,
    RefreshToken,
    LoginAttempt,
    Coordinator,
    Vendor,
    ServiceIndustry,
    VendorService,
    IndustryService,
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