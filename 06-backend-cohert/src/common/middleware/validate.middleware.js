import ApiError from "../utils/api-error.js";

// Added a 'source' parameter with a default value of "body"
const validate = (DtoClass, source = "body") => {
  return (req, res, next) => {
    // Dynamically validate req.body, req.query, or req.params
    const { errors, value } = DtoClass.validate(req[source]);

    if (errors) {
      // 1. Use next(error) instead of throw
      // 2. Pass the errors array directly to our ApiError class
      return next(ApiError.badRequest("Validation failed", errors));
    }

    // Replace the request payload with the sanitized data
    req[source] = value;

    next();
  };
};

export default validate;
