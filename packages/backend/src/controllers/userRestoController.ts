import mongoose from 'mongoose';
import { userRestoSchema }
  from '../models/userRestaurantInterfaces';
import { AES, enc } from 'crypto-js';

export async function addUserResto(username: string,
  email: string, password: string) {

  const errorArray = [false, false];
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const lastrecord = await UserRestoSchema.findOne({})
    .sort({ uid: -1 })
    .exec();
  const highestUid = lastrecord ? lastrecord.uid + 1 : 0;

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
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
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
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
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
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
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

export async function deleteUserResto(uID: string) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const answer = await UserRestoSchema.findOneAndDelete({ uid: parseInt(uID) });
  if (answer) {
    return answer;
  }
  return false;
}

export async function getUserInfoResto(token: string) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserRestoSchema.find();

  for (const elem of userData) {
    let tokenToCheck = elem.username ? elem.username : elem.email;
    tokenToCheck += AES.decrypt(elem.password, 'GuardosResto')
      .toString(enc.Utf8);

    if (AES.decrypt(token, 'GuardosResto')
      .toString(enc.Utf8) === tokenToCheck) {
      return { 
        username: elem.username, 
        email: elem.email,
        location: elem.location
      };
    }
  }
  return null;
}

export async function updateUserResto(
  token: string, newUsername?: string, newEmail?: string, newLocation?: string) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  
  // Find the user based on the token
  const userID = await getUserIdResto(token);
  console.log(userID);
  const user = await UserRestoSchema.findOne({uid: userID});
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update the username or email if provided
  if (newUsername) {
    user.username = newUsername;
  }
  
  if (newEmail) {
    user.email = newEmail;
  }

  if (newLocation) {
    console.log(newLocation);
    user.location = newLocation;
  }

  // Save the updated user object
  await user.save();

  const updatedToken = await loginUserResto(user.username || user.email, 
    AES.decrypt(user.password, 'GuardosResto').toString(enc.Utf8));
  
  // Return the updated token
  return updatedToken;
}