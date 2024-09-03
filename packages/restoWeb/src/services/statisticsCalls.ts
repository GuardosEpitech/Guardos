import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/`;

export const getRestoStatistics = async (token: string) => {
  try {
    const response = await axios({
      method: "GET",
      url: baseUrl + 'statistics/restaurant',
      params: {key: token},
      headers: {
        "content-type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching the Users:", error);
  }
};
