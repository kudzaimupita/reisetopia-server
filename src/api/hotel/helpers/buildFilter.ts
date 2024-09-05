export interface IFindAllFilter {
    nameFilter?: string;
    minPrice?: number;
    maxPrice?: number;
    lat?: number;
    lng?: number;
    distance?: number; // in kilometers
  }

export const buildFilter = (filter: IFindAllFilter): any => {
    const query: any = {};
  
    if (filter.minPrice ) {
      query.minPrice = { $gte: filter.minPrice };
    }
    if (filter.maxPrice ) {
      query.maxPrice = { $lte: filter.maxPrice };
    }
  
  
    if (filter.nameFilter) {
      query.name = {
        $regex: `.*${filter.nameFilter}.*`,
        $options: 'i', 
      };
    }
  
    if (filter.distance && filter.lat !== undefined && filter.lng !== undefined) {
      query.location = {
        $geoWithin: {
          $centerSphere: [[filter.lng, filter.lat], filter.distance / 6371], // distance in kilometers
        },
      };
    }
  
    return query;
  };
  