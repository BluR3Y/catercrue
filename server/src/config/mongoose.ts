import mongoose from "mongoose";
import logger from "./winston";

let  mongooseClient: mongoose.Mongoose | null = null;

const mongooseConnect = async (): Promise<void> => {
    const {
        MONGO_HOST,
        MONGO_PORT,
        MONGO_ACCESS_USER,
        MONGO_ACCESS_PASSWORD,
        MONGO_DB_NAME
    } = process.env;
    if (!MONGO_HOST || !MONGO_PORT || !MONGO_ACCESS_USER || !MONGO_ACCESS_PASSWORD || !MONGO_DB_NAME) {
        throw new Error("Missing required environment variables for MongoDB connection");
    }
    const mongoUri = `mongodb://${MONGO_ACCESS_USER}:${encodeURIComponent(MONGO_ACCESS_PASSWORD)}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`
    try {
        // Throw mongoose error if querying fields aren't defined
        mongoose.set('strictQuery', true);
        mongooseClient = await mongoose.connect(mongoUri)
        logger.info("Successfully established connection to mongo database.");
    } catch (err) {
        throw new Error(`Failed to establish a connection to mongoDB database: ${(err as Error).message}`);
    }
}

const closeMongooseConnection = async (): Promise<void> => {
    if (mongooseClient) {
        try {
            await mongooseClient.disconnect();
            logger.info("Mongo connection successfully closed");
        } catch (err) {
            logger.error(`Error while closing connection to Mongo database: ${(err as Error).message}`, { stack: (err as Error).stack });
        }
    }
}

const getMongooseInstance = (): mongoose.Mongoose => {
    if (!mongooseClient) {
        throw new Error("Mongoose has not been initialized");
    }
    return mongooseClient;
}

const mongooseReady = mongooseConnect();
export {
    mongooseReady,
    getMongooseInstance,
    closeMongooseConnection
}