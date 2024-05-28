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
  uid: number;
  description?: string;
  price?: number;
  products?: string[];
  pictures?: string[];
  picturesId?: number[];
  allergens?: string[];
  category?: {
    menuGroup: string,
    foodGroup: string,
    extraGroup: string[],
  },
  userID: number;
}

export interface IRestaurantCommunication {
  name: string;
  uid: number;
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
  userToken: string;
  menuDesignID: number;
}

//Communication object for BE and FE
//This is the object that is sent to the backend from the frontend
export interface ISearchCommunication {
  filterName?: string;
  range?: number;
  rating?: number[]; //2 float rating lowest and highest
  name?: string;
  location?: string;
  categories?: string[];
  allergenList?: string[];
}

export interface IProfileCommunication {
  username: string;
  email: string;
  city: string;
  allergens: string[];
  savedFilter: [ISearchCommunication];
  profilePicId: number;
  preferredLanguage: string;
}

export interface IRestoProfileCommunication {
  username: string;
  email: string;
  profilePicId: number[];
  defaultMenuDesign: string;
  preferredLanguage: string;
}
