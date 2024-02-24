import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/`;

export const checkIfTokenIsValid = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'login/restoWeb/checkIn',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching the Users:", error);
    throw new Error("Error fetching the Users");
  }
};

export const checkIfRestoUserExist = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'user/userRestoExist',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking resto user:", error);
    throw new Error("Error checking resto user");
  }
};

export const deleteRestoAccount = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'delete/resto',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error deleting the User:", error);
    throw new Error("Error deleting the User");
  }
};
