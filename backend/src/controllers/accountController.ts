import { NextFunction, Request, Response } from "express";
import User from "../models/user/user";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            
        } = req.body;
        throw 'lol'
    } catch (err) {
        next(err);
    }
}