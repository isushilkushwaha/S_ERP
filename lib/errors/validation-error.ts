import { AppError } from "./app-error";

export class ValidationError extends AppError {
  constructor(message = "Validation Failed") {
    super(message, 400);
  }
}