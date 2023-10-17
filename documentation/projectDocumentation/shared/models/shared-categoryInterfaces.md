This file contains all interfaces that are related to categories.

ICategoryFE:
------------

```java
export interface ICategoryFE {
  foodGroup: string,
  extraGroup: string[],
  menuGroup: string
}
```

ICategories:
------------

```java
export interface ICategories {
  name: string;
  hitRate: number;
  dishes: IDishFE[];
}
```

ICategoryBE:
------------

```java
export interface ICategoryBE {
  menuGroup: string,
  foodGroup: string,
  extraGroup: string[]
}
```