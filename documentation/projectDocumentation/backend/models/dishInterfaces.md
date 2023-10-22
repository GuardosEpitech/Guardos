dishSchema:
-----------

```java
export const dishSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  description: String,
  products: [String],
  pictures: [String],
  price: Number,
  allergensOld: String,
  category: {
    menuGroup: String,
    foodGroup: String,
    extraGroup: [String],
  },
});
```