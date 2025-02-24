import { getSequelizeInstance } from "../../../config/postgres";
import { setupAssociations } from "./associations";

import User from "./user.model";
import Password from "./password.model";

const sequelize = getSequelizeInstance();

// Define model associations
setupAssociations();

// Centralized Database Object
const db = {
    sequelize,  // Sequelize instance
    User,
    Password
};

export default db;