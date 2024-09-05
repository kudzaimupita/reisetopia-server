export interface IFindAllFilter {
  nameFilter?: string;
  minPrice?: number;
  maxPrice?: number;
  lat?: number;
  lng?: number;
  distance?: number;
}

export const buildFilter = (filter: IFindAllFilter): any => {
  const query: any = {};

  if (filter.minPrice) {
    query.minPrice = { $gte: filter.minPrice };
  }
  if (filter.maxPrice) {
    query.maxPrice = { $lte: filter.maxPrice };
  }

  if (filter.nameFilter) {
    query.$or = [
      { "name.en-US": { $regex: `.*${filter.nameFilter}.*`, $options: "i" } },
      { "name.de-DE": { $regex: `.*${filter.nameFilter}.*`, $options: "i" } },
      { "name.es-ES": { $regex: `.*${filter.nameFilter}.*`, $options: "i" } },
      { "name.fr-FR": { $regex: `.*${filter.nameFilter}.*`, $options: "i" } },
    ];
  }

  if (filter.distance && filter.lat !== undefined && filter.lng !== undefined) {
    query.location = {
      $geoWithin: {
        $centerSphere: [[filter.lng, filter.lat], filter.distance / 6371],
      },
    };
  }

  return query;
};
