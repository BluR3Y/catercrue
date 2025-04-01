import { Request, Response, NextFunction } from "express";
import logger from "@/config/winston";

export default function(err: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(`Error occured while handling request: ${err.message}`, { stack: err.stack });
    res.status(500).json({ message: "Internal Server Error" });
}