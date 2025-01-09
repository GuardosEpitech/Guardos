import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api`;

export const getRestosMenu = async (restoId: number, allergenList: string[], dislikedIngredients: string[]) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + '/menu',
      data: JSON.stringify({
        restoID: restoId,
        allergenList: allergenList,
        dislikedIngredientsList: dislikedIngredients
      }),
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
    console.error("Error fetching the Users:", error);
    return null;
  }
};

export const getDishesByID = async (restoId: number, body: any) => {
  try {
    const response = await axios({
      url: baseUrl + '/dishes/dishIDsByID',
      method: "POST",
      params: {key: restoId},
      data: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes by id:", error);
    return null;
  }
}

export const getRestaurantDetails = async (restoID: number) => {
  try {
    const response = await axios({
      url: `${baseUrl}/restaurants/`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const restaurants = response.data;
    const restaurant = restaurants.find((resto: any) => resto.uid === restoID);

    if (restaurant) {
      return [restaurant.name, restaurant.location];
    } else {
      throw new Error("Restaurant not found");
    }
  } catch (error) {
    console.error("Error fetching restaurant details:", error);
    return null;  }
};
