import { ICategories } from './categoryInterfaces';
import {IDishBE, IDishFE} from './dishInterfaces';
import { ILocation } from './locationInterfaces';
import { IMealType } from './mealTypeInterfaces';

export interface IProduct {
  name: string;
  allergens: string[];
  ingredients: string[];
}

export interface IReview {
  _id?: String,
  note?: Number,
  comment?: String,
  date?: Date,
}

export interface IIngredient {
  name: string;
}

export interface IAction {
  actionName: string;
  actionIcon: any;
  actionRedirect: string;
  redirectProps?: any;
}

export interface IRestoName {
  name: string;
}

//0 == Monday, 1 == Tuesday, 2 == Wednesday, 3 == Thursday, 4 == Friday, 5 == Saturday, 6 == Sunday
// 7 == All days
export interface IOpeningHours {
  open?: string;
  close?: string;
  day?: number;
}

export interface IRestaurantFrontEnd {
  name: string;
  uid: number;
  userID: number;
  restoChainID: number,
  phoneNumber: string;
  website: string;
  description: string;
  categories: ICategories[];
  location: ILocation;
  openingHours: IOpeningHours[];
  pictures: string[];
  picturesId?: number[];
  hitRate?: number;
  range: number;
  rating: number;
  ratingCount?: number;
  products: IProduct[];
  dishes: IDishFE[];
  menuDesignID: number;
  statistics?: IStatistics;
}

export interface IStatistics {
    totalClicks: number;
    clicksThisMonth: number;
    clicksThisWeek: number;
    updateMonth: string;
    updateWeek: string;
    userDislikedIngredients: [{name: string, count: number}];
    userAllergens: [{name: string, count: number}];
}

export interface IRestaurantBackEnd {
  uid: number;
  userID: number;
  restoChainID: number,
  name: string;
  phoneNumber: string;
  website: string;
  rating: number;
  ratingCount: number;
  openingHours: IOpeningHours[];
  pictures: string[];
  picturesId?: number[];
  description: string;
  dishes: IDishBE[];
  location: ILocation;
  mealType: IMealType[];
  extras: IDishBE[];
  products: IProduct[];
  menuDesignID: number;
}

export interface IAddResto {
  name: string;
  phoneNumber: string;
  description: string;
  website: string;
  openingHours: IOpeningHours[];
  location: ILocation;
  menuDesignID: number;
  restoChainID: number;
};

export interface IAddRestoRequest {
  userToken: string;
  resto: IAddResto;
}

export type color =
  | "primary"
  | "secondary"
  | "default"
  | "error"
  | "info"
  | "success"
  | "warning";

export interface Allergen {
  name: string;
  value: boolean;
  colorButton: color;
}

export interface AllergenProfile {
  name: string;
  allergens: Allergen[];
}
