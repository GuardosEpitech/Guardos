import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/images/`;


export const getImages = async (imageIds: number[]) => {
  try {
    const response = await axios({
      headers: {
        "content-type": "application/json",
      },
      method: "GET",
      url: baseUrl+"?imageIds="+imageIds,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return null;
  }
};

export const addProfileImage = async (userToken: string,
  imageName: string, contentType: string, size: number, base64: string) => {
  try {
    const body = {
      image: {
        filename: imageName,
        contentType: contentType,
        size: size,
        base64: base64,
      },
    };
    const response = await axios({
      url: baseUrl + 'profile',
      method: "POST",
      params: {key: userToken},
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  }
  catch (error) {
    console.error("Error adding image:", error);
    return null;
  }
};

export const deleteProfileImage = async (imageId: number,
  userToken: string) => {
  try {
    const body = {
      imageId: imageId
    };
    const response = await axios({
      url: baseUrl + 'profile',
      method: "DELETE",
      params: {key: userToken},
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    return null;
  }
};

export const deleteProfileImageDB = async (imageId: number,
  userToken: string) => {
  try {
    const body = {
      imageId: imageId
    };
    const response = await axios({
      url: baseUrl + 'profilePicDB',
      method: "DELETE",
      params: {key: userToken},
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    return null;
  }
};