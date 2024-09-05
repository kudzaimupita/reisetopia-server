import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class ServiceResponse<T = null> {
  readonly success: boolean;
  readonly result: T;
  readonly error?: string;
  readonly statusCode: number;

  private constructor(success: boolean, error: string | undefined, result: T, statusCode: number) {
    this.success = success;
    this.error = error;
    this.result = result;
    this.statusCode = statusCode;
  }

  static success<T>(result: T, statusCode: number = StatusCodes.OK) {
    return new ServiceResponse(true, undefined, result, statusCode); // No error on success
  }

  static failure<T>(error: string, result: T, statusCode: number = StatusCodes.BAD_REQUEST) {
    return new ServiceResponse(false, error, result, statusCode);
  }
}

export const ServiceResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    error: z.string().optional(),
    result: dataSchema.optional(),
    statusCode: z.number(),
  });
