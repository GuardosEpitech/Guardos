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
    if (response.status === 200 || response.status === 207) {
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error editing the Users Details:", error);
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
  }
};

export const getSavedFilters = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'filter',
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
    console.error("Error saving filter:", error);
  }
};

export const getSavedFilterLimit = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'filterLimit',
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
    console.error("Error saving filter:", error);
  }
};

export const getSavedFilter = async (token: string, filterName: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'filter/id',
      params: {key: token},
      data: {filterName: filterName},
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
    return response;
  } catch (error) {
    console.error("Error saving filter:", error);
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
  }
};

export const deleteSavedFilter = async (token: string, filterName: string) => {
  try {
    const response = await axios({
      method: "DELETE",
      url: baseUrl + 'filter',
      params: {key: token},
      data: {filterName: filterName},
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
  }
};

export const setUserPreferences = async (token: string, body: any) => {
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

export const getUserPreferences = async (token: string) => {
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
