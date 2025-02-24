import { RequestHandler, Request, Response, NextFunction } from "express";
import db from "../models";
import { sendSMS } from "../../../services/sms.service";

export const firstStep: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phoneNumber } = req.body;
        const isPhoneTaken = await db.User.count({
            where: { phone: phoneNumber }
        })
        .then(count => count !== 0);

        if (isPhoneTaken) {
            res.status(409).send({ message: "Phone number is already taken." });
            return;
        }

        res.status(204).send();
        return;
    } catch (err) {
        next(err);
    }
}