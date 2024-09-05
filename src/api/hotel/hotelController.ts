import type { Request, RequestHandler, Response } from "express";
import { hotels } from "../../hotels";

class HotelController {
  public getHotels: RequestHandler = async (req: Request, res: Response) => {
    res.send(hotels)
  };
}

export const hotelController = new HotelController();
