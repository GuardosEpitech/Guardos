import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api`;

export const getRatingData = async (id: number) => (
  axios.get(`${baseUrl}/review/restaurants/${id}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    }) 
);
