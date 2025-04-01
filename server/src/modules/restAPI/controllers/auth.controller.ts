import { RequestHandler } from "express";
import { blacklistToken, generateJWT } from "@/utils/manageJWT";
import { sendSMSOTP } from "@/services/smsService";
import { getRedisInstance } from "@/config/redis";
import { orm } from "@/models";
import { sendEmailOTP } from "@/services/emailService";

const redisClient = getRedisInstance();

const accessTokenDuration = process.env.ACCESS_TOKEN_DURATION ? Number(process.env.ACCESS_TOKEN_DURATION) : "1h"

export const login: RequestHandler = async (req, res, next) => {
    try {
        const { roleData } = req;
        if (!roleData) {
            throw new Error("Failed to authenticate user");
        }
        const { role, data } = roleData;

        // Generate Access Token
        const accessToken = generateJWT({ role, roleId: data.id }, accessTokenDuration);

        // Generate Refresh Token
        const refreshToken = await orm.RefreshToken.create({ user_id: data.user_id });

        res.status(201).json({
            accessToken,
            refreshToken: refreshToken.id
        });
    } catch (err) {
        next(err);
    }
}

export const logout: RequestHandler = async (req, res, next) => {
    try {
        // Delete refresh token
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(400).json({ message: "No refresh token found" });
            return;
        }

        // Find and delete refresh token from DB
        const rtData = await orm.RefreshToken.findByPk(refreshToken);
        if (!rtData) {
            res.status(403).json({ message: "Invalid refresh token" });
            return;
        }
        // Invalidate refresh token
        await rtData.destroy();

        // Clear refresh token from cookies
        res.clearCookie("refreshToken", { httpOnly: true, secure: true });

        // Retrieve access token
        let accessToken = req.headers['authorization']!.split(' ')[1];
        // Blacklist access token
        await blacklistToken(accessToken);

        res.status(200).json({ message: "User successfully logged out" });
    } catch (err) {
        next(err);
    }
}

export const identifierAvailability: RequestHandler = async (req, res, next) => {
    try {
        const { identifierType, identifierValue } = req.params as { identifierType: 'phone' | 'email'; identifierValue: string }
        const isIdentifierAvailable = await orm.User.count({
            where: { [identifierType]: identifierValue }
        }) == 0;
        res.json({ available: isIdentifierAvailable });
    } catch (err) {
        next(err);
    }
}

export const refreshToken: RequestHandler = async (req, res, next) => {
    try {
        const { roleData } = req;
        if (!roleData) {
            throw new Error("Failed to authenticate user");
        }
        const { role, data } = roleData;
        
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            res.status(401).json({ message: "No refresh token provided" });
            return;
        }

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
                const newRefreshToken = await orm.RefreshToken.create({ user_id: data.user_id }, { transaction });
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
        const { identifierType, identifierValue } = req.body as { identifierType: 'phone' | 'email'; identifierValue: string; };

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString().padStart(6, "0");
        const otpKey = `otp:${identifierValue}`;
        console.log("Generated OTP: ", otp);    // Debugging

        // Store OTP in Redis (expires in 5 minutes)
        await redisClient!.setex(otpKey, 5 * 60, otp);

        // Send OTP via SMS or Email
        if (identifierType === 'phone') {
            await sendSMSOTP(identifierValue, otp);
        } else if (identifierType === 'email') {
            await sendEmailOTP(identifierValue, otp);
        }

        res.status(201).json({ message: "OTP successfully sent" });
    } catch (err) {
        next(err);
    }
}

export const verifyOTP: RequestHandler = async (req, res, next) => {
    try {
        const { otp, identifierType, identifierValue } = req.body;

        // Check OTP in redis
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

        const otpData = req.otpData;
        if (!otpData) throw new Error('Request did not properly include OTP token');
        if (otpData.identifierType !== 'phone') {
            res.status(403).json({ message: "Registration requires phone number" });
            return;
        }

        const isUserRegistered = await orm.User.count({
            where: { phone: otpData.identifierValue }
        }) !== 0;
        if (isUserRegistered) {
            res.status(401).json({ message: "User is already registered" });
            return;
        }

        const transaction = await orm.sequelize.transaction();
        try {
            // Create User
            const user = await orm.User.create({
                firstName,
                lastName,
                phone: otpData.identifierValue
            }, { transaction });

            // Create password
            await user.createPassword({
                password
            }, { transaction });
            
            // Commit transactions if all create operations succeed
            await transaction.commit();

            res.status(201).json({ message: "User successfully registered" });
        } catch (err) {
            // Rollback transactions if any operations fail
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        next(err);
    }
}

export const registerCoordinator: RequestHandler = async (req, res, next) => {
    try {
        const otpData = req.otpData;
        if (!otpData) throw new Error('Request did not properly include OTP token');
        if (otpData.identifierType !== 'phone') {
            res.status(403).json({ message: "Registration requires phone number" });
            return;
        }

        // Find user by contact method
        const user = await orm.User.findOne({
            where: { phone: otpData.identifierValue },
            include: [{
                model: orm.Coordinator,
                as: 'coordinator'
            }]
        });
        if (!user) {
            res.status(404).json({ message: "User could not be found" });
            return;
        } else if ((user as any).coordinator) {
            res.status(401).json({ message: "User is already registered as a coordinator" });
            return;
        }
        
        const roleData = await user.createCoordinator();
        req.roleData = {
            role: 'coordinator',
            data: roleData
        }

        // Remove registration otp token from request header
        res.removeHeader('x-otp-token');

        login(req, res, next);
    } catch (err) {
        next(err);
    }
}

export const registerWorker: RequestHandler = async (req, res, next) => {
    try {
        const otpData = req.otpData;
        if (!otpData) throw new Error('Request did not properly include OTP token');
        if (otpData.identifierType !== 'phone') {
            res.status(403).json({ message: "Registration requires phone number" });
            return;
        }

        // Find user by contact method
        const user = await orm.User.findOne({
            where: { phone: otpData.identifierValue },
            include: [{
                model: orm.Worker,
                as: 'worker'
            }]
        });
        if (!user) {
            res.status(404).json({ message: "User could not be found" });
            return;
        } else if ((user as any).worker) {
            res.status(401).json({ message: "User is already registered as a worker" });
            return;
        }

        const roleData = await user.createWorker();
        req.roleData = {
            role: 'worker',
            data: roleData
        }

        // Remove otp token header
        res.removeHeader('x-otp-token');

        login(req, res, next);
    } catch (err) {
        next(err);
    }
}