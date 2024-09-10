import { ServiceResponse } from "@/common/serviceResponse";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "../../common/httpHandlers";
import { validateQueryParams } from "./helpers/validateQueryParams";
import { hotelService } from "./hotelService";

class HotelController {
  public getHotels: RequestHandler = async (req: Request, res: Response) => {
    const { errors, validated } = validateQueryParams(req.query);

    if (errors.length > 0) {
      return ServiceResponse.failure("Error validating query params", null, StatusCodes.BAD_REQUEST);
    }

    const serviceResponse = await hotelService.findAll(
      {
        lang: (req.query.lang as string) || "en-US",
        page: validated.pageNumber,
        pageSize: validated.pageSize,
        sort: validated.sort,
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
  };
}

export const hotelController = new HotelController();
