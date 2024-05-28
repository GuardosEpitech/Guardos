import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api`;

export const getRestosMenu = async (restoId: number, allergenList: string[]) => {
  try {
    const response = await axios({
      method: "POST",
      url: baseUrl + '/menu',
      data: JSON.stringify({
        restoID: restoId,
        allergenList: allergenList
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
  }
};
