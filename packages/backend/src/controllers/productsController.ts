import mongoose from 'mongoose';
import {productSchema} from '../models/productsInterfaces';
import {restaurantSchema} from '../models/restaurantInterfaces';
import {IProduct} from '../../../shared/models/restaurantInterfaces';
import {IProductBE} from '../../../shared/models/productInterfaces';
import {getIngredientByName} from './ingredientsController';

export async function getMaxProductId() {
  const Product = mongoose.model('Product', productSchema);
  try {
    const product = await Product.find()
      .sort({ _id: -1 })
      .limit(1);
    if (product.length === 0) {
      console.log('No products found.');
      return -1;
    }
    console.log(product);
    const maxProductId = product[0]._id +1;
    console.log('Max product id is: ', maxProductId);
    return maxProductId;
  } catch (error) {
    console.error('Error occurred while getting max product id: ', error);
    return null;
  }
}

export async function createOrUpdateProduct(product: IProduct, restaurantId: number) {
  try {
    const Product = mongoose.model('Product', productSchema);
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.log(`Restaurant with ID: ${restaurantId} not found`);
      return;
    }

    let allergens = [];
    for (const ingredientName of product.ingredients) {
      const ingredient = await getIngredientByName(ingredientName);
      if (ingredient && ingredient.length > 0) {
        allergens.push(...ingredient[0].allergens);
      }
    }
    allergens = Array.from(new Set(allergens));

    const existingProduct = await Product.findOne({ name: product.name });

    if (existingProduct) {
      if (existingProduct.userID === restaurant.userID) {
        existingProduct.allergens = allergens;
        existingProduct.ingredients = product.ingredients;
        if (!existingProduct.restaurantId.includes(restaurantId)) {
          existingProduct.restaurantId.push(restaurantId);
        }
        await existingProduct.save();
      } else {
        const maxProductIdResult = await getMaxProductId();
        if (maxProductIdResult === null) {
          console.log('Error while getting max product id');
          return;
        }

        const newProduct = new Product({
          _id: maxProductIdResult,
          userID: restaurant.userID,
          name: product.name,
          allergens: allergens,
          ingredients: product.ingredients,
          restaurantId: [restaurantId],
        });
        await newProduct.save();
        return newProduct;
      }
    } else {
      const maxProductIdResult = await getMaxProductId();
      if (maxProductIdResult === null) {
        console.log('Error while getting max product id');
        return;
      }

      const newProduct = new Product({
        _id: maxProductIdResult,
        userID: restaurant.userID,
        name: product.name,
        allergens: allergens,
        ingredients: product.ingredients,
        restaurantId: [restaurantId],
      });
      await newProduct.save();
      return newProduct;
    }
  } catch (error) {
    console.error('Error while creating or updating a product: ', error);
  }
}

export async function addProductsFromRestaurantToOwnDB(restaurantId: number) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.log(`Restaurant with ID: ${restaurantId} not found`);
      return;
    }

    for (const product of restaurant.products) {
      const Product = mongoose.model('Product', productSchema);
      const existingProduct = await Product.findOne({ name: product.name });
      if (!existingProduct) {
        const maxProductId = await getMaxProductId();
        if (!maxProductId) {
          console.log('Error while getting max product id');
          return;
        }
        const newProduct = new Product({
          _id: maxProductId,
          userID: restaurant.userID,
          name: product.name,
          allergens: product.allergens,
          ingredients: product.ingredients,
          restaurantId: [restaurantId]
        });
        await newProduct.save();
      } else if (!existingProduct.restaurantId.includes(restaurantId)) {
        existingProduct.restaurantId.push(restaurantId);
        await existingProduct.save();
      }
    }
    console.log(`Successfully added/updated products from Restaurant with
     ID: ${restaurantId}`);
  } catch (error) {
    console.error(`Error while adding products from Restaurant with
     ID: ${restaurantId} to Product collection: `, error);
  }
}

export async function getProductByName(productName: string):Promise<IProductBE> {
  try {
    const Product = mongoose.model('Product', productSchema);
    return await Product.findOne({name: { $regex: productName, $options: 'i'}});
  } catch (error) {
    console.error('Error while fetching all products: ', error);
    return null;
  }
}

export async function getProductsByUser(loggedInUserId: number) {
  try {
    const Product = mongoose.model('Product', productSchema);
    return await Product.find({ userID: loggedInUserId });
  } catch (error) {
    console.error('Error while fetching all products: ', error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    const Product = mongoose.model('Product', productSchema);
    return await Product.find({});
  } catch (error) {
    console.error('Error while fetching all products: ', error);
    return [];
  }
}

export async function deleteProductByName(productName: string, userId: number) {
  try {
    const Product = mongoose.model('Product', productSchema);
    const existingProducts = await Product.find({ name: productName });
    if (!existingProducts || existingProducts.length === 0) {
      console.log('Product not found');
      return false;
    }
    let productDeleted = false;
    for (const product of existingProducts) {
      if (product.userID === userId) {
        await Product.deleteOne({ _id: product._id });
        console.log(`Product with ID ${product._id} deleted successfully`);
        productDeleted = true;
      }
    }
    if (productDeleted) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}

export async function updateProduct(product: IProductBE, oldName: string) {
  const Product = mongoose.model('Product', productSchema);
  return Product.findOneAndUpdate(
    { name: oldName },
    product,
    { new: true }
  );
}

export async function changeProductByName(product: IProductBE, oldProductsName:string) {
  const oldProduct = await getProductByName(oldProductsName);

  let allergens = [];
  for (const ingredientName of product.ingredients) {
    const ingredient = await getIngredientByName(ingredientName);
    if (ingredient && ingredient.length > 0) {
      allergens.push(...ingredient[0].allergens);
    }
  }
  allergens = Array.from(new Set(allergens));

  const newProduct: IProductBE = {
    name: product.name ? product.name : oldProduct.name,
    userID: oldProduct.userID,
    id: oldProduct.id,
    allergens: allergens,
    ingredients: product.ingredients ? product.ingredients :
      oldProduct.ingredients,
    restaurantId: product.restaurantId ? product.restaurantId :
      oldProduct.restaurantId,
  };
  await updateProduct(newProduct, oldProductsName);
  return newProduct;
}
