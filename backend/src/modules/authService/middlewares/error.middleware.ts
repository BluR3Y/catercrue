import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import logger from "../../../config/winston";

export default function(error: any, req: Request, res: Response, next: NextFunction) {
    logger.error("Error occured while handling request: ", {error});
    res.status(500).json({ message: "Internal Server Error" });
}