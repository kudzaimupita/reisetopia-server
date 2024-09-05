import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { ServiceResponse } from "../../common/serviceResponse";
import { logger } from "../../server";
import { type IFindAllFilter, buildFilter } from "./helpers/buildFilter";
import { getFallbackLanguage } from "./helpers/getFallbackLanguage";
import { Hotel, type IFindAllOptions, type IHotel, type ITranslatedHotel } from "./hotelModel";

const buildSort = (sortBy = "name", sortOrder: "asc" | "desc" = "asc"): any => ({
  [sortBy]: sortOrder === "asc" ? 1 : -1,
});

const buildPagination = (page = 1, pageSize = 10): { skip: number; limit: number } => ({
  skip: (page - 1) * pageSize,
  limit: pageSize,
});

export class HotelService {
  private model: mongoose.Model<IHotel>;

  constructor() {
    this.model = Hotel; 
  }
  private getTranslatedHotelData(hotel: IHotel, lang: string): ITranslatedHotel {
    const availableLanguages = Object.keys(hotel.name);
    const fallbackLang = getFallbackLanguage(availableLanguages, lang);

    return {
      id: hotel.id,
      minPrice: hotel.minPrice,
      currencyCode: hotel.currencyCode,
      countryCode: hotel.countryCode,
      name: hotel.name[fallbackLang] || '', 
      address: hotel.address[fallbackLang] || '', 
      city: hotel.city[fallbackLang] || '', 
      description: hotel.description[fallbackLang] || '', 
      benefits: hotel.benefits.map((benefit) => ({
        text: benefit.text[fallbackLang] || '', 
      })),
      deals: hotel.deals.map((deal) => ({
        expireTime: deal.expireTime,
        headline: deal.headline[fallbackLang] || '', 
        details: deal.details[fallbackLang] || '', 
      })),
      images: hotel.images.map((image) => ({
        url: image.url,
        caption: image.caption[fallbackLang] || '', 
      })),
      lat: hotel.lat,
      lng: hotel.lng,
    };
  }

  async findAll(
    options: IFindAllOptions = {},
    filter: IFindAllFilter = {},
  ): Promise<ServiceResponse<ITranslatedHotel[] | null>> {
    try {
      const { lang = "en-US", page = 1, pageSize = 10, sortBy = "name", sortOrder = "asc" } = options;

      const mongoFilter = buildFilter(filter);
      const mongoSort = buildSort(sortBy, sortOrder);
      const { skip, limit } = buildPagination(page, pageSize);

      const hotels = await this.model.find(mongoFilter)
        .sort(mongoSort)
        .skip(skip)
        .limit(limit)
        .exec();


      const translatedHotels = hotels.map((hotel: IHotel) => this.getTranslatedHotelData(hotel, lang));
      return ServiceResponse.success<ITranslatedHotel[]>("Hotels found", translatedHotels);
    } catch (ex) {
      const errorMessage = `Error finding all hotels: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving hotels.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const hotelService = new HotelService();
