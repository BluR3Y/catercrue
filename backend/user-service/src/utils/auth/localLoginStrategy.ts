import passport, { PassportStatic } from 'passport';
import { IStrategyOptionsWithRequest, Strategy, VerifyFunctionWithRequest } from 'passport-local';
import { Op, where } from 'sequelize';

import User from '../../models/user.model';
import { Request } from 'express';
import AppError from '../appError';


// Local strategy for login
export default function(passport: PassportStatic) {
    passport.use('local-login', new Strategy({
        usernameField: 'identifier',
        passwordField: 'password',
        passReqToCallback: true
    } as IStrategyOptionsWithRequest,
    async function(req: Request, identifier: string, password: string, done: any) {
        // Modify for password validation
        const retrievedUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { phone: identifier }
                ]
            }
        });
        
        if (retrievedUser === null) {
            return done(new AppError(404, 'NOT_FOUND', 'User does not exist'));
        } else if (!await retrievedUser.validatePassword(password)) {
            return done(new AppError(401, 'FORBIDDEN', 'Invalid credentials'));
        }
        done(null, retrievedUser);
    } as VerifyFunctionWithRequest));
}