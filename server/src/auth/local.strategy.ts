import { PassportStatic } from "passport";
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from "passport-local";
import { Request } from "express";

import { orm } from "@/models";

// Local Strategy for login authentication
export default function(passport: PassportStatic) {
    passport.use('local-login', new Strategy({
        usernameField: 'identifierValue',
        passwordField: 'password',
        passReqToCallback: true
    } as IStrategyOptionsWithRequest,
    async function(req: Request, identifierValue: string, password: string, done: any) {
        try {
            const { identifierType, role } = req.body as { identifierType: 'phone' | 'email'; role: 'vendor' | 'worker' };

            // Retrieve verified contact method 
            const contactMethod = await orm.ContactMethod.findOne({
                where: {
                    type: identifierType,
                    value: identifierValue
                }
            });
            // Indicate error if no user is registered with given credentials
            if (!contactMethod) return done(null, false, { message: "User not found", name: "USER_NOT_FOUND" });
            const userId = contactMethod.user_id;

            // Retrieve the active password associated with the user
            const activePassword = await orm.Password.findOne({
                where: { user_id: userId, isActive: true }
            });
            // Indicate error if no active password exists
            if (!activePassword) return done(null, false, { message: "Password is not set", name: "PASSWORD_NOT_SET" });

            // Check if the password given by the user matches the active password
            const validPassword = await activePassword.validatePassword(password);
            if (!validPassword) {
                return done(null, userId, { message: "Invalid password", name: "INCORRECT_PASSWORD" });
            }

            done(null, { role, userId });
        } catch (err) {
            done(err);
        }
    } as VerifyFunctionWithRequest));
}