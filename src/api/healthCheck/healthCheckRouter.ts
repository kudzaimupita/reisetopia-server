import express, { type Request, type Response, type Router } from "express";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "../../common/httpHandlers";
import { ServiceResponse } from "../../common/serviceResponse";

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get("/", (_req: Request, res: Response) => {
  const serviceResponse = ServiceResponse.success("Service is healthy", StatusCodes.OK);
  return handleServiceResponse(serviceResponse, res);
});
