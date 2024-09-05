import mongoose, { type Document, Schema } from "mongoose";

export interface LocalizedText {
  "en-US"?: string;
  "de-DE"?: string;
  "fr-FR"?: string;
  "es-ES"?: string;
  [key: string]: string | undefined;
}
export interface IFindAllResult {
  totalCount: number;
  hotels: ITranslatedHotel[];
}
export interface Benefit {
  text: string;
}

export interface Deal {
  expireTime: Date;
  headline: string;
  details: string;
}

export interface Image {
  url: string;
  caption: string;
}

export interface ITranslatedHotel {
  id: number;
  minPrice: number;
  currencyCode: string;
  countryCode: string;
  name: string;
  address: string;
  city: string;
  description: string;
  benefits: Benefit[];
  firstDeal: Deal | null;
  firstImage: Image | null;
  lat: number;
  lng: number;
}
export interface IFindAllOptions {
  lang?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface IHotel extends Document {
  id: number;
  minPrice: number;
  currencyCode: string;
  countryCode: string;
  name: LocalizedText;
  address: LocalizedText;
  city: LocalizedText;
  description: LocalizedText;
  benefits: Array<{ text: LocalizedText }>;
  deals: Array<{
    expireTime: Date;
    headline: LocalizedText;
    details: LocalizedText;
  }>;
  images: Array<{ url: string; caption: LocalizedText }>;
  lat: number;
  lng: number;
}

const LocalizedTextSchema = new Schema<LocalizedText>(
  {
    "en-US": String,
    "de-DE": String,
    "fr-FR": String,
    "es-ES": String,
  },
  { _id: false },
);

const hotelSchema = new Schema<IHotel>({
  name: { type: LocalizedTextSchema, required: true },
  minPrice: { type: Number, required: true },
  currencyCode: { type: String, required: true },
  countryCode: { type: String, required: true },
  address: { type: LocalizedTextSchema, required: true },
  city: { type: LocalizedTextSchema, required: true },
  description: { type: LocalizedTextSchema, required: true },
  benefits: [
    {
      text: { type: LocalizedTextSchema, required: true },
    },
  ],
  deals: [
    {
      expireTime: { type: Date, required: true },
      headline: { type: LocalizedTextSchema, required: true },
      details: { type: LocalizedTextSchema, required: true },
    },
  ],
  images: [
    {
      url: { type: String, required: true },
      caption: { type: LocalizedTextSchema, required: true },
    },
  ],
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

export const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);
