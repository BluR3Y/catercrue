import passport, { PassportStatic } from "passport";
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from "passport-local";
import { Request } from "express";
import { Op } from "sequelize";

import db from "../../models";

// Logcal strategy for login
export default function(passport: PassportStatic) {
    passport.use('local-login', new Strategy({
        usernameField: 'identifier',
        passwordField: 'password',
        passReqToCallback: true,
    } as IStrategyOptionsWithRequest,
    async function(req: Request, identifier: string, password: string, done: any) {
        const retrievedUser = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });

        if (!retrievedUser) {
            return done("User does not exist");
        }
        
        const activePassword = await db.Password.findOne({
            where: {
                userId: retrievedUser.id,
                isActive: true
            }
        });

        if (! await activePassword!.validatePassword(password)) {
            return done("Invalid credentials");
        }

        done(null, retrievedUser);
    } as VerifyFunctionWithRequest));
}