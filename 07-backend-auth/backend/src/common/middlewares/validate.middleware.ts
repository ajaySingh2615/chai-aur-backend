import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";
import { ApiError } from "../exceptions/api-error.js";

export const validate = (schema: ZodType<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // check the request body against the provided schema
      // we use parseAsync in case any custom async validation are added later
      await schema.parseAsync(req.body);

      // if it passes, move to the next function (the controller)
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        // Map the ugly Zod errors into a clean array for the frontend
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        // pass the error to our global error handler
        next(ApiError.badRequest("Validation Error", formattedErrors));
      } else {
        next(error); // Pass any other errors to the global error handler
      }
    }
  };
};
