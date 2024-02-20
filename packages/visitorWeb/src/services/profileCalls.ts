import axios from "axios";

const baseUrl =
  `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/profile/`;

export const getVisitorProfileDetails = async (token: string) => {
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
    console.error("Error fetching the Users Details:", error);
    throw new Error("Error fetching the Users Details");
  }
};

export const editVisitorProfileDetails = async (token: string, body: any) => {
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
    console.error("Error editing the Users Details:", error);
    throw new Error("Error editing the Users Details");
  }
};

export const changeVisitorPassword = async (token: string, oldPassword: string,
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
    throw new Error("Error changing the password of the Users");
  }
};

export const addSavedFilter = async (token: string, body: any) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + 'filter',
      params: {key: token},
      data: JSON.stringify(body),
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
    console.error("Error saving filter:", error);
    throw new Error("Error saving filter");
  }
};

export const editSavedFilter = async (token: string, body: any) => {
  try {
    const response = await axios({
      method: "PUT",
      url: baseUrl + 'filter',
      params: {key: token},
      data: JSON.stringify(body),
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
    console.error("Error editing filter:", error);
    throw new Error("Error editing filter");
  }
};

export const deleteSavedFilter = async (token: string, filterId: number) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'filter',
      params: {key: token},
      data: {filterId: filterId},
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
    console.error("Error deleting filter:", error);
    throw new Error("Error deleting filter");
  }
};
