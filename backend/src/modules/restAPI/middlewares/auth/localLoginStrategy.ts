import { PassportStatic } from "passport";
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from "passport-local";
import { Request } from "express";

import orm from "../../../../models/sequelize";

// Local Strategy for login authentication
export default function(passport: PassportStatic) {
    passport.use('local-login', new Strategy({
        usernameField: 'identifier',
        passwordField: 'password',
        passReqToCallback: true
    } as IStrategyOptionsWithRequest,
    async function(req: Request, identifier: string, password: string, done: any) {
        try {
            // Either phone/email
            const { identifierType } = req.body;

            // Retrieve verified contact method 
            const contactMethod = await orm.ContactMethod.findOne({
                where: {
                    type: identifierType,
                    value: identifier
                }
            });
            // Indicate error if no user is registered with given credentials
            if (!contactMethod) return done(null, false, "USER_NOT_FOUND");
            const userId = contactMethod.userId;

            // Retrieve the active password associated with the user
            const activePassword = await orm.Password.findOne({
                where: { userId, isActive: true }
            });
            // Indicate error if no active password exists
            if (!activePassword) return done(null, false, "PASSWORD_NOT_SET");

            // Check if the password given by the user matches the active password
            const validPassword = await activePassword.validatePassword(password);
            if (!validPassword) {
                const maxConsecutiveAttempts = 5;
                const latestAttempts = await orm.LoginAttempt.findAll({
                    where: { userId },
                    limit: 4,
                    order: [['createdAt', 'DESC']]
                });
                const incorrectPasswordAttempts = latestAttempts.filter(
                    (attempt) => attempt.failureReason === "INCORRECT_PASSWORD"
                );
                // If all 5 attempts, including current attempt, failed due to "INCORRECT_PASSWORD", deactivate password
                if (incorrectPasswordAttempts.length + 1 === maxConsecutiveAttempts) {
                    await activePassword.update({ isActive: false });
                }
                // Indicate the error to the callback fn
                return done(null, userId, "INCORRECT_PASSWORD");
            }
            // Return the user to the callback fn
            done(null, userId);
        } catch (err) {
            done(err);
        }
    } as VerifyFunctionWithRequest));
}

// Last Here: Implementing OTP