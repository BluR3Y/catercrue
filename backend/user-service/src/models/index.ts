import { sequelize } from "../config/database";
import Coordinator from "./coordinator.model";
import Staff from "./staff.model";
import StaffRole from "./staffRole.model";
import StaffSeekingRole from "./staffSeekingRole.model";
import User from "./user.model";

// Syncronize all defined models to the DB
const db = {
    sequelize,
    Sequelize: sequelize,
    User,
    Coordinator,
    Staff,
    StaffRole,
    StaffSeekingRole
};

export default db;