import passport from "passport";
import { Application } from "express";

// Import Auth Strategies
import localLoginStrategy from "./localLoginStrategy";
import jwtStrategy from "./jwtStrategy";

// Configure passport authentication middleware
export const passportAuthenticationMiddleware = (app: Application) => {
    // Install Auth Strategies
    localLoginStrategy(passport);
    jwtStrategy(passport);

    // Initialize Passport.js
    app.use(passport.initialize());
}

// Pass through the Auth routes
export const authenticate = {
    // Email/Phone & Password (Local Login)
    localLogin: passport.authenticate('local-login', { session: false }),
    // JWT
    jwt: passport.authenticate('jwt', { session: false })
}