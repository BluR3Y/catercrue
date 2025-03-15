import axios from "axios";
import { PassportStatic } from "passport";
import { Strategy, StrategyOptions, VerifyFunction, VerifyFunctionWithRequest } from "passport-oauth2";

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
            console.log(data);


        } catch (err) {
            done(err);
        }
    } as VerifyFunction));
}

// Last Here: Implementing google-oauth

// accessToken: A temporary token issued by Google that grants access to the user’s data.
// refreshToken: A long-lived token used to get new access tokens when they expire.
// params: The raw response parameters from Google that contain additional info.
// profile: The Google user profile object returned by Passport.js after authentication.