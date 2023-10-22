NavigateTo:
-----------

```java
export const NavigateTo = async (
  destination: string,
  navigate: any,
  props?: any
) => {
  navigate(destination, { state: props ? props : {} });
};
```