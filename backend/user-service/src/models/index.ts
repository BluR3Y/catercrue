import { sequelize } from "../config/database";
import Coordinator from "./coordinator.model";
import RefreshToken from "./refreshToken.model";
import Staff from "./staff.model";
import StaffRole from "./staffRole.model";
import StaffSeekingRole from "./staffSeekingRole.model";
import User from "./user.model";

// Syncronize all defined models to the DB
const db = {
    sequelize,
    Sequelize: sequelize,
    User,
    RefreshToken,
    Coordinator,
    Staff,
    StaffRole,
    StaffSeekingRole
};

export default db;