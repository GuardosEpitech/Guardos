export interface IProductBE {
  name: string;
  userID: number;
  id: number;
  allergens: string[];
  ingredients: string[];
  restaurantId: number[];
}

export interface IProductFE {
  name: string;
  userID: number;
  id: number;
  allergens: string[];
  ingredients: string[];
  restaurantId: number[];
}
