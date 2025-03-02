import { PassportStatic } from "passport";
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from "passport-local";
import { Request } from "express";
import UAParser from "ua-parser-js";

import orm from "../../../../models";

// Local Strategy for login authentication
export default function(passport: PassportStatic) {
    passport.use('local-login', new Strategy({
        usernameField: 'identifier',
        passwordField: 'password',
        passReqToCallback: true
    } as IStrategyOptionsWithRequest,
    async function(req: Request, identifier: string, password: string, done: any) {
        try {
            const { identifierType } = req.params;
            const retrievedUser = await orm.User.findOne({
                where: { [identifierType]: identifier }
            });
            if (!retrievedUser) return done(null, false, "User does not exist");

            const prohibitReason = await orm.LoginAttempt.prohibitLogin(retrievedUser.id);
            if (prohibitReason) return done(null, false, prohibitReason);

            const activePassword = await orm.Password.findOne({
                where: {
                    userId: retrievedUser.id,
                    isActive: true
                }
            });
            if (!activePassword) return done(null, false, "Password not set");

            const validPassword = await activePassword.validatePassword(password);

            if (!validPassword) {
                // Last Here: Implementing LoginAttempts
                return done(null, false, "Incorrect password");
            }

            done(null, retrievedUser);
        } catch (err) {
            done(err);
        }
    } as VerifyFunctionWithRequest));
}