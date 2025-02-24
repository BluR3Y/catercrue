import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import logger from "../../../config/winston";

export default function(err: any, req: Request, res: Response, next: NextFunction) {
    logger.error("Error occured while handling request: ", err);
}