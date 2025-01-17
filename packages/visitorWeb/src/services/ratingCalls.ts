import axios from "axios";

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api`;

export const getRatingData = async (restoID: number) =>
  axios
    .get(`${baseUrl}/review/restaurants/${restoID}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });

export const getRatingDataUser = async (userName: string) =>
  axios
    .get(`${baseUrl}/review/${userName}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
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
  restoID: number,
  comment: string,
  note: number,
  userName: string
) =>
  axios
    .post(`${baseUrl}/review/restaurants/${restoID}`, { comment, note, userName })
    .then(function (response) {
      console.log(`Post with ID ${userName}`);
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
