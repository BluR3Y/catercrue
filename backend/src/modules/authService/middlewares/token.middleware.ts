import { RequestHandler, Request, Response, NextFunction } from "express";
import { isBlackListed, verifyJWT } from "../../../utils/manageJWT";
import { JwtPayload } from "jsonwebtoken";
import db from "../models";

const authenticateToken: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Retrieve the 'authorization' header from the request
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Invalid access token" });
            return
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(" ")[1];

        // Verify JWT
        const jwtPayload: JwtPayload | null = verifyJWT(token);
        if (!jwtPayload || !jwtPayload.userId) {
            res.status(401).json({ message: "Invalid or expired token" });
            return
        }

        // Check if token is blacklisted
        if (await isBlackListed(token)) {
            res.status(403).json({ message: "Token is blacklisted" });
            return
        }

        const userData = db.User.findOne({ where: { id: jwtPayload['userId'] } });
        if (!userData) {
            res.status(404).json({ message: "User does not exist" });
            return
        }

        req.user = userData;
        next();
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            res.status(401).json({ message: "Token expired" });
            return
        } else if (err.name === "JsonWebTokenError") {
            res.status(401).json({ message: "Invalid token" });
            return
        }
        next(err);
    }
}

export default authenticateToken;