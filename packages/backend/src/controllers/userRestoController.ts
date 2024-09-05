import mongoose from 'mongoose';
import { userRestoSchema }
  from '../models/userRestaurantInterfaces';
import { AES, enc } from 'crypto-js';
import { IRestoProfileCommunication } from '../models/communicationInterfaces';
import { deleteRestoChainFromRestaurant } from './restaurantController';

export async function addUserResto(username: string,
  email: string, password: string) {

  const errorArray = [false, false];
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const lastrecord = await UserRestoSchema.findOne({})
    .sort({ uid: -1 })
    .exec();
  const highestUid = lastrecord ? lastrecord.uid as number + 1 : 0;

  const upload = new UserRestoSchema({
    uid: highestUid,
    username: username,
    email: email,
    password: AES.encrypt(password, 'GuardosResto')
      .toString(),
    isActive: false,
    restaurantIDs: [],
    restaurantChains: [],
    profilePicId: [],
    defaultMenuDesign: 'default',
    preferredLanguage: '',
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
  try {
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
  }  catch (error) {
    console.error(error);
  }
}

export async function getUserTokenResto(username:string) {
  try {
    const UserSchema =
        mongoose.model('UserResto', userRestoSchema, 'UserResto');
    const userData = await UserSchema.find();
    for (const elem of userData) {
      if (elem.username === username || elem.email === username) {
        const token = elem.username ? elem.username : elem.email;
        const password = AES.decrypt(elem.password as string, 'GuardosResto')
          .toString(enc.Utf8);
        return AES.encrypt(token + password, 'GuardosResto')
          .toString();
      }
    }
    return false;
  } catch (error) {
    console.error(error);
  }
}

export async function logoutUserResto(token: string) {
  try {
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
  } catch (error) {
    console.error(error);
  }
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
    restaurantChains: userData.restaurantChains === undefined ? []
      : userData.restaurantChains as { uid: number, name: string}[],
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
  try {
    const UserRestoSchema =
        mongoose.model('UserResto', userRestoSchema, 'UserResto');
    const userData = await UserRestoSchema
      .findOneAndUpdate({uid: userId}, {
        username: updateFields.username,
        email: updateFields.email,
        defaultMenuDesign: updateFields.defaultMenuDesign,
        preferredLanguage: updateFields.preferredLanguage,
      }, {new: true});
    const token = userData.username ? userData.username : userData.email;

    return AES.encrypt(token +
        AES.decrypt(userData.password as string, 'GuardosResto')
          .toString(enc.Utf8), 'GuardosResto')
      .toString();
  } catch (error) {
    console.error(error);
  }
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
  }
}

export async function updateRecoveryPasswordResto(userId: number,
  newPassword: string) {
  try {
    const UserSchema =
        mongoose.model('UserResto', userRestoSchema, 'UserResto');
    const userData = await UserSchema.findOne({ uid: userId });

    if (!userData) {
      // User not found
      return false;
    }

    // Update the password
    userData.password = AES.encrypt(newPassword, 'GuardosResto')
      .toString();
    await userData.save();

    return true;
  } catch (error) {
    console.error(error);
  }
}

export async function addRestoChain(userId: number, name: string) {
  try {
    const UserRestoSchema =
      mongoose.model('UserResto', userRestoSchema, 'UserResto');
    const userData = await UserRestoSchema.findOne({ uid: userId });

    if (!userData) {
      // User not found
      return false;
    }

    for (const elem of userData.restaurantChains) {
      if (elem.name === name) {
        return false;
      }
    }

    userData.restaurantChains.push({uid: userData.restaurantChains.length, name: name});
    await userData.save();

    return true;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRestoChain(userId: number, restoChainName: string) {
  try {
    const UserRestoSchema =
      mongoose.model('UserResto', userRestoSchema, 'UserResto');
    const userData = await UserRestoSchema.findOne({ uid: userId });

    if (!userData || !restoChainName) {
      // User not found
      return false;
    }

    const index = userData.restaurantChains.findIndex(item => item.name === restoChainName);

    for (const elem of userData.restaurantChains) {
      if (elem.name === restoChainName) {
        await deleteRestoChainFromRestaurant(userId, elem.uid as number)
      }
    }
    if (index !== -1) {
      userData.restaurantChains = [...userData.restaurantChains.slice(0, index), ...userData.restaurantChains.slice(index + 1)];
    }
    await userData.save();

    return true;
  } catch (error) {
    console.error(error);
  }
}

export async function addRestoProfilePic(userId: number, pictureId: number) {
  try {
    const UserRestoSchema =
      mongoose.model('UserResto', userRestoSchema, 'UserResto');
    return UserRestoSchema.findOneAndUpdate(
      { uid: userId },
      { $set: { profilePicId: [pictureId] } },
      { new: true }
    );
  } catch (error) {
    console.error(error);
  }
}

export async function editRestoProfilePic(userId: number, oldPictureId: number,
  newPictureId: number) {
  const UserRestoSchema =
    mongoose.model('UserResto', userRestoSchema, 'UserResto');
  return UserRestoSchema.findOneAndUpdate(
    { uid: userId, profilePicId: oldPictureId },
    { $set: { profilePicId: [newPictureId] } },
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
  if (!token) {
    return false;
  }
  try {
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
  catch (error) {
    console.error(error);
  }
}

export async function deleteUserResto(userId: number) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const answer = await UserRestoSchema.findOneAndDelete({ uid: userId });
  if (answer) {
    return answer;
  }
  return false;
}

export async function doesUserRestoExist(username: string, email: string) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const answer = await UserRestoSchema.findOne({
    username: username, 
    email: email
  });
  return !!answer;
}

export async function getUserRestoCookiePreferences(userId: number) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const user = await UserRestoSchema.findOne({ uid: userId });
  if (!user) {
    return null;
  }
  if (user.preferencesCookie.isSet) {
    return user.preferencesCookie;
  } else {
    return false;
  }
}

export async function setUserRestoCookiePreferences(userId: number, 
  data: { functional: boolean, statistical: boolean, marketing: boolean }) {
  const UserRestoSchema = mongoose
    .model('UserResto', userRestoSchema, 'UserResto');
  const user = await UserRestoSchema.findOne({ uid: userId });
  if (!user) {
    return 404;
  }
  user.preferencesCookie = {
    isSet: true,
    functional: data.functional,
    statistical: data.statistical,
    marketing: data.marketing
  };

  await user.save();
  return 200;
}

export async function addCustomerResto(userID: number, customerID: string) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const existingUser = await UserRestoSchema.findOne({ uid: userID });

  if (existingUser && existingUser.customerID) {
    return existingUser.customerID as string;
  } else {
    const answer = await UserRestoSchema.findOneAndUpdate(
      { uid: userID },
      { $set: { customerID: customerID } },
      { new: true }
    );
    return answer.customerID as string;
  }
}

export async function getCustomerResto(userID: number) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const answer = await UserRestoSchema.findOne({uid: userID});

  if (answer.customerID) {
    return answer.customerID;
  }
  return false;
}

export async function getSubscribeTimeUserResto(userID: number) {
  const UserSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const answer = await UserSchema.findOne({uid: userID});

  if (answer.subscribeTime) {
    return answer.subscribeTime;
  }
  return false;
}

export async function addSubscribeTimeResto(userID: number) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const existingUser = await UserRestoSchema.findOne({ uid: userID });

  if (existingUser) {
    let currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 2);
    const answer = await UserRestoSchema.findOneAndUpdate(
      { uid: userID },
      { $set: { subscribeTime: currentTime } },
      { new: true }
    );
    return answer
  }
  return false;
}

export async function addSubscribtionIDResto(userID: number,subscriptionID: string) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const existingUser = await UserRestoSchema.findOne({ uid: userID });

  if (existingUser) {
    const answer = await UserRestoSchema.findOneAndUpdate(
      { uid: userID },
      { $set: { subscriptionID: subscriptionID } },
      { new: true }
    );
    return answer
  }
  return false;
}

export async function getSubscribtionIDResto(userID: number) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');
  const existingUser = await UserRestoSchema.findOne({ uid: userID });

  if (existingUser) {
    return existingUser.subscriptionID;
  }
  return false;
}

export async function deleteSubscribtionIDResto(userID: number) {
  const UserRestoSchema = mongoose.model('UserResto', userRestoSchema, 'UserResto');

  const result = await UserRestoSchema.updateOne(
    { uid: userID }, 
    { $unset: { subscriptionID: 1 } }
  );

  return result;
}