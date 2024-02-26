import mongoose from 'mongoose';
import { userRestoSchema }
  from '../models/userRestaurantInterfaces';
import { AES, enc } from 'crypto-js';
import { IRestoProfileCommunication } from '../models/communicationInterfaces';

export async function addUserResto(username: string,
  email: string, password: string) {

  const errorArray = [false, false];
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const lastrecord = await UserRestoSchema.findOne({})
    .sort({ uid: -1 })
    .exec();
  const highestUid = lastrecord ? lastrecord.uid as number + 1 : 0;

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
  } else {
    const upload = new UserRestoSchema({
      uid: highestUid,
      username: username,
      email: email,
      password: AES.encrypt(password, 'GuardosResto')
        .toString(),
      isActive: false,
      restaurantIDs: [],
      profilePicId: [],
      defaultMenuDesign: 'default',
      preferredLanguage: '',
    });
    await upload.save();
  }
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
      AES.decrypt(elem.password as string, 'GuardosResto')
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
    tokenToCheck += AES.decrypt(elem.password as string, 'GuardosResto')
      .toString(enc.Utf8);

    if (AES.decrypt(token, 'GuardosResto')
      .toString(enc.Utf8) === tokenToCheck) {
      return true;
    }
  }

  return false;
}

export async function getRestoProfileDetails(userId: number) {
  const UserRestoSchema =
    mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserRestoSchema.findOne({uid: userId});

  const inter: IRestoProfileCommunication = {
    username: userData.username === undefined ? ''
      : userData.username as string,
    email: userData.email === undefined ? ''
      : userData.email as string,
    profilePicId: userData.profilePicId === undefined ? []
      : userData.profilePicId as number[],
    defaultMenuDesign: userData.defaultMenuDesign ?
      userData.defaultMenuDesign as string : '',
    preferredLanguage: userData.preferredLanguage === undefined ? ''
      : userData.preferredLanguage as string
  };
  return inter;
}

// update username, email, preferred language
export async function updateRestoProfileDetails(userId: number,
  updateFields: Partial<IRestoProfileCommunication>) {
  const UserRestoSchema =
    mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserRestoSchema
    .findOneAndUpdate({ uid: userId }, {
      username: updateFields.username,
      email: updateFields.email,
      defaultMenuDesign: updateFields.defaultMenuDesign,
      preferredLanguage: updateFields.preferredLanguage,
    }, { new: true });
  const token = userData.username ? userData.username : userData.email;

  return AES.encrypt(token +
    AES.decrypt(userData.password as string, 'GuardosResto')
      .toString(enc.Utf8), 'GuardosResto')
    .toString();
}

export async function updateRestoPassword(userId: number, password: string,
  newPassword: string) {
  try {
    const UserRestoSchema =
      mongoose.model('UserResto', userRestoSchema, 'UserResto');
    const userData = await UserRestoSchema.findOne({ uid: userId });

    if (!userData) {
      // User not found
      return false;
    }

    // Decrypt stored password and compare with the provided password
    const decryptedPassword = AES
      .decrypt(userData.password as string,'GuardosResto')
      .toString(enc.Utf8);
    if (decryptedPassword !== password) {
      // Incorrect current password
      return false;
    }

    // Update the password
    userData.password = AES.encrypt(newPassword, 'GuardosResto')
      .toString();
    await userData.save();

    const token = userData.username ? userData.username : userData.email;

    return AES.encrypt(token +
      AES.decrypt(userData.password as string, 'GuardosResto')
        .toString(enc.Utf8), 'GuardosResto')
      .toString();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addRestoProfilePic(userId: number, pictureId: number) {
  const UserRestoSchema =
    mongoose.model('UserResto', userRestoSchema, 'UserResto');
  return UserRestoSchema.findOneAndUpdate(
    { uid: userId },
    { $push: { profilePicId: pictureId } },
    { new: true }
  );
}

export async function editRestoProfilePic(userId: number, oldPictureId: number,
  newPictureId: number) {
  const UserRestoSchema =
    mongoose.model('UserResto', userRestoSchema, 'UserResto');
  return UserRestoSchema.findOneAndUpdate(
    { uid: userId, profilePicId: oldPictureId },
    { $set: { 'profilePicId.$': newPictureId } },
    { new: true }
  );
}

export async function deleteRestoProfilePic(userId: number, pictureId: number) {
  const UserRestoSchema =
    mongoose.model('UserResto', userRestoSchema, 'UserResto');
  return UserRestoSchema.findOneAndUpdate(
    { uid: userId },
    { $pull: { profilePicId: pictureId } },
    { new: true }
  );
}

export async function getUserIdResto(token: string) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const userData = await UserRestoSchema.find();

  for (const elem of userData) {
    let tokenToCheck = elem.username ? elem.username : elem.email;
    tokenToCheck += AES.decrypt(elem.password as string, 'GuardosResto')
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
