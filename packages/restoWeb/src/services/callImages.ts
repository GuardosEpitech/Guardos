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
      method: "GET",
      url: baseUrl,
      data: JSON.stringify({ imageIds: imageIds }),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw new Error("Failed to fetch images");
  }
};
