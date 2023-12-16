import Image, {IImage} from '../models/imageInterfaces';
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

export async function deleteImageFromDB(id: number) {
  try {
    await Image.deleteOne({_id: id});
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
    return null;
  }
}

export async function changeImageById(id: number, imageNew: IImage) {
  try {
    const imageOld = await getImageById(id);
    imageOld.filename = imageNew.filename;
    imageOld.contentType = imageNew.contentType;
    imageOld.size = imageNew.size;
    imageOld.uploadDate = new Date();
    imageOld.base64 = imageNew.base64;

    await imageOld.save();
    return imageOld;
  } catch (e) {
    console.error(e);
    return null;
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
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function unlinkImageFromRestaurant(
  restaurantName: string, imageId: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findOne({name: restaurantName});
    if (!restaurant) {
      return null;
    }
    const index = restaurant.picturesId.indexOf(imageId);
    if (index > -1) {
      restaurant.picturesId.splice(index, 1);
      await restaurant.save();
    }
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
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function unlinkImageFromRestaurantDish(
  restaurantName: string, dishName: string, imageId: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findOne({name: restaurantName});
    if (!restaurant) {
      console.error('Restaurant not found');
      return null;
    }
    
    const dish = restaurant.dishes.find(d => d.name === dishName);
    if (!dish) {
      console.error('Dish not found');
      return null;
    }
    
    const index = dish.picturesId.indexOf(imageId);
    if (index > -1) {
      dish.picturesId.splice(index, 1);
      await restaurant.save();
    }
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function linkImageToRestaurantExtra(
  restaurantName: string, extraName: string, imageId: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findOne({name: restaurantName});
    if (!restaurant) {
      console.error('Restaurant not found');
      return null;
    }

    const extra = restaurant.extras.find(e => e.name === extraName);
    if (!extra) {
      console.error('Extra not found');
      return null;
    }

    const index = extra.picturesId.indexOf(imageId);
    if (index > -1) {
      extra.picturesId.splice(index, 1);
      await restaurant.save();
    }
  } catch (e) {
    console.error(e);
    return e;
  }
}

export async function unlinkImageFromRestaurantExtra(
  restaurantName: string, extraName: string, imageId: number) {
  try {
    const Restaurant = mongoose.model('Restaurant', restaurantSchema);
    const restaurant = await Restaurant.findOne({name: restaurantName});
    if (!restaurant) {
      console.error('Restaurant not found');
      return null;
    }

    const extra = restaurant.extras.find(e => e.name === extraName);
    if (!extra) {
      console.error('Extra not found');
      return null;
    }

    const index = extra.picturesId.indexOf(imageId);
    if (index > -1) {
      extra.picturesId.splice(index, 1);
      await restaurant.save();
    }
  } catch (e) {
    console.error(e);
    return e;
  }
}

