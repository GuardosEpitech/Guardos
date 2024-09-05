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
)

export const postRatingData = async (id: number, comment: string, note: number, token: string) => (
    axios.post(`${baseUrl}/review/restaurants/${id}?key=${token}`, { comment, note })
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
      console.log(error);
    }) 
)
