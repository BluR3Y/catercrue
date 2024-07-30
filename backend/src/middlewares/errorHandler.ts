import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import { MulterError } from "multer";
import { Error as MongooseError } from 'mongoose';
import { ForbiddenError as CaslError } from '@casl/ability';

export default function(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return err.errorResponse(res);
    } else if (err instanceof MongooseError.ValidationError) {
        // Inefficient Approach
        return (new AppError(
            400,
            'INVALID_ARGUMENT',
            'Invalid field values',
            Object.entries(err.errors).reduce((accumulator, [key, errorInfo]) => {
                if (errorInfo instanceof MongooseError.ValidatorError) {
                    const errorProperties = errorInfo.properties;
                    accumulator = {
                        ...accumulator,
                        message: errorProperties.message,
                        type: errorProperties.type !== 'user defined' ? errorProperties.type : 'INVALID_ARGUMENT',
                        value: errorProperties.value
                    }
                } else {
                    // If error is an instance of MongooseError.CastError
                }

                return accumulator;
            }, {})
        )).errorResponse(res);
    } else if (err instanceof CaslError) {
        return (new AppError(403, 'FORBIDDEN', err.message).errorResponse(res));
    } else if (err instanceof MulterError) {
        return (new AppError(400, err.code, 'Invalid file upload', err.message).errorResponse(res));
    } else {
        console.log(err);
        return (new AppError(500, 'INTERNAL', 'Internal server error').errorResponse(res));
    }
}