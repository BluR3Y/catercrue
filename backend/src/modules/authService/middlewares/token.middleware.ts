import { RequestHandler, Request, Response, NextFunction } from "express";

export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    next(new Error("Tester"))
}