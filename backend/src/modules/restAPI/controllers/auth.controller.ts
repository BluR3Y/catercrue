import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import orm from "../../../models/sequelize";
import { blacklistToken, generateJWT } from "../../../utils/manageJWT";
import { twilioClient } from "../../../config/twilio";
import { redisClient } from "../../../config/redis";

// export const localLogin = authenticate.localLogin;
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ** Future feature, check if login is suspecious
        const user = req.user as any;
        // Generate Refresh Token
        const refreshToken = await orm.RefreshToken.create({ userId: user.id });
        // Generate Access Token
        const accessToken = generateJWT({ userId: user.id });
        res.status(201).json({
            accessToken: accessToken,
            refreshToken: refreshToken.id
        });
    } catch (err) {
        next(err);
    }
}

export const identifierAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifierType, identifierValue } = req.params;
        const isIdentifierAvailable = await orm.User.count({
            where: { [identifierType]: identifierValue }
        })
        .then(count => count === 0);
        res.json({ available: isIdentifierAvailable });
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
            password
        } = req.body;
        
        const transaction = await orm.sequelize.transaction();

        try {
            const user = await orm.User.create({
                firstName,
                lastName,
                phone,
                email
            }, { transaction });

            const [salt, hash] = await orm.Password.hashPassword(password);
            await orm.Password.create({
                userId: user.id,
                salt,
                hash
            }, { transaction });

            // Commit transaction if both create operations succeed
            await transaction.commit();

            req.user = user;
            login(req, res, next);
        } catch (err) {
            // Rollback transactio if any operation fails
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        next(err);
    }
}

// Request Handler that generates a new access token
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
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
        const { phoneNumber } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(otp);   // Debugging
        await twilioClient!.messages.create({
            body: `Your CaterCrue verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

        redisClient!.setex(`otp:${phoneNumber}`, 300, otp);

        res.json({ message: "OTP send successfully" });
    } catch (err) {
        next(err);
    }
}

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber, otp } = req.body;
        const storedOtpKey = `otp:${phoneNumber}`;
        const storedOtp = await redisClient!.get(storedOtpKey);

        if (!storedOtp || storedOtp !== otp) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        await redisClient!.del(storedOtpKey);

        // Generate a temporary session token for OTP verification
        const optSessionToken = crypto.randomBytes(32).toString("hex");
        await redisClient!.setex(`otp-session:${optSessionToken}`, 600, phoneNumber);

        res.json({ message: "OTP verified", optSessionToken });
    } catch (err) {
        next(err);
    }
}