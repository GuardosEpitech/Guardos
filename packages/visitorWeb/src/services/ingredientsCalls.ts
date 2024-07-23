import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/ingredients/`;

export const getAllIngredients = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all ingredients:", error);
  }
};

export const addIngredient = async (ingredient: string) => {
  try {
    const response = await axios({
      url: baseUrl,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        name: ingredient
      }),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding ingredient:", error);
  }
};
