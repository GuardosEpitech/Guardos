import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/restaurants/`;

export const getRestaurant = async (name: string) => {
    try {
      const response = await axios({
        headers: {
          "content-type": "application/json",
        },
        method: "GET",
        url: baseUrl + name,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      throw new Error("Failed to fetch restaurant");
    }
  };
