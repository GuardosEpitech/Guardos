import {ISearchCommunication} from './communicationInterfaces';
import {IRestaurantFrontEnd} from '../../../shared/models/restaurantInterfaces';

export interface IFilterObj {
  savedFilter: ISearchCommunication;
  savedRestaurants: IRestaurantFrontEnd[][];
}
