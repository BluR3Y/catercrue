import winston from "winston";

// Package documentation: https://www.npmjs.com/package/winston

// Define log format
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Define transport
const transports = [
    // Write all logs with importance level of `error` or higher to `error.log`
    // (i.e., error, fatal, but not other levels)
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.uncolorize()
        )
    }),
    // Write all logs with importance level of `info` or higher to `combined.log`
    // (i.e., fatal, error, warn, and info, but not trace)
    new winston.transports.File({
        filename: 'logs/combined.log',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.uncolorize()
        )
    })
];

// Create Winston logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        logFormat
    ),
    transports
});

// Handle uncaught exceptions
logger.exceptions.handle(
    new winston.transports.File({ filename: "logs/exceptions.log" })
);

// Console logging for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export default logger;