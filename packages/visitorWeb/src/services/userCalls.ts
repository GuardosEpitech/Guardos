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
