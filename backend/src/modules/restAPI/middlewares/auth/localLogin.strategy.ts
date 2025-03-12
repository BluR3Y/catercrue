import { PassportStatic } from "passport";
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from "passport-local";
import { Request } from "express";

import { orm, odm } from "@/models";

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
            const { identifierType, role } = req.body;

            // Retrieve verified contact method 
            const contactMethod = await orm.ContactMethod.findOne({
                where: {
                    type: identifierType,
                    value: identifier
                }
            });
            // Indicate error if no user is registered with given credentials
            if (!contactMethod) return done(null, false, { message: "User not found", code: "USER_NOT_FOUND" });
            const userId = contactMethod.userId;

            // Retrieve the record of the user from the table of the selected role
            let roleData = null;
            if (role === 'coordinator') {
                roleData = await odm.coordinatorModel.findOne({ userId });
            } else if (role === 'worker') {
                roleData = await odm.workerModel.findOne({ userId });
            }

            if (!roleData) return done(null, false, { message: "User is not registered for role", code: "UNREGISTERED_ROLE" });

            // Retrieve the active password associated with the user
            const activePassword = await orm.Password.findOne({
                where: { userId, isActive: true }
            });
            // Indicate error if no active password exists
            if (!activePassword) return done(null, false, { message: "Password is not set", code: "PASSWORD_NOT_SET" });

            // Check if the password given by the user matches the active password
            const validPassword = await activePassword.validatePassword(password);
            if (!validPassword) {
                return done(null, {userId, role, roleId: roleData.id}, { message: "Invalid password", code: "INCORRECT_PASSWORD" });
            }

            done(null, { userId, role, roleId: roleData.id });
        } catch (err) {
            done(err);
        }
    } as VerifyFunctionWithRequest));
}