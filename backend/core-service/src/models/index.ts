import { sequelize } from "../config/database";
import Address from "./address.model";
import Coordinator from "./coordinator.model";
import Staff from "./staff.model";
import User from "./user.model";

// Syncronize all defined models to the DB
const db = {
    sequelize,
    Sequelize: sequelize,
    User,
    Address,
    Staff,
    Coordinator
};

export default db;