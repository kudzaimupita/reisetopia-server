import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { buildFilter, IFindAllFilter } from "./helpers/buildFilter";
import { logger } from "../../server";
import { ServiceResponse } from "../../common/serviceResponse";
import { getFallbackLanguage } from "./helpers/getFallbackLanguage";
import { IFindAllOptions, IHotel,  ITranslatedHotel } from "./hotelModel";



const buildSort = (sortBy: string = 'name', sortOrder: 'asc' | 'desc' = 'asc'): any => ({
  [sortBy]: sortOrder === 'asc' ? 1 : -1
});

const buildPagination = (page: number = 1, pageSize: number = 10): { skip: number; limit: number } => ({
  skip: (page - 1) * pageSize,
  limit: pageSize
});

export class HotelService {
  private collection: mongoose.Collection<IHotel>;

  constructor() {
    this.collection = mongoose.connection.collection('hotels') as mongoose.Collection<IHotel>;
  }

  private getTranslatedHotelData(hotel: IHotel, lang: string): ITranslatedHotel {
    const availableLanguages = Object.keys(hotel.name);
    const fallbackLang = getFallbackLanguage(availableLanguages, lang);

    return {
      id: hotel.id,
      minPrice: hotel.minPrice,
      currencyCode: hotel.currencyCode,
      countryCode: hotel.countryCode,
      name: hotel.name[fallbackLang],
      address: hotel.address[fallbackLang],
      city: hotel.city[fallbackLang],
      description: hotel.description[fallbackLang],
      benefits: hotel.benefits.map(benefit => ({
        text: benefit.text[fallbackLang],
      })),
      deals: hotel.deals.map(deal => ({
        expireTime: deal.expireTime,
        headline: deal.headline[fallbackLang],
        details: deal.details[fallbackLang],
      })),
      images: hotel.images.map(image => ({
        url: image.url,
        caption: image.caption[fallbackLang],
      })),
      lat: hotel.lat,
      lng: hotel.lng,
    };
  }

  async findAll(
    options: IFindAllOptions = {},
    filter: IFindAllFilter = {}
  ): Promise<ServiceResponse<ITranslatedHotel[] | null>> {
    try {
      const {
        lang = 'en-US',
        page = 1,
        pageSize = 10,
        sortBy = 'name',
        sortOrder = 'asc'
      } = options;

      const mongoFilter = buildFilter(filter);
      const mongoSort = buildSort(sortBy, sortOrder);
      const { skip, limit } = buildPagination(page, pageSize);
      const hotels: IHotel[] = await this.collection
        .find(mongoFilter)
        .sort(mongoSort)
        .skip(skip)
        .limit(limit)
        .toArray();

      const translatedHotels = hotels.map((hotel: IHotel) => this.getTranslatedHotelData(hotel, lang));
      return ServiceResponse.success<ITranslatedHotel[]>("Hotels found", translatedHotels);
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
