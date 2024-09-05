
import mongoose from "mongoose";
import { env } from "./config/envConfig";
import { app, logger } from "./server";


const connectToDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/testt', {

    });
    logger.info("Successfully connected to MongoDB");
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1); // Exit process with failure
  }
};

const startServer = async () => {
  await connectToDatabase();

  const server = app.listen(env.PORT, () => {
    const { NODE_ENV, HOST, PORT } = env;
    logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
  });

  const onCloseSignal = () => {
    logger.info("SIGINT received, shutting down");
    server.close(async () => {
      logger.info("Server closed");
      process.exit();
    });
    setTimeout(async () => {
      process.exit(1); // Force shutdown after 10s
    }, 10000).unref();
  };

  process.on("SIGINT", onCloseSignal);
  process.on("SIGTERM", onCloseSignal);
};

startServer();
