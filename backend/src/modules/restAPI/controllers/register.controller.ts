import { RequestHandler, Request, Response, NextFunction } from "express";
import orm from "../../../models";

// export const getPhoneAvailability: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { phoneNumber } = req.params;
//         const isPhoneAvailable = await orm.User.count({
//             where: { phone: phoneNumber }
//         })
//         .then(count => count === 0)

//         res.json({ available: isPhoneAvailable });
//     } catch (err) {
//         next(err);
//     }
// }

export const identifierAvailability: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const register: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            password
        } = req.body;
        
        const transaction = await orm.sequelize.transaction();

        try {
            const user = await orm.User.create({
                firstName,
                lastName,
                phone: phoneNumber,
                email
            }, { transaction });
            await orm.Password.create({
                userId: user.id,
                password
            }, { transaction });

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