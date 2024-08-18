import { sequelize } from "../configs/database";
import RefreshToken from "./refreshToken.model";
import User from "./user.model";

// Syncronize all defined models to the DB
const db = {
    sequelize,
    Sequelize: sequelize,
    User,
    RefreshToken
};

export default db;