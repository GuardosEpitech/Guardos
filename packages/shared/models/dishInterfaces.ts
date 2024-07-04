import { ICategoryBE, ICategoryFE } from './categoryInterfaces';

export interface IDishBE {
  name: string;
  uid: number;
  description: string;
  price: number;
  allergens: string[];
  pictures: string[];
  picturesId?: number[];
  products: string[];
  category: ICategoryBE;
  discount: number;
  validTill: string;
}

export interface IDishFE {
  name: string;
  uid: number;
  description: string;
  price: number;
  allergens: string[];
  fitsPreference?: boolean;
  pictures?: string[];
  picturesId?: number[];
  category: ICategoryFE;
  resto: string;
  products: string[];
  discount: number;
  validTill: string;
}

export interface IAddDish {
  resto: string;
  dish: IDishFE;
}
