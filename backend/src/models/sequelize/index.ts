import { getSequelizeInstance } from "../../config/postgres";
import associations from "./associations";

import User from "./user.model";
import Password from "./password.model";
import RefreshToken from "./refreshToken.model";
import LoginAttempt from "./loginAttempt.model";
import ContactMethod from "./contactMethod.model";

import Coordinator from "./coordinator.model";
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
    Coordinator,
    EventType,
    ClockLog
}

export default orm;