ingredientsSchema:
------------------

```java
export const ingredientsSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  allergens: [String],
});
```