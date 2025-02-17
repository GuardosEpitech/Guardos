import mongoose from 'mongoose';
import {productSchema} from '../models/productsInterfaces';
import {restaurantSchema} from '../models/restaurantInterfaces';
import {IProduct} from '../../../shared/models/restaurantInterfaces';
import {IProductBE} from '../../../shared/models/productInterfaces';
import {getIngredientByName} from './ingredientsController';
import {changeDishByID,
  getAllergensFromDishProducts,
  getDishesByRestaurantNameTypeChecked}
  from './dishesController';
import {IDishesCommunication} from '../models/communicationInterfaces';
import {detectAllergensByProduct} from './allergenDetectionController';

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

function normalizeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

export async function createOrUpdateProduct
(product: IProduct, restaurantId: number) {
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
      } else {
        const allergen = await detectAllergensByProduct([ingredientName]);
        if (allergen && allergen.length > 0) {
          allergens.push(...allergen[0].allergens);
        }
      }
    }
    allergens = Array.from(new Set(allergens)) as string[];
    // const existingProduct = await Product.findOne({ name: product.name });
    const normalizedName = normalizeName(product.name);
    const existingProduct = await Product.findOne({
      name: { $regex: `^${normalizedName}$`, $options: 'i' }
    });
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

export async function getProductByName(productName: string)
    :Promise<IProductBE> {
  try {
    const Product = mongoose.model('Product', productSchema);
    return await Product.findOne({name: { $regex: productName, $options: 'i'}});
  } catch (error) {
    console.error('Error while fetching all products: ', error);
    return null;
  }
}

export async function getUserProductByName(productName: string, userID: number)
  :Promise<IProductBE> {
  try {
    const Product = mongoose.model('Product', productSchema);
    return await Product.findOne({
      name: { $regex: productName, $options: 'i'},
      userID: userID
    });
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

export async function deleteAllProductsFromUser(userId: number) {
  try {
    const Product = mongoose.model('Product', productSchema);
    const existingProducts = await Product.find({ userID: userId });
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

export async function updateProduct(product: IProductBE, oldName: string, userID: number) {
  const Product = mongoose.model('Product', productSchema);
  return Product.findOneAndUpdate(
    { name: oldName, userID: userID },
    product,
    { new: true }
  );
}

export async function changeProductByName
(product: IProductBE, oldProductsName:string, userID: number) {
  const oldProduct = await getUserProductByName(oldProductsName, userID);

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
  await updateProduct(newProduct, oldProductsName, userID);
  if (product.ingredients) {
    for (const ingredient of product.ingredients) {
      await updateAllDishesWithIngredient(ingredient, oldProduct.userID);
    }
  }
  return newProduct;
}

async function updateAllDishesWithIngredient
(ingredientName: string, userID: number) {
  const Product = mongoose.model('products', productSchema);
  const Restaurant = mongoose.model('restaurants', restaurantSchema);
  const restoOfUser = await Restaurant.find({ userID: userID });
  const products = await Product.find({ ingredients: ingredientName });

  for (const product of products) {
    if (product.userID === userID) {
      for (const resto of restoOfUser) {
        if (product.userID === resto.userID) {
          const dishes =
              await getDishesByRestaurantNameTypeChecked(
                  await resto.name as string, userID);
          for (const dish of dishes) {
            const newDish: IDishesCommunication = {
              discount: dish.discount as number,
              pictures: dish.pictures as [string],
              picturesId: dish.picturesId as [number],
              products: dish.products as [string],
              restoChainID: dish.restoChainID as number,
              uid: dish.uid as number,
              userID: userID,
              validTill: dish.validTill as string,
              name: dish.name as string,
              description: dish.description as string,
              price: dish.price as number,
              category: {
                menuGroup: dish.category.menuGroup as string,
                foodGroup: dish.category.foodGroup as string,
                extraGroup: dish.category.extraGroup as [string],
              },
              combo: dish.combo as [number],
              allergens: []
            };
            newDish.allergens = await
            getAllergensFromDishProducts(newDish, userID);
            await changeDishByID(
                  resto._id as number, newDish, newDish.allergens, userID);
          }
        }
      }
    }
  }
}
