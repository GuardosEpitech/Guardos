import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/user/`;

export const checkIfVisitorUserExist = async (body: any) => {
    try {
      const response = await axios({
        method: "GET",
        url: baseUrl + 'userVisitorExist',
        params: body,
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error while checking visitor user:", error);
      throw new Error("Error checking visitor user");
    }
  };