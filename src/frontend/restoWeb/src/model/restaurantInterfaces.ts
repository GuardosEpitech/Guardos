import { ICategories } from "@src/model/categoryinterfaces";
import { ILocation } from "@src/model/locationInterfaces";
import { IOpeningHours } from "@src/model/openingHoursInterfaces";

export interface IRestaurantFrontEnd {
  id: number;
  name: string;
  phoneNumber: string;
  categories: [ICategories];
  location: ILocation;
  rating: number;
  openingHours: IOpeningHours[];
  range: number;
  description: string;
  ratingCount: number;
  hitRate: number;
  dishes: any;
  pictures: [string];
}

export interface IProduct {
  name: string;
  ingredients: string[];
  allergens: string[];
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
