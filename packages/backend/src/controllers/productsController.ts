import mongoose from 'mongoose';
import { productSchema } from '../models/productsInterfaces';
import { restaurantSchema } from '../models/restaurantInterfaces';
import { IProduct } from '../../../shared/models/restaurantInterfaces';

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

    const maxProductId = product[0]._id +1;
    console.log('Max product id is: ', maxProductId);
    return maxProductId;
  } catch (error) {
    console.error('Error occurred while getting max product id: ', error);
    return null;
  }
}

export async function createOrUpdateProduct(product: IProduct,
  restaurantId: number) {
  try {
    const Product = mongoose.model('Product', productSchema);
    const existingProduct = await Product.findOne({ name: product.name });

    if (!existingProduct) {
      const maxProductIdResult = await getMaxProductId();
      if (maxProductIdResult === null) {
        console.log('Error while getting max product id');
        return;
      }
      const newProduct = new Product({
        _id: maxProductIdResult,
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

export async function addProductsToDB(restaurantId: number, product: IProduct) {
  const Restaurant = mongoose.model('Restaurant', restaurantSchema);
  const Product = mongoose.model('Product', productSchema);
  try {

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      console.log(`Restaurant with ID: ${restaurantId} not found`);
      return;
    }

    const existingProduct = await Product.findOne({ name: product.name });
    if (!existingProduct) {
      const maxProductId = await getMaxProductId();
      if (!maxProductId) {
        console.log('Error while getting max product id');
        return;
      }
      const newProduct = new Product({
        _id: maxProductId,
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
  } catch (error) {
    console.error(`Error while adding product from Restaurant with
     ID: ${restaurantId} to Product collection: `, error);
  }
}
