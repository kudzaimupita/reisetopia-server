const serverless = require("serverless-http");
const mongoose = require("mongoose");
const { app, logger } = require("./dist/server");
const { connectToDatabase } = require("./dist/config/connectDB");

const connectToDbHandler = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await connectToDatabase();
    } catch (error) {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
      throw new Error(`Database connection error: ${error.message}`);
    }
  }
};

const proxy = serverless(app);

exports.handler = async (event, context) => {
  await connectToDbHandler();
  return proxy(event, context);
};
