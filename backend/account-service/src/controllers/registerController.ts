import { NextFunction, Request, Response } from "express";
import db from "../models";
import { authenticate, blacklistToken, generateJWToken } from "../auth";
import AppError from "../utils/appError";
import { decode } from "jsonwebtoken";
import { generateOneTimePassword } from "../utils/otp";


export const registrationIdentifier = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifierType, identifierValue } = req.body;
        if (!identifierType || !identifierValue) {
            throw new AppError(400, 'Bad Request', 'Request missing essential fields');
        }
        if (identifierType !== 'phone' && identifierType !== 'email') {
            throw new AppError(400, 'Bad Request', 'Invalid Identifier Type');
        }
        
        const countResult = await db.User.count({ where: { [identifierType]: identifierValue } });
        if (countResult) {
            throw new AppError(409, 'Conflict', 'User already exists');
        }

        const opt = await generateOneTimePassword(JSON.stringify({ identifierType, identifierValue }));
        // Last Here

        // Missing: Logic to send notification to email | phone with activation code

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export const registrationVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { verificationCode } = req.body;
        if (!verificationCode) {
            throw new AppError(400, 'Bad Request', 'Request missing verification code');
        }
        

    } catch (err) {
        next(err);
    }
}