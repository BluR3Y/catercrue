import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import orm from "../../../models/sequelize";
import { blacklistToken, generateJWT } from "../../../utils/manageJWT";
import { twilioClient } from "../../../config/twilio";
import { redisClient } from "../../../config/redis";
import odm from "../../../models/mongoose";

// export const localLogin = authenticate.localLogin;
export const login = async (req: Request, res: Response, next: NextFunction) => {
        // ** Future feature, check if login is suspecious
    try {
        // Check if `req.user` exists before proceeding
        if (!req.user) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        const user = req.user;
    
        // Generate Refresh Token
        const refreshToken = await orm.RefreshToken.create({ userId: user.id });
        
        const tokenPayload: any = { userId: user.id };
        if (req.worker) tokenPayload.workerId = req.worker.id;
        else if (req.coordinator) tokenPayload.coordinatorId = req.coordinator.id;
        else return res.status(400).json({ message: "Missing role" });
        
        // Generate Access Token
        const accessToken = generateJWT(tokenPayload);
        res.status(201).json({
            accessToken,
            refreshToken: refreshToken.id
        });
    } catch (err) {
        next(err);
    }
}

export const identifierAvailability = async (req: Request, res: Response, next: NextFunction) => {
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

// Request Handler that generates a new access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(403).send({ message: "Refresh token is required" });
            return;
        }

        // Retrieve refresh token information from db
        let rtData = await orm.RefreshToken.findByPk(refreshToken);

        if (!rtData) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        
        // Check if the refresh token is expired
        if (rtData.isExpired()) {
            // Delete expired refresh token from db
            await rtData.destroy();
            res.status(403).json({ message: "Refresh token has expired" });
            return;
        }

        // Check for imminent expiry (within 5 minutes)
        if (rtData.expiry.getTime() < new Date().getTime() + (5 * 60 * 1000)) {
            const transaction = await orm.sequelize.transaction();
            try {
                // Generate a new refresh token
                const newRefreshToken = await orm.RefreshToken.create({ userId: user.id });
                // Remove the expiring token from the database
                await rtData.destroy();
                // Assign the new token
                rtData = newRefreshToken;
            } catch (err) {
                // Rollback transaction if any operations fail
                await transaction.rollback();
                throw err;
            }
        }

        // Retrieve access token
        const accessToken = req.headers['authorization']!;
        // Blacklist access token
        await blacklistToken(accessToken);

        res.status(201).json({
            accessToken: generateJWT({ userId: user.id }),
            refreshToken: rtData.id
        });
    } catch(err) {
        next(err);
    }
}

export const requestOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user!;
        const activeContact = await orm.ContactMethod.findOne({
            where: { userId: user.id, isPrimary: true }
        });
        if (!activeContact) {
            throw new Error(`Could not find contact method associated with user: ${user}`);
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpKey = `otp:${activeContact!.id}`;
        console.log(otp);   // Debugging

        await redisClient!.setex(otpKey, 300, otp);

        if (activeContact.type === 'phone') {
            await twilioClient!.messages.create({
                body: `Your CaterCrue verification code is: ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: activeContact.value
            });
        } else {
            // Implement sending emails logic
        }
        res.json({ message: "OTP successfully sent" });
    } catch (err) {
        next(err);
    }
}

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { otp } = req.body;
        const user = req.user!;
        const activeContact = await orm.ContactMethod.findOne({
            where: { userId: user.id, isPrimary: true }
        });
        if (!activeContact) {
            throw new Error(`Could not find contact method associated with user: ${user}`);
        }

        const storedOtpKey = `otp:${activeContact.id}`;
        const storedOtp = await redisClient!.get(storedOtpKey);

        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        // Remove the verified otp from redis
        await redisClient!.del(storedOtpKey);

        // Generate a temporary session token for OTP verification
        const otpSessionToken = crypto.randomBytes(32).toString("hex");
        await redisClient!.setex(`otp-session:${otpSessionToken}`, 600, user.id);
        res.json({ message: "OTP verified", otpSessionToken });
    } catch (err) {
        next(err);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role
        } = req.body;

        if (role !== 'coordinator' && role !== 'worker') {
            res.status(400).json({ message: "Invalid role" });
            return;
        }

        const transaction = await orm.sequelize.transaction();
        try {
            const user = await orm.User.create({
                firstName,
                lastName
            }, { transaction });

            const [salt, hash] = await orm.Password.hashPassword(password);
            await orm.Password.create({
                userId: user.id,
                salt,
                hash
            }, { transaction });

            if (phone) {
                await orm.ContactMethod.create({
                    userId: user.id,
                    type: 'phone',
                    value: phone,
                    isPrimary: true
                }, { transaction });
            }
            if (email) {
                await orm.ContactMethod.create({
                    userId: user.id,
                    type: 'email',
                    value: email,
                    isPrimary: !phone
                }, { transaction });
            }

            if (role === 'coordinator') {
                req.coordinator = await odm.coordinatorModel.create({
                    userId: user.id
                });
            } else if (role === 'worker') {
                req.worker = await odm.workerModel.create({
                    userId: user.id
                });
            }

            // Commit transaction if all create operations succeed
            await transaction.commit();

            // Save user in the request
            req.user = user;

            return login(req, res, next);
        } catch (err) {
            // Rollback transaction if any operations fail
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        next(err);
    }
}