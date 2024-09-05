import { Request } from "express";

interface QueryParams {
  lang?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  name?: string;
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
  const defaultSortBy = "name";
  const defaultSortOrder: "asc" | "desc" = "asc";
  const defaultMinPrice = 0;
  const defaultMaxPrice = 0;
  const defaultDistance = 0;
  const defaultLat = 0;
  const defaultLng = 0;

  // Validate and sanitize `page`
  const pageNumber = Number.parseInt(query.page as string, 10);
  const validPageNumber = Number.isNaN(pageNumber) || pageNumber <= 0 ? defaultPage : pageNumber;

  // Validate and sanitize `limit`
  const pageSize = Number.parseInt(query.limit as string, 10);
  const validPageSize = Number.isNaN(pageSize) || pageSize <= 0 ? defaultLimit : pageSize;

  // Validate `sortBy`
  const validSortFields = ["name", "price", "distance"];
  const sortField = validSortFields.includes(query.sortBy as string) ? (query.sortBy as string) : defaultSortBy;

  // Validate `sortOrder`
  const validSortOrders = ["asc", "desc"];
  const sortDirection = validSortOrders.includes(query.sortOrder as string)
    ? (query.sortOrder as "asc" | "desc")
    : defaultSortOrder;

  // Validate and sanitize `minPrice` and `maxPrice`
  const minPrice = Number.parseFloat(query.minPrice as string);
  const validMinPrice = Number.isNaN(minPrice) || minPrice < 0 ? defaultMinPrice : minPrice;

  const maxPrice = Number.parseFloat(query.maxPrice as string);
  const validMaxPrice = Number.isNaN(maxPrice) || maxPrice < validMinPrice ? defaultMaxPrice : maxPrice;

  // Validate and sanitize `distance`
  const distance = Number.parseFloat(query.distance as string);
  const validDistance = Number.isNaN(distance) || distance < 0 ? defaultDistance : distance;

  // Validate and sanitize `lat` and `lng`
  const lat = Number.parseFloat(query.lat as string);
  const validLat = Number.isNaN(lat) || lat < -90 || lat > 90 ? defaultLat : lat;

  const lng = Number.parseFloat(query.lng as string);
  const validLng = Number.isNaN(lng) || lng < -180 || lng > 180 ? defaultLng : lng;

  return {
    errors,
    validated: {
      pageNumber: validPageNumber,
      pageSize: validPageSize,
      sortField,
      sortDirection,
      nameFilter: query.name || "",
      minPriceFilter: validMinPrice,
      maxPriceFilter: validMaxPrice,
      distanceFilter: validDistance,
      latitude: validLat,
      longitude: validLng,
    },
  };
}
