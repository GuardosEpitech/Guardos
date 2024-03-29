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

export async function getUserToken(username:string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.find();
  for (const elem of userData) {
    if (elem.username === username || elem.email === username) {
      const token = elem.username ? elem.username : elem.email;
      const password = AES.decrypt(elem.password as string, 'Guardos')
        .toString(enc.Utf8);
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

  // return the updated token
  const token = userData.username ? userData.username : userData.email;
  return AES.encrypt(token +
    AES.decrypt(userData.password as string, 'Guardos')
      .toString(enc.Utf8), 'Guardos')
    .toString();
}

export async function updateRecoveryPassword(userId: number,
  newPassword: string) {
  try {
    const UserSchema = mongoose.model('User', userSchema, 'User');
    const userData = await UserSchema.findOne({ uid: userId });

    if (!userData) {
      // User not found
      return false;
    }

    // Update the password
    userData.password = AES.encrypt(newPassword, 'Guardos')
      .toString();
    await userData.save();

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
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
    await userData.save();

    // return the updated token
    const token = userData.username ? userData.username : userData.email;
    return AES.encrypt(token +
      AES.decrypt(userData.password as string, 'Guardos')
        .toString(enc.Utf8), 'Guardos')
      .toString();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getSavedFilter(userId: number, filterName: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.findOne({uid: userId});
  return userData.savedFilter.find((savedFilter) =>
    savedFilter.filterName === filterName);
}

export async function getSavedFilters(userId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const userData = await UserSchema.findOne({uid: userId});
  return userData.savedFilter;
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

export async function editSavedFilter(userId: number, filterName: string,
  updatedFields: ISearchCommunication) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    {uid: userId, 'savedFilter.filterName': filterName},
    {$set: {'savedFilter.$': updatedFields}},
    {new: true}
  );
}

export async function deleteSavedFilter(userId: number, filterName: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  return UserSchema.findOneAndUpdate(
    {uid: userId},
    {$pull: {savedFilter: {filterName: filterName}}},
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

export async function deleteUser(userId: number) {
  const UserSchema = mongoose.model('User', userSchema, 'User');

  const answer = await UserSchema.findOneAndDelete({ uid: userId });
  if (answer) {
    return answer;
  }
  return false;
}

export async function doesUserExist(username: string, email: string) {
  const UserSchema = mongoose.model('User', userSchema, 'User');
  const answer = await UserSchema.findOne({
    username: username, 
    email: email
  });
  if (answer) {
    return true;
  }
  return false;
}