import axios from "axios";

// eslint-disable-next-line max-len
const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/restaurants/`;
// eslint-disable-next-line max-len
const menuDesignUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/menuDesigns/`;
// eslint-disable-next-line max-len
const restoUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/search/restaurants/`;

export const getAllResto = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
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
  }
};

export const getAllRestaurantsByUserAndFilter = async (userToken: string,
  filter: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: restoUrl,
      data: { "filter": filter, "token": userToken }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
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
  }
};
