import mongoose from 'mongoose';
import {userSchema} from '../models/userInterface';
import {AES, enc} from 'crypto-js';
import {IProfileCommunication, ISearchCommunication}
  from '../models/communicationInterfaces';

export async function addUser(username: string,
  email: string, password: string) {

  const UserSchema = mongoose.model('User', userSchema, 'User');
  const lastRecord = await UserSchema.findOne({})
    .sort({ uid: -1 })
    .exec();
  const highestUid = lastRecord ? lastRecord.uid as number + 1 : 0;

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
    if ((elem.username === username || elem.email === username)
      && AES.decrypt(elem.password as string, 'Guardos')
        .toString(enc.Utf8) === password) {
      const token = elem.username ? elem.username : elem.email;

      return AES.encrypt(token + password, 'Guardos')
        .toString();
    }
  }
  return false;
}

export async function logoutUser(token: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.find();

  for (const elem of userData) {
    let tokenToCheck = elem.username ? elem.username : elem.email;
    tokenToCheck += AES.decrypt(elem.password as string, 'Guardos')
      .toString(enc.Utf8);

    if (AES.decrypt(token, 'Guardos')
      .toString(enc.Utf8) === tokenToCheck) {
      return true;
    }
  }

  return false;
}

export async function getProfileDetails(userId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.findOne({uid: userId});
  const inter: IProfileCommunication = {
    username: userData.username === undefined ? ''
      : userData.username as string,
    email: userData.email === undefined ? ''
      : userData.email as string,
    city: userData.city === undefined ? ''
      : userData.city as string,
    allergens: userData.allergens === undefined ? []
      : userData.allergens as string[],
    savedFilter: userData.savedFilter === undefined ? [{}]
      : userData.savedFilter as [ISearchCommunication],
    profilePicId: userData.profilePicId === undefined ? null
      : userData.profilePicId as number,
    preferredLanguage: userData.preferredLanguage === undefined ? ''
      : userData.preferredLanguage as string
  };
  return inter;
}

// update username, email, allergens, preferred language
export async function updateProfileDetails(userId: number,
  updateFields: Partial<IProfileCommunication>) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema
    .findOneAndUpdate({ uid: userId }, {
      username: updateFields.username,
      email: updateFields.email,
      city: updateFields.city,
      allergens: updateFields.allergens,
      preferredLanguage: updateFields.preferredLanguage,
    }, { new: true });
  const inter: IProfileCommunication = {
    username: userData.username as string,
    email: userData.email as string,
    city: userData.city as string,
    allergens: userData.allergens as string[],
    savedFilter: userData.savedFilter as [ISearchCommunication],
    profilePicId: userData.profilePicId as number,
    preferredLanguage: userData.preferredLanguage as string
  };
  return inter;
}

export async function updatePassword(userId: number, password: string,
  newPassword: string) {
  try {
    const UserSchema = mongoose.model('User', userSchema, 'User');
    const userData = await UserSchema.findOne({ uid: userId });

    if (!userData) {
      // User not found
      return false;
    }

    // Decrypt stored password and compare with the provided password
    const decryptedPassword = AES.decrypt(userData.password as string,'Guardos')
      .toString(enc.Utf8);
    if (decryptedPassword !== password) {
      // Incorrect current password
      return false;
    }

    // Update the password
    userData.password = AES.encrypt(newPassword, 'Guardos')
      .toString();
    console.log('new password ' + userData.password);
    await userData.save();

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addSavedFilter(userId: number,
  filter: ISearchCommunication) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    { uid: userId },
    { $push: { savedFilter: filter } },
    { new: true }
  );
}

export async function editSavedFilter(userId: number, filterId: number,
  updatedFields: ISearchCommunication) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    {uid: userId, 'savedFilter._id': filterId},
    {$set: {'savedFilter.$': updatedFields}},
    {new: true}
  );
}

export async function deleteSavedFilter(userId: number, filterId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    {uid: userId},
    {$pull: {savedFilter: {_id: filterId}}},
    {new: true}
  );
}

export async function addProfilePicture(userId: number, pictureId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    { uid: userId },
    { $set: { profilePicId: pictureId } },
    { new: true }
  );
}

export async function editProfilePicture(userId: number, pictureId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    { uid: userId },
    { $set: { profilePicId: pictureId } },
    { new: true }
  );
}

export async function deleteProfilePicture(userId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    { uid: userId },
    { $unset: { profilePicId: 1 } },
    { new: true }
  );
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
    tokenToCheck += AES.decrypt(elem.password as string, 'Guardos')
      .toString(enc.Utf8);

    if (AES.decrypt(token, 'Guardos')
      .toString(enc.Utf8) === tokenToCheck) {
      return elem.uid;
    }
  }
  return false;
}

export async function deleteUser(uID: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  const answer = await UserSchema.findOneAndDelete({ uid: parseInt(uID) });
  if (answer) {
    return answer;
  }
  return false;
}

export async function doesUserExist(username: string, email: string) {
  const UserRestoSchema = mongoose
    .model('UserResto', userSchema, 'UserResto');
  const answer = await UserRestoSchema.findOne({
    username: username, 
    email: email
  });
  if (answer) {
    return true;
  }
  return false;
}