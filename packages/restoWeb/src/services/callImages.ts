import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/images/`;

export const getImage = async (imageId: number) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
      data: JSON.stringify({ imageId: imageId }),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
  }
};

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
  }
};

export const addImageResto = async (restaurantId: number,
  imageName: string, contentType: string, size: number, base64: string) => {
  try {
    const body = {
      restaurant: restaurantId,
      image: {
        filename: imageName,
        contentType: contentType,
        size: size,
        base64: base64,
      },
    };
    const response = await axios({
      url: baseUrl,
      method: "POST",
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding image:", error);
  }
};

export const deleteImageRestaurant = 
    async (imageId: number, restaurantId: number) => {
      try {
        const body = {
          restaurant: restaurantId,
          imageId: imageId
        };
        const response = await axios({
          url: baseUrl,
          method: "DELETE",
          data: body,
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    };

export const addImageDish = async (restaurantId: number, dishId: number,
  imageName: string, contentType: string, size: number, base64: string) => {
  try {
    const body = {
      restaurant: restaurantId,
      dish: {
        dishId: dishId
      },
      image: {
        filename: imageName,
        contentType: contentType,
        size: size,
        base64: base64,
      },
    };
    const response = await axios({
      url: baseUrl,
      method: "POST",
      data: body,
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  }
  catch (error) {
    console.error("Error adding image:", error);
  }
};

export const deleteImageDish = async (imageId: number, restaurantId: number,
  dishId: number) => {
  try {
    const body = {
      restaurant: restaurantId,
      dish: {
        dishId: dishId
      },
      imageId: imageId
    };
    const response = await axios({
      url: baseUrl,
      method: "DELETE",
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

export const addRestoProfileImage = async (userToken: string,
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
      url: baseUrl + 'restoProfile',
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
  }
};

export const deleteRestoProfileImage = async (imageId: number,
  userToken: string) => {
  try {
    const body = {
      imageId: imageId
    };
    const response = await axios({
      url: baseUrl + 'restoProfile',
      method: "DELETE",
      params: {key: userToken},
      data: body,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
