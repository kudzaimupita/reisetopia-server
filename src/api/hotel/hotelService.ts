import { StatusCodes } from "http-status-codes";
import type mongoose from "mongoose";
import { ServiceResponse } from "../../common/serviceResponse";
import { logger } from "../../server";
import { type IFindAllFilter, buildFilter } from "./helpers/buildFilter";
import { buildSort } from "./helpers/buildSort";
import { getFallbackLanguage } from "./helpers/getFallbackLanguage";
import {
  Hotel,
  type IFindAllOptions,
  type IHotel,
  type ITranslatedHotel,
} from "./hotelModel";

const buildPagination = (
  page = 1,
  pageSize = 10
): { skip: number; limit: number } => ({
  skip: (page - 1) * pageSize,
  limit: pageSize,
});

export class HotelService {
  private model: mongoose.Model<IHotel>;

  constructor() {
    this.model = Hotel;
  }
  private getTranslatedHotelData(
    hotel: IHotel,
    lang: string
  ): ITranslatedHotel {
    const availableLanguages = Object.keys(hotel.name);
    const fallbackLang = getFallbackLanguage(availableLanguages, lang);

    return {
      id: hotel.id,
      minPrice: hotel.minPrice,
      currencyCode: hotel.currencyCode,
      countryCode: hotel.countryCode,
      name: hotel.name[fallbackLang] || "",
      address: hotel.address[fallbackLang] || "",
      city: hotel.city[fallbackLang] || "",
      description: hotel.description[fallbackLang] || "",
      benefits: hotel.benefits.map((benefit) => ({
        text: benefit.text[fallbackLang] || "",
      })),
      firstDeal:
        hotel.deals.length > 0
          ? {
              expireTime: hotel.deals[0].expireTime,
              headline: hotel.deals[0].headline[fallbackLang] || "",
              details: hotel.deals[0].details[fallbackLang] || "",
            }
          : null, // Return first deal if available, otherwise null
      firstImage:
        hotel.images.length > 0
          ? {
              url: hotel.images[0].url,
              caption: hotel.images[0].caption[fallbackLang] || "",
            }
          : null, // Return first image if available, otherwise null
      lat: hotel.lat,
      lng: hotel.lng,
    };
  }

  async findAll(
    options: IFindAllOptions = {},
    filter: IFindAllFilter = {}
  ): Promise<ServiceResponse<ITranslatedHotel[] | null>> {
    try {
      const { lang = "en-US", page = 1, pageSize = 10, sort = "" } = options;

      const mongoFilter = buildFilter(filter);
      const mongoSort = buildSort(sort);
      const { skip, limit } = buildPagination(page, pageSize);

      const hotels = await this.model
        .find(mongoFilter)
        .sort(mongoSort)
        .skip(skip)
        .limit(limit)
        .exec();

      const totalCount = await this.model.countDocuments(mongoFilter).exec();
      const totalPages = Math.ceil(totalCount / limit);
      const translatedHotels = hotels.map((hotel: IHotel) =>
        this.getTranslatedHotelData(hotel, lang)
      );

      return ServiceResponse.success<any>("Hotels found", {
        totalPages,
        hotels: translatedHotels,
      });
    } catch (ex) {
      const errorMessage = `Error finding all hotels: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving hotels.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const hotelService = new HotelService();
