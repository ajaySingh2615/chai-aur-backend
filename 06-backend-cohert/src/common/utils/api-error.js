class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [], // Added to handle array of validation errors
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false; // Explicity state this is a failure
    this.errors = errors; // Useful for Mongoose or Zod validation arrays
    this.data = null; // Standard practice to keep the response shape consistent
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = "Bad Request", errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    // Fixed capitalization convention
    return new ApiError(401, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Resource already exists") {
    return new ApiError(409, message);
  }
}

export default ApiError;
