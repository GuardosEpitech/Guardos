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
    throw new Error("Failed to fetch image");
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
    throw new Error("Failed to fetch images");
  }
};

export const addImageResto = async (restaurantName: string,
  imageName: string, contentType: string, size: number, base64: string) => {
  try {
    const body = {
      restaurant: restaurantName,
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
    throw new Error("Failed to add image");
  }
};

export const deleteImageRestaurant = 
    async (imageId: number, restaurantName: string) => {
      try {
        const body = {
          restaurant: restaurantName,
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

export const addImageDish = async (restaurantName: string, dishName: string,
  imageName: string, contentType: string, size: number, base64: string) => {
  try {
    const body = {
      restaurant: restaurantName,
      dish: dishName,
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
    throw new Error("Failed to add image");
  }
};

export const deleteImageDish = async (imageId: number, restaurantName: string,
  dishName: string) => {
  try {
    const body = {
      restaurant: restaurantName,
      dish: dishName,
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
    throw new Error("Failed to delete image");
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
    throw new Error("Failed to add image");
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
    throw new Error("Failed to delete image");
  }
};
