import { getSequelizeInstance } from "../../config/postgres";
import associations from "./associations";

import User from "./user.model";
import Password from "./password.model";
import RefreshToken from "./refreshToken.model";
import LoginAttempt from "./loginAttempt.model";
import ContactMethod from "./contactMethod.model";

import VendorIndustry from "./vendorIndustries.model";
import IndustryService from "./industryService.model";
import IndustryRole from "./industryRole.model";
import EventType from "./eventType.model";

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
    EventType,
    ClockLog
}

export default orm;