import { PassportStatic } from "passport";
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from "passport-local";
import { Request } from "express";

import { orm, odm } from "@/models";

// Local Strategy for login authentication
export default function(passport: PassportStatic) {
    passport.use('local-login', new Strategy({
        usernameField: 'identifierValue',
        passwordField: 'password',
        passReqToCallback: true
    } as IStrategyOptionsWithRequest,
    async function(req: Request, identifierValue: string, password: string, done: any) {
        try {
            const { identifierType, role } = req.body as { identifierType: 'phone' | 'email'; role: 'caterer' | 'worker' };

            // Retrieve verified contact method 
            const contactMethod = await orm.ContactMethod.findOne({
                where: {
                    type: identifierType,
                    value: identifierValue
                }
            });
            // Indicate error if no user is registered with given credentials
            if (!contactMethod) return done(null, false, { message: "User not found", code: "USER_NOT_FOUND" });
            const userId = contactMethod.userId;

            // Retrieve the active password associated with the user
            const activePassword = await orm.Password.findOne({
                where: { userId, isActive: true }
            });
            // Indicate error if no active password exists
            if (!activePassword) return done(null, false, { message: "Password is not set", code: "PASSWORD_NOT_SET" });

            // Check if the password given by the user matches the active password
            const validPassword = await activePassword.validatePassword(password);
            if (!validPassword) {
                return done(null, userId, { message: "Invalid password", code: "INCORRECT_PASSWORD" });
            }

            let roleData;
            if (role === 'caterer') {
                roleData = await odm.catererModel.findOne({ userId });
            } else if (role === 'worker') {
                roleData = await odm.workerModel.findOne({ userId });
            }
            if (!roleData) return done(null, userId, { message: "User is not registed for role", code: "UNREGISTERED_ROLE" });

            req.roleData = {
                role,
                data: roleData
            } as any;

            done(null, userId);
        } catch (err) {
            done(err);
        }
    } as VerifyFunctionWithRequest));
}