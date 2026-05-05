import Joi from "joi";

class BaseDto {
  static schema = Joi.object({});

  static validate(data) {
    const { error, value } = this.schema.validate(data, {
      abortEarly: false, // Catch all errors at once
      stripUnknown: true, // Security: Strip out any fields not in the schema
    });

    if (error) {
      // Clean up Joi's default error formatting
      const errors = error.details.map(
        (detail) => detail.message.replace(/['"]/g, ""), // Removes the ugly quotes Joi adds
      );
      return { errors, value: null };
    }

    return { errors: null, value };
  }
}

export default BaseDto;
