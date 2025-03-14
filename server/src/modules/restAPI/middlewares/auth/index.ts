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
import { RoleData } from "@/types/express";

// Configure passport authentication middleware
export const passportAuthenticationMiddleware = (app: Application) => {
    // Install Auth related middlewares
    app.use(requestIp.mw());    // Capture IP
    app.use(useragent.express());   // Capture User-Agent

    // Initialize Passport.js
    app.use(passport.initialize());

    // Install Auth Strategies
    localLoginStrategy(passport);
    jwtStrategy(passport);
    googleStrategy(passport);
}

const authenticateStrategyCallback = (req: Request, res: Response, next: NextFunction) => {
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
                ipAddress: clientIp ?? "Unknown",
                userAgent: userAgent?.source ?? "Unknown",
                validation: !info,
                failureReason: info?.code
            });

            if (user && info) return res.status(401).json(info);

            const userData = await orm.User.findByPk(user);
            if (!userData) return next(new Error(`Authenticated user not found; ${user}`));

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
        return passport.authenticate('local-login', authenticateStrategyCallback(req, res, next))(req, res, next);
    },
    // Google Oauth2
    google: async function(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate('google-oauth', { scope: ["profile", "email"] }, authenticateStrategyCallback(req, res, next))(req, res, next);
    },
    // JWT
    jwt: function(allowedRoles: string[] = []) {
        return (req: Request, res: Response, next: NextFunction) => {
            passport.authenticate('jwt', async (err: string | null, user: { role: 'caterer' | 'worker'; roleId: string } | null, info: any) => {
                if (err) return next(err);
                if (!user) return res.status(401).json(info ? info : { message: "Unauthorized request", code: "UNAUTHORIZED" });

                const { role, roleId } = user;
                try {
                    if (allowedRoles.length && !allowedRoles.includes(role)) {
                        return res.status(401).json({ message: "Unauthorized Request", code: "UNAUTHORIZED" });
                    }
                    // Use map to fetch the correct model dynamically
                    const roleModelMap = {
                        caterer: odm.catererModel,
                        worker: odm.workerModel
                    }
                    const roleModel = roleModelMap[role] as any;
                    if (!roleModel) {
                        throw new Error(`Invalid role: ${user}`);
                    }

                    const roleData = await roleModel.findById(roleId);
                    if (!roleData) {
                        throw new Error(`Role data could not be found ${roleId}`);
                    }

                    req.roleData = {
                        role,
                        data: roleData
                    } as RoleData;

                    next();
                } catch(err) {
                    next(err);
                }
            })(req, res, next);
        }
    }
};
// Last Here