import passport from "passport";
import { Application, RequestHandler, Request, Response, NextFunction } from "express";
import { generateJWT } from "../../../../utils/manageJWT";


// Import Login Strategies
import localLoginStrategy from "./localLoginStrategy";
import orm from "../../../../models";
import User from "../../../../models/user.model";

// Configure passport authentication middleware
export const passportAuthenticationMiddleware = (app: Application) => {
    // Install Login Strategies
    localLoginStrategy(passport);
    
    app.use(passport.initialize());
}

const authenticationStrategyCallback = (req: Request, res: Response, next: NextFunction) => {
    return (err: string | null, user: User, info: any) => {
        if (err) return res.status(401).json({ message: err });
        const userId = user.id;
        // Generate new refresh token
        orm.RefreshToken.create({ userId })
        .then((refreshToken) => {
            // Generate a new access token
            const accessToken = generateJWT({ userId });
            res.status(201).json({ accessToken, refreshToken: refreshToken.id });
        })
        .catch((err) => {
            next(err);
        });
    }
}

// Pass through the Auth routes
export const authenticate = {
    // Email/Password
    localLogin: async function(req: Request, res: Response, next: NextFunction) {
        return passport.authenticate('local-login', authenticationStrategyCallback(req, res, next))(req, res, next);
    }
}