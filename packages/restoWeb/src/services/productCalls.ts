import axios from "axios";
import { IProduct } from "shared/models/restaurantInterfaces";
import { IProductFE } from "shared/models/productInterfaces";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/`;

// export const getAllRestoProducts = async (restoName: string) => {
//   try {
//     const response = await axios({
//       method: "GET",
//       url: baseUrl + "api/products/" + restoName,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching all restaurant products:", error);
//   }
// };
//
// export const getAllProducts = async () => {
//   try {
//     const response = await axios({
//       method: "GET",
//       url: baseUrl + "api/products" + "/",
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching all products:", error);
//   }
// };

export const getProductsByUser = async (userToken: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + "api/products" + "/user/product",
      params: {key: userToken},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all products from user:", error);
  }
};

export const addNewProduct = async (product: IProduct, restoId: number, token: string) => {
  try {
    if (!product.name) {
      console.error("Error adding new product:");
      return;
    }
    const response = await axios({
      url: baseUrl + "api/products/" + restoId,
      method: "POST",
      params: {key: token},
      data: JSON.stringify({
        name: product.name,
        ingredients: product.ingredients,
        allergens: product.allergens,
        resto: restoId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new product:", error);
  }
};

export const deleteProduct = async (product: any, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + "api/products/" + product._id,
      method: "DELETE",
      params: {key: token},
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(product),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

export const editProduct = async (product: IProductFE, productId: number, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + "api/products/" + productId,
      method: "PUT",
      params: {key: token},
      data: JSON.stringify({
        name: product.name,
        ingredients: product.ingredients,
        allergens: product.allergens,
        restaurantId: product.restaurantId
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing product:", error);
  }
};
