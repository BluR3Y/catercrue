import { NextFunction, Request, Response } from "express";
import db from "../models";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            
        } = req.body;

        const user = await db.User.create({
            name: 'rey',
            email: 'rey@gmail.com',
            password: 'lol'
        });
        user.save()
        
        throw 'lol'
    } catch (err) {
        console.log(err)
        next(err);
    }
}