export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly errors: any[];

    constructor(
        statusCode: number,
        message: string,
        errors: any[] = [],
        isOperational = true,
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    // Helper static methods for clean controller code
    static badRequest(message = "Bad Request", errors: any[] = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }

    static notFound(message = "Resource not found") {
        return new ApiError(404, message);
    }

    static internal(message = "Internal Server Error") {
        return new ApiError(500, message, [], false);  // isOperational = false
    }
}