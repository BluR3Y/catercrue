import { PassportStatic } from "passport";
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from "passport-local";
import { Request } from "express";

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
            if (!retrievedUser) return done(null, null, { message: "User does not exist" });

            const activePassword = await orm.Password.findOne({
                where: {
                    userId: retrievedUser.id,
                    isActive: true
                }
            });
            if (!activePassword) return done(null, null, { message: "Password not set." });

            const validPassword = await activePassword.validatePassword(password);

            if (!validPassword) {
                // Future feature: Check num invalid attempts and deactivate password
                return done(null, null, { message: "Incorrect password" });
            }

            done(null, retrievedUser);
        } catch (err) {
            done(err);
        }
    } as VerifyFunctionWithRequest));
}