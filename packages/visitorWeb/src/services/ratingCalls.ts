import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api`;

export const getRatingData = async (name: string) =>
  axios
    .get(`${baseUrl}/review/restaurants/${name}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

export const getRatingDataUser = async (userName: string) =>
  axios
    .get(`${baseUrl}/review/${userName}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

export const deleteRatingDataUser = async (
  reviewId: string,
  restoName: string
) =>
  axios
    .delete(`${baseUrl}/review/restaurants/${restoName}/${reviewId}`)
    .then(function (response) {
      console.log(`Deleted post with ID ${reviewId}`);
      return response.data;
    })
    .catch((error) => {
      console.error(error);
    });

export const postRatingData = async (
  name: string,
  comment: string,
  note: number,
  userName: string
) =>
  axios
    .post(`${baseUrl}/review/restaurants/${name}`, { comment, note, userName })
    .then(function (response) {
      console.log(`Post with ID ${userName}`);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
