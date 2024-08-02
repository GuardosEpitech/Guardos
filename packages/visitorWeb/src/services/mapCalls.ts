import axios from "axios";

const baseUrl =
  `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/map/geocode`;

export const getCurrentCoords = async (address: string) => {
    try {
        const body = {
            address: address
        };

        const response = await axios({
          method: "POST",
          url: baseUrl,
          data: body,
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
        console.error("Error fetching the current coordinats:", error);
      }
}