import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/`;

export const checkIfVisitorTokenIsValid = async (body: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'login/checkIn',
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

export const checkIfVisitorUserExist = async (body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'user/userVisitorExist',
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error while checking visitor user:", error);
    throw new Error("Error checking visitor user");
  }
};

export const deleteAccount = async (token: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'delete/',
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
