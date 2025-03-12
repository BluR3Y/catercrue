import passport from "passport";
import { Application, RequestHandler } from "express";
import requestIp from "request-ip";
import useragent from "express-useragent";
import { Request, Response, NextFunction } from "express";
import { UAParser } from "ua-parser-js";
import { odm, orm } from "@/models";

// Import Auth Strategies
import localLoginStrategy from "./localLogin.strategy";
import jwtStrategy from "./jwt.strategy";
import googleStrategy from "./google.strategy";

// Configure passport authentication middleware
export const passportAuthenticationMiddleware = (app: Application) => {
    // Install Auth related middlewares
    app.use(requestIp.mw());    // Capture IP
    app.use(useragent.express());   // Capture User-Agent

    // Install Auth Strategies
    localLoginStrategy(passport);
    jwtStrategy(passport);
    googleStrategy(passport);

    // Initialize Passport.js
    app.use(passport.initialize());
}

// Callback that handles custom error messages
const authStrategyCallback = (req: Request, res: Response, next: NextFunction) => {
    return async (err: string | null, user: string | null, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(info ? info : { message: 'unauthorized request', code: 'UNAUTHORIZED' });

        try {
            const userAgent = req.useragent;
            // Device related data
            // const uaparser = UAParser(userAgent?.source);
            const clientIp = req.clientIp;
            await orm.LoginAttempt.create({
                userId: user,
                ipAddress: clientIp!,
                userAgent: userAgent!.source,
                validation: !info,
                failureReason: info.code
            });

            if (user && info) return res.status(401).json(info);

            const userData = await orm.User.findByPk(user);
            if (!userData) return next(new Error(`Authenticated user not found; ${user}`));

            const role: 'coordinator' | 'worker' = req.body.role!;
            let roleData;
            if (role === "coordinator") {
                roleData = await odm.coordinatorModel.findOne({ userId: user });
            } else if (role === "worker") {
                roleData = await odm.workerModel.findOne({ userId: user });
            }

            if (!roleData) {
                res.status(403).json({ message: "User is not registered for role", code: "UNREGISTERED_ROLE" });
                return;
            }

            req.roleData = {
                role,
                data: roleData
            } as any;

            next();
        } catch (err) {
            next(err);
        }
    }
}

// Pass through the Auth routes
export const authenticate = {
    // Email/Phone & Password (Local Login)
    localLogin: async function(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate('local-login', authStrategyCallback(req, res, next))(req, res, next);
    },
    // JWT
    jwt: async function(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate('jwt', authStrategyCallback(req, res, next))(req, res, next);
    },
    google: async function(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate('google-oauth', { scope: ["profile", "email"] }, authStrategyCallback(req, res, next))(req, res, next);
    }
};