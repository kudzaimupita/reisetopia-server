import type { Request, RequestHandler, Response } from "express";
import { handleServiceResponse } from "../../common/httpHandlers";
import { validateQueryParams } from "./helpers/validateQueryParams";
import { hotelService } from "./hotelService";

class HotelController {
  public getHotels: RequestHandler = async (req: Request, res: Response) => {
    const { errors, validated } = validateQueryParams(req.query);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    const serviceResponse = await hotelService.findAll(
      {
        lang: (req.query.lang as string) || "en-US",
        page: validated.pageNumber,
        pageSize: validated.pageSize,
        sortBy: validated.sortField,
        sortOrder: validated.sortDirection,
      },
      {
        nameFilter: validated.nameFilter,
        minPrice: validated.minPriceFilter,
        maxPrice: validated.maxPriceFilter,
        distance: validated.distanceFilter,
        lat: validated.latitude,
        lng: validated.longitude,
      },
    );

    return handleServiceResponse(serviceResponse, res);
    // res.send(serviceResponse)
  };
}

export const hotelController = new HotelController();
