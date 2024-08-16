import { sequelize } from "../configs/database";
import Device from "./device.model";
import RefreshToken from "./refreshToken.model";
import User from "./user.model";

// Syncronize all defined models to the DB
const db = {
    sequelize,
    Sequelize: sequelize,
    User,
    Device,
    RefreshToken,
    // Coordinator,
    // Staff,
    // StaffRole,
    // StaffSeekingRole
};

export default db;