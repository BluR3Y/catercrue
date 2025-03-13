import express from 'express';
import { createServer } from 'http';
import cors from "cors";

import { postgresReady, closePostgresConnection, getSequelizeInstance } from './config/postgres';
import { closeMongooseConnection, mongooseReady } from './config/mongoose';
import { redisReady, closeRedisConnection } from './config/redis';
import { twilioReady } from './config/twilio';
import restAPI from './modules/restAPI';
import logger from './config/winston';
import websocket from './modules/websocket';
import graphql from './modules/graphql';
import orm from "./models/sequelize";
import odm from "./models/mongoose";

const devConfig = async () => {
    const sequelize = getSequelizeInstance();
    const force = true;
    await sequelize.sync({force});
    logger.info("Postgres tables synchronized with sequelize models.");
    // Test Data
    if (force) {
        const transaction = await sequelize.transaction();
        try {
            // User One
            const testUserOne = await orm.User.create({
                firstName: "Rey",
                lastName: "Flores",
                // email: "reyhector1234@gmail.com",
                // phone: "+19295697692"
            }, {transaction});
            const testPassword = await orm.Password.create({
                userId: testUserOne.id,
                password: "Password@1234"
            },{transaction});

            await orm.ContactMethod.create({
                userId: testUserOne.id,
                type: 'email',
                value: 'reyhector1234@gmail.com',
                isPrimary: true
            },{transaction});
            await orm.ContactMethod.create({
                userId: testUserOne.id,
                type: 'phone',
                value: '+19295697692',
                isPrimary: false
            }, {transaction});

            // User Two
            const testUserTwo = await orm.User.create({
                firstName: "John",
                lastName: "Doe",
                // email: "johnDoe@gmail.com",
                // phone: "+19163456543"
            },{transaction});

            await orm.ContactMethod.create({
                userId: testUserTwo.id,
                type: 'phone',
                value: '+19163456543',
                isPrimary: false
            },{transaction});

            const testPasswordTwo = await orm.Password.create({
                userId: testUserTwo.id,
                password: "Password@1234"
            }, {transaction});

            await transaction.commit();

            // // Direct Message Room
            // const testRoom = await odm.privateRoomModel.create({
            //     members: [testUserOne.id, testUserTwo.id]
            // })
            // // DM
            // await odm.messageModel.create({
            //     roomId: testRoom.id,
            //     sender: testUserOne.id,
            //     content: "Hello World!"
            // });

            // // Group Chat
            // const testChat = await odm.chatModel.create({
            //     name: "Test Group Chat",
            //     admin: testUserTwo.id,
            //     members: [testUserOne.id]
            // });
            // const testChannel = await odm.channelModel.create({
            //     name: "Test Channel",
            //     chatId: testChat.id,
            //     members: [testUserOne.id]
            // });
            // await odm.messageModel.create({
            //     roomId: testChannel.id,
            //     sender: testUserOne.id,
            //     content: "Hello Chat!",
            // });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
}

async function startServer() {
    try {
        await Promise.all([postgresReady, redisReady, mongooseReady, twilioReady]);

        const {
            BACKEND_CLIENT,
            BACKEND_PORT,
            NODE_ENV
        } = process.env;

        const backend_client = NODE_ENV === "development" ? 'localhost' : BACKEND_CLIENT;
        const backend_port = Number(NODE_ENV === 'development' ? '3001' : BACKEND_PORT);
        if (!backend_client || !backend_port) {
            throw new Error("Missing server environment variables");
        }
        const app = express();
        // app.set('trust proxy', true)
        app.use(cors({
            origin: `http://${backend_client}:${backend_port}`,
            credentials: true
        }));

        restAPI(app);
        // Dev Test Data
        // if (NODE_ENV === 'development') await devConfig();

        const httpServer = createServer(app);
        // websocket(httpServer);
        // await graphql(httpServer);

        httpServer.listen(backend_port, backend_client, () => {
            logger.info(`Backend Server running on http://${backend_client}:${backend_port}`);
        });
    } catch (error) {
        console.log(error)
        logger.error("Error occurred while starting the server: ", { error });
        await closePostgresConnection();
        await closeRedisConnection();
        await closeMongooseConnection();
        process.exit(1);
    }
}
startServer();

// // .then(async () => {
// //     const sequelize = getSequelizeInstance();
// //     if (sequelize && process.env.NODE_ENV === 'development') {
// //         const force = true;
// //         await sequelize.sync({force});
// //         logger.info("Postgres tables synchronized with sequelize models.");
// //         // Test Data
// //         if (force) {
// //             const transaction = await sequelize.transaction();
// //             try {
// //                 const testUser = await orm.User.create({
// //                     firstName: "Rey",
// //                     lastName: "Flores",
// //                     email: "reyhector1234@gmail.com",
// //                     phone: "+19295697692"
// //                 }, {transaction});
// //                 const [salt, hash] = await orm.Password.hashPassword("Password@1234")
// //                 const testPassword = await orm.Password.create({
// //                     userId: testUser.id,
// //                     salt,
// //                     hash,
// //                 },{transaction});
// //                 await transaction.commit();
// //             } catch (err) {
// //                 await transaction.rollback();
// //             }
// //         }
// //     }
// // })