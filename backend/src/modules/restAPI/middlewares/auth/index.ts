import passport from "passport";
import { Application } from "express";
import requestIp from "request-ip";
import useragent from "express-useragent";
import { Request, Response, NextFunction, RequestHandler } from "express";

// Import Auth Strategies
import localLoginStrategy from "./localLoginStrategy";
import jwtStrategy from "./jwtStrategy";
import User from "../../../../models/user.model";
import orm from "../../../../models";
import { UAParser } from "ua-parser-js";

// Configure passport authentication middleware
export const passportAuthenticationMiddleware = (app: Application) => {
    // Install Auth related middlewares
    app.use(requestIp.mw());    // Capture IP
    app.use(useragent.express());   // Capture User-Agent

    // Install Auth Strategies
    localLoginStrategy(passport);
    jwtStrategy(passport);

    // Initialize Passport.js
    app.use(passport.initialize());
}

// Callback that handles custom error messages
const authStrategyCallback = (req: Request, res: Response, next: NextFunction) => {
    return async (err: string | null, user: User | false, info: string | null) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info || 'unauthorized' });
        
        const userAgent = req.useragent;
        // Device related data
        // const uaparser = UAParser(userAgent?.source);
        const clientIp = req.clientIp;
        await orm.LoginAttempt.create({
            userId: user.id,
            ipAddress: clientIp!,
            userAgent: userAgent!.source,
            validation: !info,
            failureReason: info
        });

        if (user && info) return res.status(401).json({ message: info });

        req.user = user;
        next();
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
    }
}