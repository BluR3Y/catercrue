import { getSequelizeInstance } from "../../config/postgres";
import associations from "./associations";

import User from "./user.model";
import Password from "./password.model";
import RefreshToken from "./refreshToken.model";
import LoginAttempt from "./loginAttempt.model";
import ContactMethod from "./contactMethod.model";

import VendorIndustry from "./vendorIndustry.model";
import IndustryService from "./industryService.model";
import IndustryRole from "./industryRole.model";
import EventType from "./eventType.model";

import Vendor from "./vendor.model";
import Worker from "./worker.model";
import WorkerAvailability from "./workerAvailability.model";
import WorkerException from "./workerException.model";

import ClockLog from "./clockLog.model";

const sequelize = getSequelizeInstance();

// Define model associations
associations();

// Centralized Database Object
const orm = {
    sequelize,
    User,
    Password,
    ContactMethod,
    LoginAttempt,
    RefreshToken,
    VendorIndustry,
    IndustryService,
    IndustryRole,
    Vendor,
    Worker,
    WorkerAvailability,
    WorkerException,
    EventType,
    ClockLog
}

export default orm;