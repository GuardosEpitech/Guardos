import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/login/`;
const baseUrl1 = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/user/`;

export const checkIfTokenIsValid = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'restoWeb/checkIn',
      params: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching the Users:", error);
    throw new Error("Error fetching the Users");
  }
};

export const checkIfRestoUserExist = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl1 + 'userRestoExist',
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