import { Request, Response, NextFunction, Application } from "express";
import requestIp from "request-ip";
import useragent from "express-useragent";
import passport from "passport";
import { UAParser } from "ua-parser-js";

import { orm } from "@/models";

// Import Auth Strategies
import localStrategy from "./local.strategy";
import jwtStrategy from "./jwt.strategy";
import googleStrategy from "./google.strategy";

// Configure passport authentication middleware
export const passportAuthMiddleware = (app: Application) => {
    // Install Auth related middlewares

    // Capture client IP
    app.use(requestIp.mw());
    // Capture client User-Agent
    app.use(useragent.express());

    // Initialize Passport.js
    app.use(passport.initialize());

    // Install Auth Strategies
    jwtStrategy(passport);
    localStrategy(passport);
    googleStrategy(passport);
}

const standardErr = { message: "Unauthorized Request", code: "UNAUTHORIZED" };

const authenticateStrategyCallback = (req: Request, res: Response, next: NextFunction) => {
    return async (err: string | null, user: string | null, info: { message: string; name: string } | null) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: info?.message || standardErr.message, code: info?.name || standardErr.code });

        try {
            const userAgent = req.useragent;
            // Device related data
            // const uaparser = UAParser(userAgent?.source);
            const clientIp = req.clientIp;
            await orm.LoginAttempt.create({
                user_id: user,
                ipAddress: clientIp ?? "Unknown",
                userAgent: userAgent?.source ?? "Unknown",
                validation: !info,
                failureReason: info?.name
            });

            if (user && info) return res.status(401).json({ message: info.message, code: info.name });

            const userData = await orm.User.findByPk(user);
            if (!userData) return next(new Error(`Authenticated user not found; ${user}`));

            next();
        } catch (err) {
            next(err);
        }
    }
}

export const rbac = (allowedRoles: string[] = []) => {
    const roleMap: Record<string, any> = {
        vendor: orm.Vendor,
        worker: orm.Worker
    }
    return async (req: Request, res: Response, next: NextFunction) => {
        authenticate.jwt(async (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: info?.message || standardErr.message, code: info?.name || standardErr.code });

            const { role, roleId } = user;
            if (allowedRoles.length && !allowedRoles.includes(role)) {
                return res.status(403).json(standardErr);
            }

            const roleModel = roleMap[role];
            if (!roleModel) {
                return next(new Error(`Token included invalid type: ${role} with ID: ${roleId}`));
            }

            try {
                const roleData = await roleModel.findByPk(roleId);
                if (!roleData) {
                    return next(new Error(`Could not find record for role: ${roleId}`));
                }
                req.roleData = {
                    role,
                    data: roleData
                }
                next();
            } catch (err) {
                next(err);
            }
        })(req, res, next);
    }
}

// Pass through the Auth routes
export const authenticate = {
    // IndentifierType & IndentifierValue (Local Login)
    local: async (req: Request, res: Response, next: NextFunction) => {
        return passport.authenticate('local-login', authenticateStrategyCallback(req, res, next))(req, res, next);
    },
    // Google Oauth2
    google: async (req: Request, res: Response, next: NextFunction) => {
        return passport.authenticate('google-oauth', { scope: ["profile", "email"] }, authenticateStrategyCallback(req, res, next))(req, res, next);
    },
    // JWT Auth Wrapper 
    jwt: (
        cb: (err: string | null, user: { role: 'vendor' | 'worker'; roleId: string } | null, info: { message: string; name: string } | null) => void
    ) => {
        return (req: Request, res: Response, next: NextFunction) => {
            return passport.authenticate('jwt', (err : any, user: any, info : any) => cb(err, user, info))(req, res, next);
        }
    }
}