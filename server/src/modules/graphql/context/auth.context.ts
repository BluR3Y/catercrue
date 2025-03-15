import { authenticate } from "@/auth";
import { Request, Response } from "express";


export default async function({ req } : { req: Request }) {
    return new Promise((resolve) => {
        authenticate.jwt(async (err, user, info) => {
            if (err || !user) {
                return resolve({ user: null });
            }
            return resolve({ user });
        })(req, {} as Response, () => {});
    });
}