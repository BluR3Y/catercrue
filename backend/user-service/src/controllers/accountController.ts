import { NextFunction, Request, Response } from "express";
import db from "../models";
import { authenticate, blacklistToken, generateJWToken } from "../utils/auth";
import AppError from "../utils/appError";

export const login = authenticate.localLogin;

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const refreshToken = await db.RefreshToken.findOne({ where: { userId: userId } });
        await refreshToken?.destroy();

        const accessToken = req.headers['authorization']!.split(' ')[1];
        await blacklistToken(accessToken);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            
        } = req.body;

        const user = await db.User.create({
            name: 'rey',
            email: 'rey@gmail.com',
            password: await db.User.hashPassword('password@1234')
        });
        user.save()
        
        throw 'lol'
    } catch (err) {
        next(err);
    }
}

// Modify: Implement access token blacklisting
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken: requestToken } = req.body;
    if (!requestToken) {
        throw new AppError(403, 'Forbidden', 'Refresh token is required');
    }
    try {
        // Retrieve the token from the db
        let refreshToken = await db.RefreshToken.findOne({
            where: { token: requestToken }
        });
        // Check if the token exists in the db
        if (!refreshToken) {
            throw new AppError(403, 'Forbidden', 'Invalid refresh token');
        }
        // Check if the token is expired
        if (refreshToken.expiry < new Date()) {
            // Delete the token from the db
            await refreshToken.destroy();
            throw new AppError(403, 'Forbidden', 'Refresh token was expired');
        }

        // Retrieve the user based on the ownership of the token
        const user = await db.User.findOne({
            where: { id: refreshToken.userId },
            attributes: { exclude: ['password'] }
        });
        // Check if the user exists in the db
        if (!user) {
            throw new AppError(404, 'Not Found', 'User not found');
        }

        // Check if the refresh token is about to expire
        if (refreshToken.expiry.getTime() < new Date().getTime() + (5 * 60 * 1000)) {
            // Delete the token from the db
            await refreshToken.destroy();

            // Create a new refresh token
            refreshToken = await db.RefreshToken.create({ userId: user.id });
        }

        // Blacklist the access token used to make the request
        const accessToken = req.headers['authorization']!.split(' ')[1];
        await blacklistToken(accessToken);

        res.status(200).json({
            accessToken: generateJWToken({ id: user.id }),
            refreshToken: refreshToken.token
        });
    } catch (err) {
        next(err);
    }
}