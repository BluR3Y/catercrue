import { getSequelizeInstance } from "../config/postgres";
import associations from "./associations";

import User from "./user.model";
import Password from "./password.model";
import RefreshToken from "./refreshToken.model";

import Contractee from "./contractee.model";
import EventType from "./event_type.model";
import Event from "./event.model";
import EventItinerary from "./event_itinerary.model";

const sequelize = getSequelizeInstance();

// Define model associations
associations();

// Centralized Database Object
const orm = {
    sequelize,
    User,
    Password,
    RefreshToken,
    Contractee,
    EventType,
    Event,
    EventItinerary
}

export default orm;