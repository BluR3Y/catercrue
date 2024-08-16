import { sequelize } from "../configs/database";
import Password from "./password.model";
import RefreshToken from "./refreshToken.model";

// Syncronize all defined models to the DB
const db = {
    sequelize,
    Sequelize: sequelize,
    RefreshToken,
    Password
};

export default db;