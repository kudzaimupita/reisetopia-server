import mongoose, { type Document, Schema } from "mongoose";

// Define the TranslatedAttribute interface
export interface TranslatedAttribute {
  "en-US"?: string;
  "de-DE"?: string;
  "fr-FR"?: string;
  "es-ES"?: string;
  [key: string]: string | undefined;
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
  deals: Deal[];
  images: Image[];
  lat: number;
  lng: number;
}

export interface IFindAllOptions {
  lang?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IHotel extends Document {
  id: number;
  minPrice: number;
  currencyCode: string;
  countryCode: string;
  name: TranslatedAttribute;
  address: TranslatedAttribute;
  city: TranslatedAttribute;
  description: TranslatedAttribute;
  benefits: Array<{ text: TranslatedAttribute }>;
  deals: Array<{ expireTime: Date; headline: TranslatedAttribute; details: TranslatedAttribute }>;
  images: Array<{ url: string; caption: TranslatedAttribute }>;
  lat: number;
  lng: number;
}

// Define a schema for TranslatedAttribute
const translatedAttributeSchema = new Schema<TranslatedAttribute>(
  {
    "en-US": String,
    "de-DE": String,
    "fr-FR": String,
    "es-ES": String,
  },
  { _id: false },
);

const hotelSchema = new Schema<IHotel>({
  name: { type: translatedAttributeSchema, required: true },
  minPrice: { type: Number, required: true },
  currencyCode: { type: String, required: true },
  countryCode: { type: String, required: true },
  address: { type: translatedAttributeSchema, required: true },
  city: { type: translatedAttributeSchema, required: true },
  description: { type: translatedAttributeSchema, required: true },
  benefits: [
    {
      text: { type: translatedAttributeSchema, required: true },
    },
  ],
  deals: [
    {
      expireTime: { type: Date, required: true },
      headline: { type: translatedAttributeSchema, required: true },
      details: { type: translatedAttributeSchema, required: true },
    },
  ],
  images: [
    {
      url: { type: String, required: true },
      caption: { type: translatedAttributeSchema, required: true },
    },
  ],
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

export const Hotel = mongoose.model<IHotel>("Hotel", hotelSchema);
