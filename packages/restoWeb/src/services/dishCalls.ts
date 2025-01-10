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
      url: baseUrl + body.resto,
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

export const editDish = async (restoName: string, dish: IDishFE, token: string, oldName: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "PUT",
      params: {key: token},
      data: JSON.stringify({
        oldName: oldName,
        name: dish.name,
        uid: dish.uid,
        description: dish.description,
        price: dish.price,
        allergens: dish.allergens,
        picturesId: dish.picturesId,
        category: dish.category,
        resto: dish.category,
        products: dish.products,
        discount: dish.discount,
        validTill: dish.validTill,
        combo: dish.combo,
        restoChainID: dish.restoChainID,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error editing dish:", error);
  }
};

export const deleteDish = async (restoName: string, dishName: string, token: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      params: {key: token},
      data: JSON.stringify({ name: dishName }),
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

export const getDishesByResto = async (name: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + name,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes by resto:", error);
  }
}

export const addCombo = async (token: string, body: any) => {
  try {
    const response = await axios({
      url: baseUrl + 'addCombo',
      method: "POST",
      params: {key: token},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes by resto:", error);
  }
}

export const removeCombo = async (token: string, body: any) => {
  try {
    const response = await axios({
      url: baseUrl + 'removeCombo',
      method: "POST",
      params: {key: token},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes by resto:", error);
  }
}

export const getDishesByID = async(restoName: string, body: any) => {
  try {
    const response = await axios({
      url: baseUrl + 'dishIDs',
      method: "POST",
      params: {key: restoName},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes by id:", error);
  }
}
