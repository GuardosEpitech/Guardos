import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/restaurants/`;
const menuDesignUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/menuDesigns/`;

export const getAllResto = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    throw new Error("Failed to fetch all restaurants");
  }
};

export const addNewResto = async (body: any) => {
  try {
    const response = await axios({
      url: baseUrl,
      method: "POST",
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new restaurant:", error);
    throw new Error("Failed to add new restaurant");
  }
};

export const editResto = async (restoName: string, body: any) => {
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
    console.error("Error editing restaurant:", error);
    throw new Error("Failed to edit restaurant");
  }
};

export const deleteResto = async (restoName: string) => {
  try {
    const response = await axios({
      url: baseUrl + restoName,
      method: "DELETE",
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw new Error("Failed to delete restaurant");
  }
};

export const getAllRestaurantsByUser = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'user/resto',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    throw new Error("Failed to fetch all restaurants");
  }
};

export const getAllMenuDesigns = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: menuDesignUrl
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all menu designs:", error);
    throw new Error("Failed to fetch all menu designs");
  }
};

export const updateRestoCategories = async (userToken: string, uid: number, newCategories: any) => {
  try {
    const response = await axios({
      url: baseUrl + 'updateCategories', 
      method: 'POST',
      data: {
        userToken: userToken,
        uid: uid,
        newCategories: newCategories
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user categories:', error);
    throw new Error('Failed to update user categories');
  }
};