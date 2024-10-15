import { NextFunction, Request, Response } from "express";
import db from "../models";
import { authenticate, blacklistToken, generateJWToken } from "../auth";
import AppError from "../utils/appError";


export const login = authenticate.localLogin;

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const refreshToken = await db.RefreshToken.findOne({
            where: { userId }
        });
        if (!refreshToken) {
            throw new AppError(403, 'Forbidden', 'User does not have an active session');
        }

        await refreshToken.destroy();

        const accessToken = req.headers['authorization']!.split(' ')[1];
        await blacklistToken(accessToken);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, accessToken } = (req as any);
        // Extract refresh token from request body
        const { refreshToken } = req.body;
        // If the request didn't include a refresh token:
        if (!refreshToken) {
            // Throw an error with a code 403
            throw new AppError(403, 'Forbidden', 'Refresh token is required');
        }

        // Retrieve refresh token information from the database
        let rtData = await db.RefreshToken.findOne({
            where: { userId, token: refreshToken }
        });
        // If the token can't be retrieved:
        if (!rtData) {
            // Throw an error with a code 403
            throw new AppError(403, 'Forbidden', 'Invalid Refresh Token');
        }

        // Check if the refresh token is expired
        if (rtData.expiry < new Date()) {
            // Delete token from the database
            await rtData.destroy();
            throw new AppError(403, 'Forbidden', 'Refresh token was expired');
        }
        // Check for imminent expiry (within 5 minutes)
        if (rtData.expiry.getTime() < new Date().getTime() + (5 * 60 * 1000)) {
            // Generate a new refresh token
            const newRefreshToken = await db.RefreshToken.create({ userId });
            // Remove the expiring token from the database
            await rtData.destroy();
            // Assign the new token
            rtData = newRefreshToken;
        }

        // Blacklist the access token used to make the request
        await blacklistToken(accessToken);

        res.status(200).json({
            accessToken: generateJWToken({ userId }),   // Generate a new access token
            refreshToken: rtData.token
        });
    } catch (err) {
        next(err);
    }
}