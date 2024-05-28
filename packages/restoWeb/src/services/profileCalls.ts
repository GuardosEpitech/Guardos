import axios from "axios";

const baseUrl =
  `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/profile/resto/`;

export const getProfileDetails = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
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
    console.error("Error fetching the User Details:", error);
  }
};

export const editProfileDetails = async (token: string, body: any) => {
  try {
    const response = await axios({
      method: "PUT",
      url: baseUrl,
      params: {key: token},
      data: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error editing the User Details:", error);
  }
};

export const changePassword = async (token: string, oldPassword: string,
  newPassword: string) => {
  try {
    const response = await axios({
      method: "PUT",
      url: baseUrl + 'password',
      params: {key: token},
      data: {
        oldPassword: oldPassword,
        newPassword: newPassword
      },
      headers: {
        "content-type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error changing the password of the Users:", error);
  }
};

export const setUserRestoPreferences = async (token: string, body: any) => {
  try {
    const response = await axios({
      method: 'POST',
      url: baseUrl + 'setCookiePref',
      params: {key: token},
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error setting Cookie preferences:", error);
  }
};

export const getUserRestoPreferences = async (token: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: baseUrl + 'getCookiePref',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error getting Cookie preferences:", error);
  }
};