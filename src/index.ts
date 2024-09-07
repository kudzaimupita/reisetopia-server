import { connectToDatabase } from "./config/connectDB";
import { env } from "./config/envConfig";
import { app, logger } from "./server";

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
      process.exit(1);
    }, 10000).unref();
  };

  process.on("SIGINT", onCloseSignal);
  process.on("SIGTERM", onCloseSignal);
};

startServer();
