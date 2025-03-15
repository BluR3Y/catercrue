import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { PassportStatic } from "passport";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest, VerifiedCallback, VerifyCallbackWithRequest } from "passport-jwt";
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
                return done(null, false, { message: "Token is blacklisted", name: "UNAUTHORIZED" });
            }

            done(null, payload);
        } catch (err: any) {
            if (err.name === "TokenExpiredError") return done(null, false, { message: "Token expired", name: "UNAUTHORIZED" });
            if (err.name === "JsonWebTokenError") return done(null, false, { message: "Invalid token provided", name: "UNAUTHENTICATED" });
            done(err);
        }
    } as VerifyCallbackWithRequest));
}