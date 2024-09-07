import type { IHotel } from "../hotelModel";

export const getFirstDeal = (hotel: IHotel, fallbackLang: string) => {
  if (hotel.deals.length === 0) return null;

  const firstDeal = hotel.deals[0];
  return {
    expireTime: firstDeal.expireTime,
    headline: firstDeal.headline[fallbackLang] || "",
    details: firstDeal.details[fallbackLang] || "",
  };
};
