This file contains all shared interfaces for the location.

ILocation:
----------

```java
export interface ILocation {
  streetName: string,
  streetNumber: string,
  postalCode: string,
  country: string;
  city: string;
  latitude: string;
  longitude: string;
}
```