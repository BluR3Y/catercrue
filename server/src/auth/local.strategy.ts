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
            const {
                identifierType
            } = req.body as {
                identifierType: 'phone' | 'email';
            };

            // Retrieve user by contact method
            const user = await orm.User.findOne({
                where: { [identifierType]: identifierValue },
                include: [{
                    model: orm.Password,
                    as: 'password',
                    where: { isActive: true }
                }]
            }) as any;
            // Indicate error if no user is registered with given credentials
            if (!user) return done(null, false, { message: "User not found", name: "USER_NOT_FOUND" });
            // Indicate error if no active password exists
            if (!user.password) return done(null, false, { message: "Password is not set", name: "PASSWORD_NOT_SET" });

            // Check if the password attempt matches the active password
            const validPassword = await user.password.validatePassword(password);
            if (!validPassword) {
                return done(null, user, { message: "Invalid password", name: "INCORRECT_PASSWORD" });
            }
            done(null, user);
        } catch (err) {
            done(err);
        }
    } as VerifyFunctionWithRequest));
}