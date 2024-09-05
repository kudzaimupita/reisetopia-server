import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly result: T;
  readonly error: string;
  readonly statusCode: number;

  private constructor(success: boolean, error: string, result: T, statusCode: number) {
    this.success = success;
    this.error = error;
    this.result = result;
    this.statusCode = statusCode;
  }

  static success<T>(error: string, result: T, statusCode: number = StatusCodes.OK) {
    return new ServiceResponse(true, "", result, statusCode);
  }

  static failure<T>(error: string, result: T, statusCode: number = StatusCodes.BAD_REQUEST) {
    return new ServiceResponse(false, error, result, statusCode);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    error: z.string(),
    result: dataSchema.optional(),
    statusCode: z.number(),
  });
