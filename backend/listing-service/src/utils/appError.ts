export default class AppError extends Error {
    public statusCode: number;
    public errorCode: string;
    public errors?: any;

    constructor(statusCode: number, errorCode: string, message: string, errors?: any) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.errors = errors;

        // Capture the stack trace
        Error.captureStackTrace(this, this.constructor);
    }

    public errorResponse(res: any): any {
        const {
            statusCode,
            errorCode,
            message,
            errors
        } = this;
        return res.status(statusCode).send({
            code: errorCode,
            message: message,
            ...(errors && { errors }),  // Conditionally include errors if present
        });
    }
}