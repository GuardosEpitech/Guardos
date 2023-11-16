import axios from "axios";
import { IProduct } from "shared/models/restaurantInterfaces";
import { IProductFE } from "shared/models/productInterfaces";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/`;

export const getAllRestoProducts = async (restoName: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + "api/products/" + restoName,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurant products:", error);
    throw new Error("Failed to fetch all restaurant products");
  }
};

export const getAllProducts = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + "api/products" + "/",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw new Error("Failed to fetch all products");
  }
};

export const addNewProduct = async (product: IProduct, restoName: string) => {
  try {
    if (!product.name) {
      console.error("Error adding new product:");
      throw new Error("Failed to add new product");
    }
    const response = await axios({
      url: baseUrl + "api/products/" + restoName,
      method: "POST",
      data: JSON.stringify({
        name: product.name,
        ingredients: product.ingredients,
        allergens: product.allergens,
        resto: restoName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new product:", error);
    throw new Error("Failed to add new product");
  }
};

export const deleteProduct = async (product: any) => {
  try {
    const response = await axios({
      url: baseUrl + "api/products/" + product.name,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(product),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
};

export const editProduct = async (product: IProductFE, originalProductName: string) => {
  try {
    const response = await axios({
      url: baseUrl + "api/products/" + originalProductName,
      method: "PUT",
      data: JSON.stringify(product),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing product:", error);
    throw new Error("Failed to edit product");
  }
};
