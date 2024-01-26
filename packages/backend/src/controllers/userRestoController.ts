import mongoose from 'mongoose';
import { userRestoSchema }
  from '../models/userRestaurantInterfaces';
import { AES, enc } from 'crypto-js';

export async function addUserResto(username: string,
  email: string, password: string) {

  const errorArray = [false, false];
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  let lastrecord = await UserRestoSchema.findOne({}).sort({ uid: -1 }).exec();
  const highestUid = lastrecord ? lastrecord.uid + 1 : 0

  const upload = new UserRestoSchema({
    uid: highestUid,
    username: username,
    email: email,
    password: AES.encrypt(password, 'GuardosResto')
      .toString(),
    isActive: false,
    restaurantIDs: []
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
      const token = elem.username ? elem.username : elem.email;
      
      return AES.encrypt(token + password, 'GuardosResto')
        .toString();
    }
  }
  return false;
}

export async function logoutUserResto(token: string) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserRestoSchema.find();

  for (const elem of userData) {
    let tokenToCheck = elem.username ? elem.username : elem.email;
    tokenToCheck += AES.decrypt(elem.password, 'GuardosResto')
    .toString(enc.Utf8);

    if (AES.decrypt(token, 'GuardosResto')
        .toString(enc.Utf8) === tokenToCheck) {
      return true;
    }
  }

  return false;
}

export async function getUserIdResto(token: string) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserRestoSchema.find();

  for (const elem of userData) {
    let tokenToCheck = elem.username ? elem.username : elem.email;
    tokenToCheck += AES.decrypt(elem.password, 'GuardosResto')
    .toString(enc.Utf8);

    if (AES.decrypt(token, 'GuardosResto')
        .toString(enc.Utf8) === tokenToCheck) {
      return elem.uid;
    }
  }
  return false;
}
