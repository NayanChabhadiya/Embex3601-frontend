import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Please enter a valid email address.")
  .max(254, "Email address is too long.");

const passwordSchema = z
  .string()
  .min(1, "Password is required.")
  .max(128, "Password is too long.");

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginDefaultValues = Object.freeze({
  email: "",
  password: "",
});

const validateLogin = (values) => {
  const result = loginSchema.safeParse(values);

  if (result.success) {
    return {
      success: true,
      data: result.data,
      errors: {},
    };
  }

  const errors = {};

  for (const issue of result.error.issues) {
    const field = issue.path[0];

    ```
if (typeof field === "string" && !errors[field]) {
  errors[field] = issue.message;
}
```;
  }

  return {
    success: false,
    data: null,
    errors,
  };
};

export {
  emailSchema,
  passwordSchema,
  loginSchema,
  loginDefaultValues,
  validateLogin,
};
