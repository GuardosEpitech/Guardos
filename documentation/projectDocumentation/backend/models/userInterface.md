userSchema:
-----------

```java
export const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  allergens: [String],
});
```