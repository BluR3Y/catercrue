import { Request } from "express";
import { PassportStatic } from "passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest, VerifiedCallback, VerifyCallbackWithRequest } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";
// import orm from "../../../../models/sequelize";
import { odm } from "@/models";
import { isBlackListed } from "@/utils/manageJWT";

export default function(passport: PassportStatic) {
    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_KEY,
        passReqToCallback: true
    } as StrategyOptionsWithRequest,
    async function(req: Request, payload: JwtPayload, done: VerifiedCallback) {
        try {
            // Extract token from 'authorization' header in the request
            const token = req.headers['authorization']!.split(' ')[1];

            // Check if token is blacklisted
            if (await isBlackListed(token)) {
                return done(null, false, "Token is blacklisted");
            }

            done(null, payload);
        } catch (err: any) {
            if (err.name === "TokenExpiredError") return done(null, false, "Token expired");
            if (err.name === "JsonWebTokenError") return done(null, false, "Invalid Token");
            done(err);
        }
    } as VerifyCallbackWithRequest));
}