import axios from "axios";
import {IAddDish, IDishFE} from "shared/models/dishInterfaces";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/dishes/`;

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
  }
};

export const addNewDish = async (body: IAddDish, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + body.restoId,
      method: "POST",
      params: {key: token},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding dish:", error);
  }
};

export const editDish = async (restoId: number, dish: IDishFE, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoId,
      method: "PUT",
      params: {key: token},
      data: JSON.stringify(dish),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing dish:", error);
  }
};

export const deleteDish = async (restoId: number, dishId: number, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoId,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      params: {key: token},
      data: JSON.stringify({ id: dishId }),
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting dish:", error);
  }
};

export const addDiscount = async (body: any, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + 'addDiscount',
      method: "POST",
      params: {key: token},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding dish discount:", error);
  }
};

export const removeDiscount = async (body: any, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + 'removeDiscount',
      method: "POST",
      params: {key: token},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting dish discount:", error);
  }
};
