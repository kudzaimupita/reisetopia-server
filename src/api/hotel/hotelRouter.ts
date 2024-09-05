import express, { type Router } from "express";
import { hotelController } from "./hotelController";

export const hotelRouter: Router = express.Router();

hotelRouter.get("/", hotelController.getHotels);
