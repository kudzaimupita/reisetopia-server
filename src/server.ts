import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import { pino } from "pino";
import { healthCheckRouter } from "./api/healthCheck/healthCheckRouter";
import { hotelRouter } from "./api/hotel/hotelRouter";
import errorHandler from "./common/middleware/errorHandler";
import requestLogger from "./common/requestLogger";
import { env } from "./config/envConfig";

const logger = pino({ name: "server start" });
const app: Express = express();

const connectToDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {});
    logger.info("Successfully connected to MongoDB");
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};

app.use(cors());
app.use(helmet());
app.use(requestLogger);

app.use("/health-check", healthCheckRouter);
app.use("/v1/recruiting/hotels", hotelRouter);

app.use(errorHandler());

export { app, connectToDatabase, logger };
