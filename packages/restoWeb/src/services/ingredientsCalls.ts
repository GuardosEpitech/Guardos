import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/ingredients/`;

export const getAllIngredients = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + "api/ingredients" + "/",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all ingredients:", error);
    throw new Error("Failed to fetch all ingredients");
  }
};