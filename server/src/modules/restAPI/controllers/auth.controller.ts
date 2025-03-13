import { RequestHandler } from "express";
import crypto from "crypto";

import { blacklistToken, generateJWT } from "@/utils/manageJWT";
import { twilioClient } from "@/config/twilio";
import { redisClient } from "@/config/redis";
import { orm, odm } from "@/models";

const accessTokenDuration = process.env.ACCESS_TOKEN_DURATION ? Number(process.env.ACCESS_TOKEN_DURATION) : "1h"

export const login: RequestHandler = async (req, res, next) => {
    try {
        const { roleData } = req;
        if (!roleData) {
            res.status(401).json({ message: "Authentication failed" });
            return;
        }
        const { role, data } = roleData;

        // Generate Access Token
        const accessToken = generateJWT({ role, roleId: data.id }, accessTokenDuration);

        // Generate Refresh Token
        const refreshToken = await orm.RefreshToken.create({ userId: data.userId });

        res.status(201).json({
            accessToken,
            refreshToken: refreshToken.id
        });
    } catch (err) {
        next(err);
    }
}

export const identifierAvailability: RequestHandler = async (req, res, next) => {
    try {
        const { identifierType, identifierValue } = req.params;
        const isIdentifierAvailable = await orm.ContactMethod.count({
            where: { [identifierType]: identifierValue }
        }) === 0;
        res.json({ available: isIdentifierAvailable });
    } catch (err) {
        next(err);
    }
}

export const refreshToken: RequestHandler = async (req, res, next) => {
    try {
        const { role, data } = req.roleData!;
        const { refreshToken } = req.body;

        // Retrieve refresh token information from db
        let rtData = await orm.RefreshToken.findByPk(refreshToken);
        if (!rtData) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }

        const transaction = await orm.sequelize.transaction();
        try {
            // Check if the refresh token is expired
            if (rtData.isExpired()) {
                // Delete expired refresh token from db
                await rtData.destroy({ transaction });
                
                // Commit sequelize changes
                await transaction.commit();

                res.status(403).json({ message: "Refresh token has expired" });
                return;
            }

            // Check for imminent expiry (within 5 minutes)
            if (rtData.expiry.getTime() < new Date().getTime() + (5 * 60 * 1000)) {
                // Generate a new refresh token
                const newRefreshToken = await orm.RefreshToken.create({ userId: data.userId }, { transaction });
                // Remove the expiring token from the database
                await rtData.destroy({ transaction });
                // Assign the new token
                rtData = newRefreshToken;
            }

            // Retrieve access token
            let accessToken = req.headers['authorization']!.split(' ')[1];
            // Blacklist access token
            await blacklistToken(accessToken);
            // Generate new Access Token
            accessToken = generateJWT({ role, roleId: data.id }, accessTokenDuration);

            res.status(201).json({
                accessToken,
                refreshToken: rtData.id
            });
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        next(err);
    }
}

export const requestOTP: RequestHandler = async (req, res, next) => {
    try {
        const { identifierType, identifierValue } = req.body;

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpKey = `otp:${identifierValue}`;
        console.log("Generated OTP: ", otp);   // Debugging

        // Store OTP in Redis (expires in 5 minutes)
        await redisClient!.setex(otpKey, (5 * 60), otp);

        // Send OTP via SMS or Email
        if (identifierType === 'phone') {
            await twilioClient!.messages.create({
                body: `Your CaterCrue verification code is: ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: identifierValue
            });
        } else if (identifierType === 'email') {
            // Implement email OTP sending logic
        }
        res.status(201).json({ message: "OTP sent successfully" });
    } catch (err) {
        next(err);
    }
}

export const verifyOTP: RequestHandler = async (req, res, next) => {
    try {
        const { identifierType, identifierValue, otp } = req.body;

        // Check OTP in Redis
        const otpKey = `otp:${identifierValue}`;
        const storedOtp = await redisClient!.get(otpKey);

        if (!storedOtp || storedOtp !== otp) {
            res.status(401).json({ message: "Invalid or expired OTP" });
            return;
        }

        // Remove the verified otp from redis
        await redisClient!.del(otpKey);

        // Generate a temporary jwt for OTP verification (valid for 15 minutes)
        const otpToken = generateJWT({ identifierType, identifierValue }, "15m");
        res.json({ otpToken });
    } catch (err) {
        next(err);
    }
}

export const registerUser: RequestHandler = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            password
        } = req.body;
        const otpData = req.otpData!;

        const isUserRegistered = await orm.ContactMethod.count({
            where: { type: otpData.identifierType, value: otpData.identifierValue }
        });
        if (isUserRegistered) {
            res.status(401).json({ message: "User already registered with contact method" });
            return;
        }

        const transaction = await orm.sequelize.transaction();
        try {
            // Create user
            const user = await orm.User.create({
                firstName,
                lastName
            }, { transaction });

            // Create password
            await orm.Password.create({
                userId: user.id,
                password
            }, { transaction });

            // Create contact method
            await orm.ContactMethod.create({
                userId: user.id,
                type: otpData.identifierType,
                value: otpData.identifierValue,
                isPrimary: true
            }, { transaction });

            // Commit transaction if all create operations succeed
            await transaction.commit();

            res.status(201).json({ message: "User successfully registered" });
        } catch (err) {
            // Rollback transaction if any operations fail
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        next(err);
    }
}

export const registerCoordinator: RequestHandler = async (req, res, next) => {
    try {
        const { identifierType, identifierValue } = req.otpData!;

        // Find user by contact method
        const contactMethod = await orm.ContactMethod.findOne({
            where: { type: identifierType, value: identifierValue }
        });
        if (!contactMethod) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isCoordinatorRegistered = await odm.coordinatorModel.countDocuments({ userId: contactMethod.userId });
        if (isCoordinatorRegistered) {
            res.status(401).json({ message: "User is already registered as a coordinator" });
            return;
        }

        const worker = await odm.coordinatorModel.create({
            userId: contactMethod.userId
        });

        req.roleData = {
            role: 'coordinator',
            data: worker
        };

        login(req, res, next);
    } catch (err) {
        next(err);
    }
}

export const registerWorker: RequestHandler = async (req, res, next) => {
    try {
        const { identifierType, identifierValue } = req.otpData!;

        // Find user by contact method
        const contactMethod = await orm.ContactMethod.findOne({
            where: { type: identifierType, value: identifierValue }
        });
        if (!contactMethod) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isWorkerRegistered = await odm.workerModel.countDocuments({ userId: contactMethod.userId });
        if (isWorkerRegistered) {
            res.status(401).json({ message: "User is already registered as a worker" });
            return;
        }

        const worker = await odm.workerModel.create({
            userId: contactMethod.userId
        });

        req.roleData = {
            role: 'worker',
            data: worker
        };

        login(req, res, next);
    } catch (err) {
        next(err);
    }
}

// Suggestions:
// * Link refresh tokens to devices for better tracking
// * Implement Zod for validation
// * Implement rate limiting to OTP handlers