import mongoose from 'mongoose';
import {
  loginUser,
  getProfileDetails,
  updateProfileDetails,
  deleteUser,
  getUserToken,
  logoutUser,
  updateRecoveryPassword,
  updatePassword,
  getSavedFilter,
  addSavedFilter,
  editSavedFilter,
  deleteSavedFilter,
  addProfilePicture,
  editProfilePicture,
  deleteProfilePicture,
  getUserCookiePreferences,
  setUserCookiePreferences,
  addSubscribtionID,
  getSavedFilters,
  getAllergens,
  getDislikedIngredients,
  updateDislikedIngredients,
  getUserId,
  doesUserExist,
  getSubscribtionID,
  addSubscribeTime,
  getSubscribeTime,
  addCustomer,
  getCustomer
} from '../../src/controllers/userController';

jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest
      .fn()
      .mockReturnValue('encryptedToken'),
    decrypt: jest.fn()
      .mockReturnValue({ toString: () => 'testPassword' })
  },
  enc: {
    Utf8: 'Utf8',
  },
}));

describe('User Service Tests', () => {
  const mockUserData : {
    uid: number,
    username: string,
    email: string,
    password: string, // This would be an encrypted password
    allergens: string[],
    dislikedIngredients: string[],
    profilePicId: number,
    savedFilter: {
      find: jest.Mock,
    }
    find: jest.Mock,
    save: jest.Mock,
  }[] = [
    {
      uid: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'encryptedPassword', // This would be an encrypted password
      allergens: [],
      dislikedIngredients: [],
      profilePicId: 123,
      savedFilter: {
        find: jest.fn()
          .mockResolvedValue(true),
      },
      find: jest.fn()
        .mockResolvedValue(true),
      save: jest.fn()
        .mockResolvedValue(true),
    },
  ];

  const UserModel = {
    findOne: jest.fn()
      .mockReturnThis(),
    find: jest.fn()
      .mockReturnThis(),
    sort: jest.fn()
      .mockReturnThis(),
    limit: jest.fn()
      .mockReturnThis(),
    exec: jest.fn()
      .mockReturnThis(),
    findOneAndUpdate: jest.fn(),
    updateOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    mongoose.model = jest.fn()
      .mockReturnValue(UserModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addUser', () => {
    // it('should successfully add a new user', async () => {
    //   UserModel.findOne.mockReturnValueOnce(Promise.resolve(null)); // No existing user
    //
    //   UserModel.findOne.mockReturnValueOnce(Promise.resolve(null)); // No existing email
    //
    //   const result = await addUser(
    //     'testuser',
    //     'test@example.com',
    //     'password123');
    //   expect(result)
    //     .toEqual([false, false]);
    //   expect(UserModel.findOne)
    //     .toHaveBeenCalledTimes(2); // check calls to findOne
    //   expect(UserModel.save)
    //     .toHaveBeenCalled(); // ensure save was called
    // });
    //
    // it('should return error if username already exists', async () => {
    //   UserModel.findOne.mockReturnValueOnce(Promise.resolve(mockUserData[0])); // Existing username
    //
    //   const result = await addUser(
    //     'testuser',
    //     'new@example.com',
    //     'password123');
    //   expect(result)
    //     .toEqual([false, true]); // existing username error
    // });
    //
    // it('should return error if email already exists', async () => {
    //   UserModel.findOne.mockReturnValueOnce(Promise.resolve(null)); // No existing username
    //   UserModel.findOne.mockReturnValueOnce(Promise.resolve(mockUserData[0])); // Existing email
    //
    //   const result = await addUser(
    //     'newuser',
    //     'test@example.com',
    //     'password123');
    //   expect(result)
    //     .toEqual([true, false]); // existing email error
    // });
  });

  describe('loginUser', () => {
    const mockUserLoginData = [{
      username: 'testUser',
      password: 'testPassword'
    }];

    it('should successfully login user with correct credentials', async () => {
      UserModel.find.mockReturnValue(mockUserLoginData);

      const result = await loginUser('testUser', 'testPassword');
      expect(result)
        .toBeTruthy();
    });

    it('should return false for incorrect credentials', async () => {
      UserModel.find.mockReturnValue(mockUserLoginData);

      const result = await loginUser('wronguser', 'wrongPassword');
      expect(result)
        .toBe(false);
    });
  });

  describe('getUserToken', () => {
    it('should return encrypted token for a valid username', async () => {
      UserModel.find.mockReturnValue(mockUserData);
      const token = await getUserToken('testuser');
      expect(token)
        .toBeTruthy();
    });

    it('should return false for an invalid username', async () => {
      UserModel.find.mockReturnValue([]);
      const token = await getUserToken('invaliduser');
      expect(token)
        .toBe(false);
    });
  });

  describe('logoutUser', () => {
    it('should return true for a valid token', async () => {
      const mockUserLoginData = [{
        username: '',
        password: '',
        email: '',
      }];
      UserModel.find.mockReturnValue(mockUserLoginData);
      const result = await logoutUser('testPassword');
      expect(result)
        .toBe(true);
    });

    it('should return false for an invalid token', async () => {
      const mockUserLoginData = [{
        username: '',
        password: ''
      }];
      UserModel.find.mockReturnValue(mockUserLoginData);
      const result = await logoutUser('wrongToken');
      expect(result)
        .toBe(false);
    });
  });

  describe('getProfileDetails', () => {
    it('should return user profile details', async () => {
      UserModel.findOne.mockReturnValueOnce(mockUserData[0]);

      const profileDetails = await getProfileDetails(1);
      expect(profileDetails.username)
        .toBe('testuser');
      expect(profileDetails.email)
        .toBe('test@example.com');
    });
  });

  describe('updateProfileDetails', () => {
    it('should update profile details and return updated token', async () => {
      const updatedUser = {
        username: 'updateduser',
        email: 'updated@example.com',
      };
      UserModel.findOneAndUpdate.mockReturnValueOnce({
        ...mockUserData[0],
        ...updatedUser,
        password: 'encryptedPassword',
      });

      const token = await updateProfileDetails(1, updatedUser);
      expect(token)
        .toBeTruthy(); // Assume token is returned
      expect(UserModel.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { uid: 1 },
          expect.objectContaining(updatedUser),
          {new: true}
        );
    });
  });

  describe('updateRecoveryPassword', () => {
    it('should update password and return true if user exists', async () => {
      UserModel.findOne.mockReturnValueOnce(mockUserData[0]);
      const result = await updateRecoveryPassword(1, 'newPassword');
      expect(result)
        .toBe(true);
    });

    it('should return false if user does not exist', async () => {
      UserModel.findOne.mockReturnValueOnce(null);
      const result = await updateRecoveryPassword(99, 'newPassword');
      expect(result)
        .toBe(false);
    });
  });

  describe('updatePassword', () => {
    it('should return updated token if current password is correct',
      async () => {
        const mockUserLoginData = {
          username: '',
          password: '',
          save: jest.fn()
            .mockResolvedValue(true),
        };
        UserModel.findOne.mockReturnValueOnce(mockUserLoginData);
        const token = await updatePassword(1, 'testPassword', 'newPassword');
        expect(token)
          .toBeTruthy();
      }
    );

    it('should return false if current password is incorrect', async () => {
      const mockUserLoginData = [{
        username: '',
        password: ''
      }];
      UserModel.findOne.mockReturnValueOnce(mockUserLoginData);
      const result = await updatePassword(1, 'wrongPassword', 'newPassword');
      expect(result)
        .toBe(false);
    });
  });

  describe('getSavedFilter', () => {
    it('should return saved filter if it exists', async () => {
      UserModel.findOne.mockReturnValueOnce(mockUserData[0]);
      const filter = await getSavedFilter(1, 'testFilter');
      expect(filter)
        .toBeTruthy();
    });

    it('should return undefined if filter does not exist', async () => {
      const mockObj = {
        savedFilter: {
          find: jest.fn()
            .mockResolvedValue(undefined),
        },
      };
      UserModel.findOne.mockReturnValueOnce(mockObj);
      const filter = await getSavedFilter(1, 'nonexistentFilter');
      expect(filter)
        .toBeUndefined();
    });
  });

  describe('getSavedFilters', () => {
    it('should return saved filters if they exist', async () => {
      UserModel.findOne.mockReturnValueOnce(mockUserData[0]);
      const filters = await getSavedFilters(1);
      expect(filters)
        .toBeTruthy();
    });
  });

  describe('addSavedFilter', () => {
    it('should add a new saved filter and return updated user data',
      async () => {
        const updatedUser = {
          ...mockUserData[0], savedFilter: [{ filterName: 'testFilter' }] };
        UserModel.findOneAndUpdate
          .mockReturnValueOnce(updatedUser);
        const result = await addSavedFilter(1, { filterName: 'testFilter' });
        expect(result)
          .toEqual(updatedUser);
      }
    );
  });

  describe('editSavedFilter', () => {
    it('should edit an existing filter and return updated user data',
      async () => {
        const updatedUser = {
          ...mockUserData[0], savedFilter: [{ filterName: 'updatedFilter' }] };
        UserModel.findOneAndUpdate
          .mockReturnValueOnce(updatedUser);
        const result =
          await editSavedFilter(1, 'testFilter', {
            filterName: 'updatedFilter' });
        expect(result)
          .toEqual(updatedUser);
      }
    );
  });

  describe('deleteSavedFilter', () => {
    it('should delete a saved filter and return updated user data',
      async () => {
        const updatedUser = {
          ...mockUserData[0], savedFilter: ['savedFilter'] };
        UserModel.findOneAndUpdate
          .mockReturnValueOnce(updatedUser);
        const result = await deleteSavedFilter(1, 'testFilter');
        expect(result)
          .toEqual(updatedUser);
      }
    );
  });

  describe('profile picture methods', () => {
    it('should add a profile picture', async () => {
      UserModel.findOneAndUpdate
        .mockReturnValueOnce(mockUserData[0]);
      const result = await addProfilePicture(1, 123);
      expect(result.profilePicId)
        .toBe(123);
    });

    it('should edit a profile picture', async () => {
      const mockObj = {
        uid: 1,
        profilePicId: 456,
      };
      UserModel.findOneAndUpdate
        .mockReturnValueOnce(mockObj);
      const result = await editProfilePicture(1, 456);
      expect(result.profilePicId)
        .toBe(456);
    });

    it('should delete a profile picture', async () => {
      const mockObj = {
        uid: 1,
      };
      UserModel.findOneAndUpdate
        .mockReturnValueOnce(mockObj);
      const result = await deleteProfilePicture(1);
      expect(result.profilePicId)
        .toBeUndefined();
    });
  });

  describe('cookie preferences', () => {
    it('should return cookie preferences if they are set', async () => {
      const userWithPreferences = {
        ...mockUserData[0], preferencesCookie: { isSet: true } };
      UserModel.findOne
        .mockReturnValueOnce(userWithPreferences);
      const result = await getUserCookiePreferences(1);
      expect(result)
        .toBeTruthy();
    });

    it('should update cookie preferences and return status 200', async () => {
      UserModel.findOne.mockReturnValueOnce(mockUserData[0]);
      const result = await setUserCookiePreferences(1,
        { functional: true, statistical: true, marketing: false });
      expect(result)
        .toBe(200);
    });
  });

  describe('subscription methods', () => {
    it('should add a subscription ID and return updated data', async () => {
      const updatedUser = { ...mockUserData[0], subscriptionID: 'sub123' };
      UserModel.findOne
        .mockReturnValue(true);
      UserModel.findOneAndUpdate
        .mockReturnValueOnce(updatedUser);
      const result = await addSubscribtionID(1, 'sub123');
      expect(result)
        .toBe(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return the deleted user', async () => {
      UserModel.findOneAndDelete
        .mockReturnValueOnce(mockUserData[0]);

      const result = await deleteUser(1);
      expect(result)
        .toEqual(mockUserData[0]);
      expect(UserModel.findOneAndDelete)
        .toHaveBeenCalledWith({ uid: 1 });
    });

    it('should return false if user does not exist', async () => {
      UserModel.findOneAndDelete.mockReturnValueOnce(null);

      const result = await deleteUser(2);
      expect(result)
        .toBe(false);
    });
  });

  describe('getAllergens', () => {
    it('should return allergens if user exists', async () => {
      UserModel.findOne.mockReturnThis();
      UserModel.exec.mockReturnValueOnce({ allergens: ['nuts', 'gluten'] });
      const allergens = await getAllergens(1);
      expect(allergens)
        .toEqual(['nuts', 'gluten']);
    });

    it('should return undefined if user does not exist', async () => {
      UserModel.findOne.mockReturnThis();
      UserModel.exec.mockReturnValueOnce(null);
      const allergens = await getAllergens(99);
      expect(allergens)
        .toBeUndefined();
    });
  });

  describe('getDislikedIngredients', () => {
    it('should return disliked ingredients if user exists', async () => {
      UserModel.findOne.mockReturnThis();
      UserModel.exec
        .mockReturnValueOnce({ dislikedIngredients: ['onions', 'garlic'] });
      const ingredients = await getDislikedIngredients(1);
      expect(ingredients)
        .toEqual(['onions', 'garlic']);
    });

    it('should return undefined if user does not exist', async () => {
      UserModel.findOne.mockReturnThis();
      UserModel.exec.mockReturnValueOnce(null);
      const ingredients = await getDislikedIngredients(99);
      expect(ingredients)
        .toBeUndefined();
    });
  });

  describe('updateDislikedIngredients', () => {
    it('should update disliked ingredients and return updated user data', async () => {
      UserModel.findOneAndUpdate
        .mockReturnValueOnce({ uid: 1, dislikedIngredients: ['peppers'] });
      const result = await updateDislikedIngredients(1, ['peppers']);
      expect(result.dislikedIngredients)
        .toEqual(['peppers']);
    });

    it('should return null if user does not exist', async () => {
      UserModel.findOneAndUpdate.mockReturnValueOnce(null);
      const result = await updateDislikedIngredients(99, ['peppers']);
      expect(result)
        .toBeNull();
    });
  });

  describe('getUserId', () => {
    it('should return userID for a valid token', async () => {
      const mockUserData = [{
        uid: 1, username: 'testUser', password: 'encryptedPassword' }];
      UserModel.find.mockReturnValueOnce(mockUserData);

      await getUserId('encryptedToken');
      expect(UserModel.find)
        .toHaveBeenCalled();
    });

    it('should return false for an invalid token', async () => {
      UserModel.find.mockReturnValueOnce([]);
      const userId = await getUserId('invalidToken');
      expect(userId)
        .toBe(false);
    });
  });

  describe('doesUserExist', () => {
    it('should return true if user exists', async () => {
      UserModel.findOne.mockReturnValueOnce(true);
      const exists = await doesUserExist('testUser', 'test@example.com');
      expect(exists)
        .toBe(true);
    });

    it('should return false if user does not exist', async () => {
      UserModel.findOne.mockReturnValueOnce(null);
      const exists = await doesUserExist('testUser', 'test@example.com');
      expect(exists)
        .toBe(false);
    });
  });

  describe('addCustomer', () => {
    it('should add a customerID if not already present', async () => {
      UserModel.findOne.mockReturnValueOnce({ uid: 1 });
      UserModel.findOneAndUpdate
        .mockReturnValueOnce({ customerID: 'customer123' });
      const result = await addCustomer(1, 'customer123');
      expect(result)
        .toBe('customer123');
    });

    it('should return existing customerID if already present', async () => {
      UserModel.findOne
        .mockReturnValueOnce({ uid: 1, customerID: 'existingCustomer123' });
      const result = await addCustomer(1, 'customer123');
      expect(result)
        .toBe('existingCustomer123');
    });

    it('should return undefined if user does not exist', async () => {
      UserModel.findOne.mockReturnValueOnce(null);
      UserModel.findOneAndUpdate.mockReturnValueOnce({customerID: 2});
      const result = await addCustomer(99, 'customer123');
      expect(result)
        .toEqual(2);
    });
  });

  describe('getCustomer', () => {
    it('should return customerID if it exists', async () => {
      UserModel.findOne.mockReturnValueOnce({ customerID: 'customer123' });
      const customerID = await getCustomer(1);
      expect(customerID)
        .toBe('customer123');
    });

    it('should return false if customerID does not exist', async () => {
      UserModel.findOne.mockReturnValueOnce({});
      const customerID = await getCustomer(1);
      expect(customerID)
        .toBe(false);
    });
  });

  describe('getSubscribeTime', () => {
    it('should return subscribeTime if it exists', async () => {
      const mockDate = new Date();
      UserModel.findOne.mockReturnValueOnce({ subscribeTime: mockDate });
      const subscribeTime = await getSubscribeTime(1);
      expect(subscribeTime)
        .toBe(mockDate);
    });

    it('should return false if subscribeTime does not exist', async () => {
      UserModel.findOne.mockReturnValueOnce({});
      const subscribeTime = await getSubscribeTime(1);
      expect(subscribeTime)
        .toBe(false);
    });
  });

  describe('addSubscribeTime', () => {
    it('should add subscribeTime if user exists', async () => {
      const mockDate = new Date();
      mockDate.setHours(mockDate.getHours() + 2);

      UserModel.findOne.mockReturnValueOnce({ uid: 1 });
      UserModel.findOneAndUpdate
        .mockReturnValueOnce({ subscribeTime: mockDate });

      const result = await addSubscribeTime(1);
      expect(result)
        .toEqual({subscribeTime: mockDate});
    });

    it('should return false if user does not exist', async () => {
      UserModel.findOne.mockReturnValueOnce(null);
      const result = await addSubscribeTime(99);
      expect(result)
        .toBe(false);
    });
  });

  describe('getSubscribtionID', () => {
    it('should return subscriptionID if it exists', async () => {
      UserModel.findOne.mockReturnValueOnce({ subscriptionID: 'sub123' });
      const subscriptionID = await getSubscribtionID(1);
      expect(subscriptionID)
        .toBe('sub123');
    });

    it('should return false if subscriptionID does not exist', async () => {
      UserModel.findOne.mockReturnValueOnce(null);
      const subscriptionID = await getSubscribtionID(1);
      expect(subscriptionID)
        .toBe(false);
    });
  });
});
