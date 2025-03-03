import { getSequelizeInstance } from "../../config/postgres";
import associations from "./associations";

import User from "./user.model";
import Password from "./password.model";
import RefreshToken from "./refreshToken.model";
import LoginAttempt from "./loginAttempt.model";

import Coordinator from "./coordinator.model";
import EventType from "./eventType.model";
import Event from "./event.model";
import EventItinerary from "./eventItinerary.model";
import EventStaff from "./eventStaff.model";

import ClockLog from "./clockLog.model";

const sequelize = getSequelizeInstance();

// Define model associations
associations();

// Centralized Database Object
const orm = {
    sequelize,
    User,
    Password,
    LoginAttempt,
    RefreshToken,
    Coordinator,
    EventType,
    Event,
    EventItinerary,
    EventStaff,
    ClockLog
}

export default orm;