import passport from "passport";
import { Application } from "express";
import requestIp from "request-ip";
import useragent from "express-useragent";
import { Request, Response, NextFunction } from "express";
import { UAParser } from "ua-parser-js";
import { orm } from "@/models";

// Import Auth Strategies
import localLoginStrategy from "./localLogin.strategy";
import jwtStrategy from "./jwt.strategy";
// import googleStrategy from "./google.strategy";

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
    return async (err: string | null, user: any, info: any) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(info ? info : { message: 'unauthorized request', code: 'UNAUTHORIZED' });
        
        const userAgent = req.useragent;
        // Device related data
        // const uaparser = UAParser(userAgent?.source);
        const clientIp = req.clientIp;
        await orm.LoginAttempt.create({
            userId: user.userId,
            ipAddress: clientIp!,
            userAgent: userAgent!.source,
            validation: !info,
            failureReason: info.code
        });

        if (user && info) return res.status(401).json({ message: info });

        const userData = await orm.User.findByPk(user.userId);
        if (!userData) return next(new Error(`Authenticated user not found: ${user}`));

        req.user = userData;
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