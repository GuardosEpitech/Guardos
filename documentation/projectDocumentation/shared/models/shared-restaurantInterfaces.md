This file contains all shared interfaces for the restaurant.

IProduct:
---------

```java
export interface IProduct {
  name: string;
  allergens: string[];
  ingredients: string[];
}
```

IIngredient:
------------

```java
export interface IIngredient {
  name: string;
}
```

IAction:
--------

```java
export interface IAction {
  actionName: string;
  actionIcon: any;
  actionRedirect: string;
  redirectProps?: any;
}
```

IRestoName:
-----------

```java
export interface IRestoName {
  name: string;
}
```

IOpeningHours:
--------------

```java
//0 == Monday, 1 == Tuesday, 2 == Wednesday, 3 == Thursday, 4 == Friday, 5 == Saturday, 6 == Sunday
// 7 == All days
export interface IOpeningHours {
  open?: string;
  close?: string;
  day?: number;
}
```

IRestaurantFrontEnd:
--------------------

```java
export interface IRestaurantFrontEnd {
  name: string;
  id: number;
  phoneNumber: string;
  website: string;
  description: string;
  categories: ICategories[];
  location: ILocation;
  openingHours: IOpeningHours[];
  pictures: string[];
  hitRate?: number;
  range: number;
  rating: number;
  ratingCount?: number;
  products: IProduct[];
  dishes: IDishFE[];
}
```

IRestaurantBackEnd:
-------------------

```java
export interface IRestaurantBackEnd {
  id: number;
  name: string;
  phoneNumber: string;
  website: string;
  rating: number;
  ratingCount: number;
  openingHours: IOpeningHours[];
  pictures: string[];
  description: string;
  dishes: IDishBE[];
  location: ILocation;
  mealType: IMealType[];
  extras: IDishBE[];
  products: IProduct[];
}
```