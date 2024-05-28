import axios from "axios";

const baseUrl =
  `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/permissions/resto/`;

export const getRestoUserPermission = async (token: string) => {
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
    console.error("Error fetching the User Permissions:", error);
  }
};

export const addRestoUserPermissions = async (token: string, permissions: string[]) => {
  try {
    const response = await axios({
      method: 'POST',
      url: baseUrl + 'addPermissions',
      params: {key: token},
      data: {
        permissions: permissions
      },
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user permissions:", error);
  }
};

export const removeRestoUserPermissions = async (token: string, permissions: string[]) => {
  try {
    const response = await axios({
      method: "PUT",
      url: baseUrl + 'removePermissions',
      params: {key: token},
      data: {
        permissions: permissions
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
    console.error("Error removing user permissions:", error);
  }
};

export const deleteAllRestoUserPermissions = async (token: string) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: baseUrl + 'deleteAllPermissions',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting all user permissions:", error);
  }
};
