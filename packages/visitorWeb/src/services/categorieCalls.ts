import axios from 'axios';

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/categories`;

export const getCategories = async (userToken: string) => {
  try {
    const response = await axios({
      method: 'GET',
      url: baseUrl,
      params: {key: userToken},
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error in getFilteredRestos: ${error}`);
    throw error;
  }
}


