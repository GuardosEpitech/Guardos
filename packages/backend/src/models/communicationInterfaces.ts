import { IDishBE } from '../../../shared/models/dishInterfaces';
import { ILocation } from '../../../shared/models/locationInterfaces';
import { IMealType } from '../../../shared/models/mealTypeInterfaces';
import { IOpeningHours, IProduct }
  from '../../../shared/models/restaurantInterfaces';

export interface IIngredientsCommunication {
  name?: string;
  id?: number;
  allergens?: string[];
}

export interface IDishesCommunication {
  name?: string;
  description?: string;
  price?: number;
  products?: string[];
  pictures?: string[];
  allergens?: string[];
  category?: {
    menuGroup: string,
    foodGroup: string,
    extraGroup: string[],
  },
}

export interface IRestaurantCommunication {
  name: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: IOpeningHours[];
  pictures?: string[];
  picturesId?: number[];
  description?: string;
  dishes?: IDishBE[];
  location?: ILocation;
  mealType?: IMealType[];
  extras?: IDishBE[];
  products?: IProduct[];
}

//Communication object for BE and FE
//This is the object that is sent to the backend from the frontend
export interface ISearchCommunication {
  range?: number;
  rating?: number[]; //2 float rating lowest and highest
  name?: string;
  location?: string;
  categories?: string[];
  allergenList?: string[];
}
