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
        const { refreshToken } = req.body;
        const userId = (req as any).userId;
        if (!refreshToken) {
            throw new AppError(403, 'Forbidden', 'Refresh token is required');
        }

        let activeToken = await db.RefreshToken.findOne({
            where: { userId, token: refreshToken }
        });
        if (!activeToken) {
            throw new AppError(403, 'Forbidden', 'Invalid Refresh Token');
        }

        // Check if the refresh token is expired
        if (activeToken.expiry < new Date()) {
            // Delete token from the database
            await activeToken.destroy();
            throw new AppError(403, 'Forbidden', 'Refresh token was expired');
        }
        // Check if the refresh token is about to expire
        if (activeToken.expiry.getTime() < new Date().getTime() + (5 * 60 * 1000)) {
            // Delete the token nearing its experation
            await activeToken.destroy();

            activeToken = await db.RefreshToken.create({ userId });
        }

        // Blacklist the access token used to make the request
        const accessToken = req.headers['authorization']!.split(' ')[1];
        await blacklistToken(accessToken);

        res.status(200).json({
            accessToken: generateJWToken({ userId }),
            refreshToken: activeToken.token
        });
    } catch (err) {
        next(err);
    }
}