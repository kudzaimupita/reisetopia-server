import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  id: number;
  minPrice: number;
  currencyCode: string;
  countryCode: string;
  name: Record<string, string>;
  address: Record<string, string>;
  city: Record<string, string>;
  description: Record<string, string>;
  benefits: Array<{ text: Record<string, string> }>;
  deals: Array<{ expireTime: Date; headline: Record<string, string>; details: Record<string, string> }>;
  images: Array<{ url: string; caption: Record<string, string> }>;
  lat: number;
  lng: number;
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
  sortOrder?: 'asc' | 'desc';
}


