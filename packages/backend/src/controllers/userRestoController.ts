import mongoose from 'mongoose';
import { userRestoSchema }
  from '../models/userRestaurantInterfaces';
import { AES, enc } from 'crypto-js';

export async function addUserResto(username: string,
  email: string, password: string) {

  const errorArray = [false, false];
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  console.log(username);
  console.log(email);
  console.log(password);
  const upload = new UserRestoSchema({
    username: username,
    email: email,
    password: AES.encrypt(password, 'GuardosResto')
      .toString(),
    isActive: false,
    restaurants: []
  });
  const existingUsername = await UserRestoSchema.findOne({ username: username })
    .exec();
  const existingEmail = await UserRestoSchema.findOne({ email: email })
    .exec();

  if (existingEmail) {
    errorArray[0] = true;
  }
  if (existingUsername) {
    errorArray[1] = true;
  }
  if (errorArray.includes(true)) {
    return errorArray;
  }
  await upload.save();
  return errorArray;
}

export async function loginUserResto(username: string,
  password: string) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserRestoSchema.find();

  for (const elem of userData) {
    if ((elem.username === username ||
      elem.email === username) &&
      AES.decrypt(elem.password, 'GuardosResto')
        .toString(enc.Utf8) === password) {
      return true;
    }
  }
  return false;
}