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
  restoChainID: number;
  validTill: string;
  combo: number[];
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
  combo: number[];
  restoChainID: number;
}

export interface IAddDish {
  resto: string;
  dish: IDishFE;
  restoChainID: number;
}
