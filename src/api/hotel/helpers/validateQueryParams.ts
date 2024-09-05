import { Request } from "express";

interface QueryParams {
  lang?: string;
  pageNumber?: string;
  limit?: string;
  sort?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  distance?: string;
  lat?: string;
  lng?: string;
}

export function validateQueryParams(query: QueryParams) {
  const errors: string[] = [];

  const defaultPage = 1;
  const defaultLimit = 10;
  const defaultMinPrice = 0;
  const defaultMaxPrice = 0;
  const defaultDistance = 0;
  const defaultLat = 0;
  const defaultLng = 0;

  const pageNumber = Number.parseInt(query.pageNumber as string, 10);
  const validPageNumber = Number.isNaN(pageNumber) || pageNumber <= 0 ? defaultPage : pageNumber;

  const pageSize = Number.parseInt(query.limit as string, 10);
  const validPageSize = Number.isNaN(pageSize) || pageSize <= 0 ? defaultLimit : pageSize;

  const sortField = query.sort;

  const minPrice = Number.parseFloat(query.minPrice as string);
  const validMinPrice = Number.isNaN(minPrice) || minPrice < 0 ? defaultMinPrice : minPrice;

  const maxPrice = Number.parseFloat(query.maxPrice as string);
  const validMaxPrice = Number.isNaN(maxPrice) || maxPrice < validMinPrice ? defaultMaxPrice : maxPrice;

  const distance = Number.parseFloat(query.distance as string);
  const validDistance = Number.isNaN(distance) || distance < 0 ? defaultDistance : distance;

  const lat = Number.parseFloat(query.lat as string);
  const validLat = Number.isNaN(lat) || lat < -90 || lat > 90 ? defaultLat : lat;

  const lng = Number.parseFloat(query.lng as string);
  const validLng = Number.isNaN(lng) || lng < -180 || lng > 180 ? defaultLng : lng;

  return {
    errors,
    validated: {
      pageNumber: validPageNumber,
      pageSize: validPageSize,
      sort: sortField,
      nameFilter: query.search || "",
      minPriceFilter: validMinPrice,
      maxPriceFilter: validMaxPrice,
      distanceFilter: validDistance,
      latitude: validLat,
      longitude: validLng,
    },
  };
}
