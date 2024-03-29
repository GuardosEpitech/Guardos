import axios from "axios";
import { IAddDish } from "shared/models/dishInterfaces";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/dishes/`;

export const getAllDishes = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all dishes:", error);
    throw new Error("Failed to fetch all dishes");
  }
};

export const getDishesByUser = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'user/dish',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all dishes from user:", error);
    throw new Error("Failed to fetch all dishes from user");
  }
};

export const addNewDish = async (body: IAddDish) => {
  try {
    const response = await axios({
      url: baseUrl + body.resto,
      method: "POST",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding dish:", error);
    throw new Error("Failed to add dish");
  }
};

export const editDish = async (restoName: string, body: any) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "PUT",
      data: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing dish:", error);
    throw new Error("Failed to edit dish");
  }
};

export const deleteDish = async (restoName: string, dishName: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ name: dishName }),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw new Error("Failed to delete dish");
  }
};
