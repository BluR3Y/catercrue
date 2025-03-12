import axios from "axios";
import { PassportStatic } from "passport";
import { Strategy, StrategyOptions } from "passport-oauth2";

export default function(passport: PassportStatic) {
    passport.use('google-oauth', new Strategy({
        authorizationURL: process.env.GOOGLE_AUTHORIZATION_URL as string,
        tokenURL: process.env.GOOGLE_TOKEN_URL as string,
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
        scope: ["profile", "email"]
    } as StrategyOptions,
    async function(accessToken, refreshToken, params, profile, done) {
        try {
            // Fetch user info from Google's API
            const { data } = await axios.get(process.env.GOOGLE_USER_INFO_URL as string, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Construct user object
            
        } catch (err) {
            done(err);
        }
    }));
}