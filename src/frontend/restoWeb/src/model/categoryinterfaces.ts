import { IDishFE } from "@src/model/dishInterfaces";

export interface ICategories {
  name: string;
  hitRate: number;
  dishes: [IDishFE];
}

export interface ICategoryFE {
  foodGroup: string;
  extraGroup: string;
  menuGroup: string;
}
