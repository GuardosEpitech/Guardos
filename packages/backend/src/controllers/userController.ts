import mongoose from 'mongoose';
import { userSchema }
  from '../models/userInterface';
import { AES, enc } from 'crypto-js';

export async function addUser(username: string,
  email: string, password: string) {

  const UserSchema = mongoose.model('User', userSchema, 'User');
  const lastRecord = await UserSchema.findOne({})
    .sort({ uid: -1 })
    .exec();
  const highestUid = lastRecord ? lastRecord.uid + 1 : 0;

  const errorArray = [false, false];
  const upload = new UserSchema({
    uid: highestUid,
    username: username,
    email: email,
    password: AES.encrypt(password, 'Guardos')
      .toString(),
    allergens: []
  });
  const existingUsername = await UserSchema.findOne({ username: username })
    .exec();
  const existingEmail = await UserSchema.findOne({ email: email })
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

export async function loginUser(username: string,
  password: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.find();
  for (const elem of userData) {
    if ((elem.username === username || 
      elem.email === username) && AES.decrypt(elem.password, 'Guardos')
      .toString(enc.Utf8) === password) {
      return true;
    }
  }
  return false;
}

export async function getAllergens(email: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.findOne({ email: email })
    .exec();
  return userData;
}

export async function updateAllergens(email: string, allergens: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema
    .findOneAndUpdate({ email: email }, {
      allergens: JSON.
        parse(allergens)
    }, { new: true });
  return userData;
}

export async function getUserId(token: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.find();

  for (const elem of userData) {
    let tokenToCheck = elem.username ? elem.username : elem.email;
    tokenToCheck += AES.decrypt(elem.password, 'Guardos')
      .toString(enc.Utf8);

    if (AES.decrypt(token, 'Guardos')
      .toString(enc.Utf8) === tokenToCheck) {
      return elem.uid;
    }
  }
  return false;
}
