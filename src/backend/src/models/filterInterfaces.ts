import {ISearchCommunication} from './communicationInterfaces';
import {IRestaurantFrontEnd} from './restaurantInterfaces';

export interface IFilterObj {
  savedFilter: ISearchCommunication;
  savedRestaurants: IRestaurantFrontEnd[][];
}
