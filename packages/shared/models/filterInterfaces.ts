import {ISearchCommunication} from './communicationInterfaces';
import {IRestaurantFrontEnd} from './restaurantInterfaces';
import { ICoordinates } from './locationInterfaces';

export interface IFilterObj {
  savedFilter: ISearchCommunication;
  savedRestaurants: IRestaurantFrontEnd[][];
}

export interface IFilterObject {
  allergenList?: string[];
  location?: string;
  name?: string;
  rating?: number[];
  range?: number;
  categories?: string[];
  dishes?: any;
  userLoc?: ICoordinates;
}
