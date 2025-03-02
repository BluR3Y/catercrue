import rateLimit from "express-rate-limit";
import { RedisClient } from "ioredis/built/connectors/SentinelConnector/types";

export default (windowMs: number, limit: number) => {
	return rateLimit({
		windowMs,	// Time frame (milliseconds)
		limit,	// Limit each IP to a certain number of requests per `window`
		standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
		legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
		// Issues with store property for redis
	});
}