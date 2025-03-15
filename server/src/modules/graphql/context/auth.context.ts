import { authenticate } from "@/auth";
import { Request, Response } from "express";
import { GraphQLError } from "graphql";


export default async function({ req } : { req: Request }) {
    return new Promise((resolve, reject) => {
        authenticate.jwt(async (err, user, info) => {
            if (err) return reject(new GraphQLError(err));
            if (!user) {
                return reject(new GraphQLError(info?.message || "Authentication failed", {
                    extensions: {
                        code: info?.name || "UNAUTHORIZED"
                    }
                }));
            }
            return resolve({ user });
        })(req, {} as Response, () => {});  // Ignoring res and next because we handle errors inside the callback
    });
}