import type { IHotel } from "../hotelModel";

export const getFirstImage = (hotel: IHotel, fallbackLang: string) => {
  if (hotel.images.length === 0) return null;

  const firstImage = hotel.images[0];
  return {
    url: firstImage.url,
    caption: firstImage.caption[fallbackLang] || "",
  };
};
