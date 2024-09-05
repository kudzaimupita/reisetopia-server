import type { Request, RequestHandler, Response } from "express";
import { hotels } from "../../hotels";
import { validateQueryParams } from "./validateQueryParams";

class HotelController {
  public getHotels: RequestHandler = async (req: Request, res: Response) => {
    const { errors, validated } = validateQueryParams(req.query);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    res.send(hotels)
  };
}

export const hotelController = new HotelController();
