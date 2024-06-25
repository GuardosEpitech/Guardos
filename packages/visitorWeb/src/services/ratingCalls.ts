import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api`;

export const getRatingData = async (name: string) => (
  axios.get(`${baseUrl}/review/restaurants/${name}`)
  .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
      console.log(error);
    }) 
)

export const postRatingData = async (name: string, comment: string, note: number, token: string) => (
    axios.post(`${baseUrl}/review/restaurants/${name}?key=${token}`, { comment, note })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
      console.log(error);
    }) 
)
