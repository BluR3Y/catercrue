import { NextFunction, Request, Response } from "express";
import db from "../models";
import { authenticate, blacklistToken, generateJWToken } from "../utils/auth";
import AppError from "../utils/appError";

export const login = authenticate.localLogin;

// export const logout = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const userId = (req as any).userId;
//         // const refreshToken = await db.RefreshToken.findOne({ where: { userId: userId } });
//         // await refreshToken?.destroy();

//         // const accessToken = req.headers['authorization']!.split(' ')[1];
//         // await blacklistToken(accessToken);

//         res.status(204).send();
//     } catch (err) {
//         next(err);
//     }
// }

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const deviceData = await db.Device.findOne({
    //         where: { userId: (req as any).userId, ipAddress: req.ip }
    //     });
    //     if (!deviceData) {
    //         throw new AppError()
    //     }
    //     // Last Here
    //     const rtData = await db.RefreshToken.findOne({
    //         where: { deviceId: deviceData.id }
    //     });

    // } catch (err) {
    //     next(err);
    // }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //     const { refreshToken } = req.body;
    //     if (!refreshToken) {
    //         throw new AppError(403, 'Forbidden', 'Refresh token is required');
    //     }
    //     // Retrieve the device associated with the client's ip address
    //     const deviceData = await Device.findOne({
    //         where: { userId: (req as any).userId, ipAddress: req.ip }
    //     });
    //     if (!deviceData) {
    //         throw new AppError(403, 'Forbidden', 'No token associated with device');
    //     }

    //     // Retrieve the token from the db
    //     let rtData = await db.RefreshToken.findOne({
    //         where: {
    //             token: refreshToken,
    //             deviceId: deviceData.id
    //         }
    //     });
    //     // Check if the token exists in the db
    //     if (!rtData) {
    //         throw new AppError(403, 'Forbidden', 'Invalid refresh token');
    //     }
    //     // Check if the refresh token is expired
    //     if (rtData.expiry < new Date()) {
    //         // Delete token from the db
    //         await rtData.destroy();
    //         throw new AppError(403, 'Forbidden', 'Refresh token was expired');
    //     }
    //     // Check if the refresh token is about to expire
    //     if (rtData.expiry.getTime() < new Date().getTime() + (5 * 60 * 1000)) {
    //         // Delete the token from the db
    //         await rtData.destroy();

    //         // Create a new refresh token
    //         rtData = await db.RefreshToken.create({ deviceId: deviceData.id });
    //     }

    //     // Blacklist the access token used to make the request
    //     const accessToken = req.headers['authorization']!.split(' ')[1];
    //     await blacklistToken(accessToken, deviceData.id);

    //     res.status(200).json({
    //         accessToken: generateJWToken({ id: (req as any).userId }),
    //         refreshToken: rtData.token
    //     });
    // } catch (err) {
    //     next(err);
    // }
}