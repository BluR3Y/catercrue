import { NextFunction, Request, Response } from "express";
import db from "../models";
import { authenticate } from "../utils/auth";

export const login = authenticate.localLogin;

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            
        } = req.body;

        const user = await db.User.create({
            name: 'rey',
            email: 'rey@gmail.com',
            password: await db.User.hashPassword('password@1234')
        });
        user.save()
        
        throw 'lol'
    } catch (err) {
        console.log(err)
        next(err);
    }
}