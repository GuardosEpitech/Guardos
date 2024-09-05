import {checkIfRestaurantExistsWithId} from './restaurantMiddleWare';
import {Request} from 'express';
import {checkIfDishExists, checkIfExtraExists} from './dishesMiddelWare';
import {getImageById} from '../controllers/imageController';
import {IImage} from '../models/imageInterfaces';

export function errorHandlingImage(_req: Request) {
  const base64: string = _req.body.image.base64;
  const filename: string = _req.body.image.filename;
  const contentType: string = _req.body.image.contentType;
  const size: number = _req.body.image.size;

  if (!base64)
    return 'Post Images failed: base64 missing';
  if (!filename)
    return 'Post Images failed: filename missing';
  if (!contentType)
    return 'Post Images failed: contentType missing';
  if (size === undefined || size === null || isNaN(Number(size))) {
    return 'Post Images failed: size missing or not a number';
  }
}

export async function errorHandlingRestoDishImage(_req: Request) {
  const restaurantId: number = _req.body.restaurant;

  if (await checkIfRestaurantExistsWithId(restaurantId) === false) {
    return 'Post Images failed: Restaurant does not exist';
  }
  const dishName: string = _req.body.dish;
  const extraName: string = _req.body.extra;

  if (dishName) {
    if (await checkIfDishExists(restaurantId, dishName) === false)
      return 'Post Images failed: Dish does not exist';
  }
  if (extraName) {
    if (await checkIfExtraExists(restaurantId, extraName) === false)
      return 'Post Images failed: Extra does not exist';
  }

  return errorHandlingImage(_req);
}

export async function errorHandlingImageDelete(_req: Request) {
  const imageId: number = _req.body.imageId;

  if (imageId === undefined || imageId === null || isNaN(Number(imageId))) {
    return 'Delete Images failed: imageId missing or not a number';
  }

  const image = await getImageById(imageId);

  if (!image) {
    return 'Delete Images failed: Image does not exist';
  }
}

export async function errorHandlingRestoDishImageDelete(_req: Request) {
  const restaurantId: number = _req.body.restaurant;
  const dishName: string = _req.body.dish;
  const extraName: string = _req.body.extra;

  if (!restaurantId)
    return 'Delete Image failed: restaurantId is missing';

  if (await checkIfRestaurantExistsWithId(restaurantId) === false) {
    return 'Delete Images failed: Restaurant does not exist';
  }

  if (dishName) {
    if (await checkIfDishExists(restaurantId, dishName) === false)
      return 'Delete Images failed: Dish does not exist';
  }
  if (extraName) {
    if (await checkIfExtraExists(restaurantId, extraName) === false)
      return 'Delete Images failed: Extra does not exist';
  }

  return errorHandlingImageDelete(_req);
}

export async function errorHandlingImageChange(_req: Request){
  const imageId = _req.body.imageId;

  if (imageId === undefined || imageId === null || isNaN(Number(imageId))) {
    return 'Change Images failed: imageId missing or not a number';
  }

  const imageIdTest = await getImageById(imageId) as IImage;
  const image = _req.body.image as IImage;
  if (!imageIdTest) {
    return 'Change Images failed: Image does not exist';
  }
  if (!image.base64) {
    return 'Change Images failed: base64 missing';
  }
  if (!image.filename) {
    return 'Change Images failed: filename missing';
  }
  if (!image.contentType) {
    return 'Change Images failed: contentType missing';
  }
  if (image.size === undefined || image.size === null ||
      isNaN(Number(image.size))) {
    return 'Change Images failed: size missing or not a number';
  }
}
