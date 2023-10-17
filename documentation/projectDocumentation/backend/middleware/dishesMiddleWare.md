checkIfNameExists():
--------------------

```java
export function checkIfNameExists(req: IDishesCommunication) {
  if (!req.name) {
    console.log('Missing name');
    return false;
  }
  return true;
}
```

This function takes a dish object as argument and depending on the name variable of the object will return true if it exists or false if the name is empty.