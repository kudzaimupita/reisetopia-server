import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";
import errorHandler from "./common/middleware/errorHandler";

const logger = pino({ name: "server start" });
const app: Express = express();

app.use(cors());
app.use(helmet());

app.use(errorHandler());
export { app, logger };
