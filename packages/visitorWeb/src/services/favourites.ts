import axios from 'axios';

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/favourites/`;

export const addRestoAsFavourite = async (userToken: string, restoID: number) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}resto`,
      params: {key: userToken},
      data: JSON.stringify({ restoID: restoID }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in addRestoAsFavourite: ${error}`);
    return null;
  }
};

export const addDishAsFavourite = async (userToken: string, restoID: number, dishID: number) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${baseUrl}dish`,
      params: {key: userToken},
      data: JSON.stringify({
        restoID: restoID,
        dishID: dishID
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in addDishAsFavourite: ${error}`);
    return null;
  }
};

export const deleteRestoFromFavourites = async (userToken: string, restoID: number) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${baseUrl}resto`,
      data: JSON.stringify({ restoID: restoID }),
      params: {key: userToken},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in deleteRestoFromFavourites: ${error}`);
    return null;
  }
};

export const deleteDishFromFavourites = async (userToken: string, restoID: number, dishID: number) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${baseUrl}dish`,
      params: {key: userToken},
      data: JSON.stringify({
        restoID: restoID,
        dishID: dishID
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in deleteDishFromFavourites: ${error}`);
    return null;
  }
};

export const getRestoFavourites = async (userToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}resto`,
      params: {key: userToken},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in getRestoFavourites: ${error}`);
    return null;
  }
};

export const getDishFavourites = async (userToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${baseUrl}dish`,
      params: {key: userToken},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in getDishFavourites: ${error}`);
    return null;
  }
};
