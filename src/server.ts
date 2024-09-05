import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import errorHandler from "./common/middleware/errorHandler";
import { healthCheckRouter } from "./api/healthCheck/healthCheckRouter";
import { hotelRouter } from "./api/hotel/hotelRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

app.use(cors());
app.use(helmet());

app.use("/health-check", healthCheckRouter);
app.use("/v1/recruiting/hotels", hotelRouter);


app.use(errorHandler());
export { app, logger };
