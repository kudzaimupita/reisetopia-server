import { StatusCodes } from "http-status-codes";
import type mongoose from "mongoose";
import { ServiceResponse } from "../../common/serviceResponse";
import { logger } from "../../server";
import { type IFindAllFilter, buildFilter } from "./helpers/buildFilter";
import { buildPagination } from "./helpers/buildPagination";
import { buildSort } from "./helpers/buildSort";
import { getFallbackLanguage } from "./helpers/getFallbackLanguage";
import { getFirstDeal } from "./helpers/getFirstDeal";
import { getFirstImage } from "./helpers/getFirstImage";
import { haversineDistance } from "./helpers/haversineDistance";
import { Hotel, type IFindAllOptions, type IHotel, type ITranslatedHotel } from "./hotelModel";

const BERLIN_LAT = 52.520008;
const BERLIN_LNG = 13.404954;

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
      name: hotel.name[fallbackLang] || "",
      address: hotel.address[fallbackLang] || "",
      city: hotel.city[fallbackLang] || "",
      description: hotel.description[fallbackLang] || "",
      firstDeal: getFirstDeal(hotel, fallbackLang),
      firstImage: getFirstImage(hotel, fallbackLang),
      distanceToCenterKm: haversineDistance(hotel.lat, hotel.lng, BERLIN_LAT, BERLIN_LNG),
    };
  }

  async findAll(
    options: IFindAllOptions = {},
    filter: IFindAllFilter = {},
  ): Promise<ServiceResponse<ITranslatedHotel[] | null>> {
    try {
      const { lang = "en-US", page = 1, pageSize = 10, sort = "" } = options;

      const mongoFilter = buildFilter(filter);
      const mongoSort = buildSort(sort);
      const { skip, limit } = buildPagination(page, pageSize);

      const hotels = await this.model.find(mongoFilter).sort(mongoSort).skip(skip).limit(limit).exec();

      const totalCount = await this.model.countDocuments(mongoFilter).exec();
      const totalPages = Math.ceil(totalCount / limit);
      const translatedHotels = hotels.map((hotel: IHotel) => this.getTranslatedHotelData(hotel, lang));

      return ServiceResponse.success<any>({
        totalPages,
        hotels: translatedHotels,
      });
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
