import jwt, { JwtPayload } from "jsonwebtoken";
import { getRedisInstance } from "../config/redis";
import { StringValue } from "ms";

const redisClient = getRedisInstance();

const {
    JWT_KEY
} = process.env;

if (!JWT_KEY) throw new Error("JWT_KEY is not defined in environment variables");

export const generateJWT = (payload: object, duration: number | StringValue) => {
    return jwt.sign(payload, JWT_KEY, { expiresIn: duration });
}

export const verifyJWT = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_KEY) as JwtPayload;
}

// Store token in redis cache
export const blacklistToken = async (token: string): Promise<void> => {
    // Decode jwt to extract contents
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || typeof decoded !== "object" || !("exp" in decoded)) {
        return;
    }

    const { exp } = decoded;
    const tokenExpiry = new Date(exp! * 1000);
    const currentTime = new Date();
    
    // Check if the current time has not exceeded the tokens expiry
    if (currentTime < tokenExpiry) {
        // Determine how long before the token expires (seconds)
        const timeRemaining = tokenExpiry.getTime() - currentTime.getTime();
        // Temporarily store the blacklisted token in redis cache
        await redisClient!.set(`blacklist:${token}`, "", "PX", timeRemaining);
    }
}

// Check if token is blacklisted in redis cache
export const isBlackListed = async (token: string): Promise<boolean> => {
    const blacklistToken = await redisClient!.get(`blacklist:${token}`);
    return blacklistToken !== null;
}
