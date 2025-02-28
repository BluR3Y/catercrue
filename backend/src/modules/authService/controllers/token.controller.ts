import { RequestHandler, Request, Response, NextFunction } from "express";
import db from "../models";
import { blacklistToken, generateJWT } from "../../../utils/manageJWT";

// Request Handler that generates a new access token
export const postRefreshToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as any;
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(403).send({ message: "Refresh token is required" });
            return;
        }

        // Retrieve refresh token information from db
        let rtData = await db.RefreshToken.findByPk(refreshToken);

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
            const transaction = await db.sequelize.transaction();
            try {
                // Generate a new refresh token
                const newRefreshToken = await db.RefreshToken.create({ userId: user.id });
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