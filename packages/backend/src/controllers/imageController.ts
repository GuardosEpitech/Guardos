import Image from '../models/imageInterfaces';
import mongoose from 'mongoose';
import {restaurantSchema} from '../models/restaurantInterfaces';

export function convertToBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function saveImageToDB(
  filename: string, contentType: string, size: number, base64: string) {
  try {
    const newId = await getLatestID();
    const newImage = new Image({
      _id: newId + 1,
      filename: filename,
      contentType: contentType,
      size: size,
      uploadDate: new Date(),
      base64: base64
    });
    await newImage.save();
  } catch (e) {
    console.error(e);
    return e;
  }
  return 'success';
}

export function getLatestID(): Promise<number | null> {
  return new Promise((resolve, reject) => {
    Image.findOne()
      .sort({ _id: -1 })
      .exec()
      .then(res => {
        if (res) {
          resolve(res._id);
        } else {
          resolve(null);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function getImageById(id: number) {
  try {
    return await Image.findOne({_id: id})
      .exec();
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function linkImageToRestaurant(
  restaurantName: string, imageId: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const rest = await Restaurant.findOne({name: restaurantName});
    if (!rest) {
      return null;
    }
    rest.picturesId.push(imageId);
    await rest.save();
    console.log('Image added to restaurant');
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function linkImageToRestaurantDish(
  restaurantName: string, dishName: string, imageId: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const rest = await Restaurant.findOne({name: restaurantName});
    if (!rest) {
      return null;
    }
    const dish = rest.dishes.find((d) => d.name === dishName);
    if (!dish) {
      return null;
    }
    dish.picturesId.push(imageId);
    await rest.save();
    console.log('Image added to restaurant dish');
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function linkImageToRestaurantExtra(
  restaurantName: string, extraName: string, imageId: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const rest = await Restaurant.findOne({name: restaurantName});
    if (!rest) {
      return null;
    }
    const extra = rest.extras.find((e) => e.name === extraName);
    if (!extra) {
      return null;
    }
    extra.picturesId.push(imageId);
    await rest.save();
    console.log('Image added to restaurant extra');
  } catch (e) {
    console.error(e);
    return e;
  }
}
