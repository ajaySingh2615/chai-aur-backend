import { Request, Response, NextFunction } from "express";
import { ApiError } from "../exceptions/api-error.js";
import { env } from "../config/env.js";

// EXTREMELY IMPORTANT: You must have exactly 4 arguments here!
export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, [], false, err.stack);
    }

    const response = {
        success: false,
        message: error.message,
        ...(error.errors?.length > 0 && { errors: error.errors }),
        ...(env.NODE_ENV === "development" && { stack: error.stack }),
    };

    res.status(error.statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
};