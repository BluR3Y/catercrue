import { RequestHandler, Request, Response, NextFunction } from "express";
import orm from "../../../models";
import { login } from "./auth.controller";

export const identifierAvailability: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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