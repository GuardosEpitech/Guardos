IIngredientsCommunication:
--------------------------

```java
export interface IIngredientsCommunication {
  name?: string;
  id?: number;
  allergens?: string[];
}
```

IDishesCommunication:
---------------------

```java
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
```

IRestaurantCommunication:
-------------------------

```java
export interface IRestaurantCommunication {
  name: string;
  phoneNumber?: string;
  website?: string;
  openingHours?: IOpeningHours[];
  pictures?: string[];
  description?: string;
  dishes?: IDishBE[];
  location?: ILocation;
  mealType?: IMealType[];
  extras?: IDishBE[];
  products?: IProduct[];
}
```

ISearchCommunication:
---------------------

```java
export interface ISearchCommunication {
  range?: number;
  rating?: number[]; //2 float rating lowest and highest
  name?: string;
  location?: string;
  categories?: string[];
  allergenList?: string[];
}
```