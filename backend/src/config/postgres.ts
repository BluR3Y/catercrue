import { Sequelize } from "sequelize";
import logger from "./winston";

let sequelize: Sequelize | null = null;

const postgresConnect = async (): Promise<void> => {
    const {
        POSTGRES_HOST,
        POSTGRES_PORT,
        POSTGRES_ACCESS_USER,
        POSTGRES_ACCESS_PASSWORD,
        POSTGRES_DB_NAME,
    } = process.env;

    if (!POSTGRES_HOST || !POSTGRES_PORT || !POSTGRES_ACCESS_USER || !POSTGRES_ACCESS_PASSWORD || !POSTGRES_DB_NAME) {
        throw new Error('Missing required environment variables for Postgres connection');
    }

    try {
        sequelize = new Sequelize(`postgres://${POSTGRES_ACCESS_USER}:${POSTGRES_ACCESS_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB_NAME}`, {
            logging: (msg) => logger.debug(msg)
        });
        await sequelize.authenticate();
        logger.info('Postgres connection established successfully');
    } catch (err) {
        throw new Error(`Failed to establish a connection to Postgres database: ${err}`)
    }
};

const closePostgresConnection = async (): Promise<void> => {
    if (sequelize) {
        try {
            await sequelize.close();
            logger.info("Postgres connection successfully closed.")
        } catch (error) {
            logger.error("Error occured while closing connection to Postgres database:", { error });
        }
    }
}

const getSequelizeInstance = (): Sequelize => {
    if (!sequelize) {
        throw new Error("Sequelize has not been initialized.");
    }
    return sequelize;
}

const postgresReady = postgresConnect();

export {
    postgresReady,
    closePostgresConnection,
    getSequelizeInstance,
    sequelize
}