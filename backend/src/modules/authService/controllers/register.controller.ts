import { RequestHandler, Request, Response, NextFunction } from "express";
import db from "../models";

export const getPhoneAvailability: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.params;
        const isPhoneAvailable = await db.User.count({
            where: { phone: phoneNumber }
        })
        .then(count => count === 0)

        res.json({ available: isPhoneAvailable });
    } catch (err) {
        next(err);
    }
}

export const postFirstStep: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password
        } = req.body;

        const transaction = await db.sequelize.transaction();

        try {
            const user = await db.User.create({
                firstName,
                lastName,
                phone: phoneNumber,
                email
            }, { transaction });
            await db.Password.create({
                userId: user.id,
                password
            });

            // Commit transaction if both create operations succeed
            await transaction.commit();

            // ** Missing login logic
        } catch (err) {
            // Rollback transactio if any operation fails
            await transaction.rollback();
            throw err;
        }
    } catch (err) {
        next(err);
    }
}