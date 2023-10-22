This file contains all shared interfaces that are related to dishes.

IDishBE:
--------

```java
export interface IDishBE {
  name: string;
  id: number;
  description: string;
  price: number;
  allergens: string[];
  pictures: string[];
  products: string[];
  category: ICategoryBE;
}
```

IDishFE:
--------

```java
export interface IDishFE {
  name: string;
  description: string;
  price: number;
  allergens: string[];
  pictures?: string[];
  category: ICategoryFE;
  resto: string;
  products: string[];
}
```