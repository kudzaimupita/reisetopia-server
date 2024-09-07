import mongoose from "mongoose";
import { logger } from "../server";
import { env } from "./envConfig";

export const connectToDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("Successfully connected to the database");
  } catch (error) {
    logger.error("Database connection error", error);
    process.exit(1);
  }
};
