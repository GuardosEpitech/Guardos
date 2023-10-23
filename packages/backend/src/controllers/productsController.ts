import mongoose from 'mongoose';
import {productSchema} from '../models/productsInterfaces';
import {restaurantSchema} from '../models/restaurantInterfaces';
import {IProduct} from '../../../shared/models/restaurantInterfaces';
import {IProductBE} from '../../../shared/models/productInterfaces';

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

export async function getProductByName(productName: string):Promise<IProductBE> {
  try {
    const Product = mongoose.model('Product', productSchema);
    return await Product.findOne({name: productName});
  } catch (error) {
    console.error('Error while fetching all products: ', error);
    return null;
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

export async function deleteProductByName(productName: string) {
  try {
    const Product = mongoose.model('Product', productSchema);
    const existingProduct = await Product.findOne({ name: productName });
    if (!existingProduct) {
      console.log('Product not found');
      return false;
    }
    await Product.deleteOne({ name: productName });
    console.log('Product deleted successfully');
    return true;
  } catch (error) {
    console.error('Error while deleting the product: ', error);
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
  const newProduct: IProductBE = {
    name: product.name ? product.name : oldProduct.name,
    id: oldProduct.id,
    allergens: product.allergens ? product.allergens : oldProduct.allergens,
    ingredients: product.ingredients ? product.ingredients : oldProduct.ingredients,
    restaurantId: product.restaurantId ? product.restaurantId : oldProduct.restaurantId,
  };
  await updateProduct(product, oldProduct.name);
  return newProduct;
}
