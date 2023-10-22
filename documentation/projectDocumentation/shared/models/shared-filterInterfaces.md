This file contains all shared interfaces for the filter.

IFilterObj:
-----------

```java
export interface IFilterObj {
  savedFilter: ISearchCommunication;
  savedRestaurants: IRestaurantFrontEnd[][];
}
```

IFilterObject:
--------------

```java
export interface IFilterObject {
  allergenList?: string[];
  location?: string;
  name?: string;
  rating?: number[];
  range?: number;
  categories?: string[];
  dishes?: any;
}
```