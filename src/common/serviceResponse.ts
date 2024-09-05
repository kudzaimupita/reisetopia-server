import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly result: T;
  readonly statusCode: number;

  private constructor(success: boolean, message: string, result: T, statusCode: number) {
    this.success = success;
    this.message = message;
    this.result = result;
    this.statusCode = statusCode;
  }

  static success<T>(message: string, result: T, statusCode: number = StatusCodes.OK) {
    return new ServiceResponse(true, message, result, statusCode);
  }

  static failure<T>(message: string, result: T, statusCode: number = StatusCodes.BAD_REQUEST) {
    return new ServiceResponse(false, message, result, statusCode);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    result: dataSchema.optional(),
    statusCode: z.number(),
  });
