import Joi from "joi";
import BaseDto from "../../../common/dto/base.dto.js";

class RegisterDto extends BaseDto {
  static schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().lowercase().trim().email().required(),
    password: Joi.string()
      .min(8)
      // The regex pattern MUST come before the custom message for it to work properly
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, lowercase letter, number, and special character",
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
      })
      .required(),
    // Updated roles to fit the job portal domain
    role: Joi.string()
      .valid("candidate", "employer", "admin")
      .default("candidate"),
  });
}

export default RegisterDto;
