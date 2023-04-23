import { ICategoryFE } from "@src/model/categoryinterfaces";

export interface IDishFE {
  name: string;
  description: string;
  pictures?: [string];
  allergens: string;
  price: number;
  products: string[];
  category: ICategoryFE;
  resto: string;
}
