import mongoose from 'mongoose';
import * as userRestoController
  from '../../src/controllers/userRestoController';
import { deleteRestoChainFromRestaurant }
  from '../../src/controllers/restaurantController';

jest.mock('mongoose');
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
jest.mock('../../src/controllers/restaurantController', () => ({
  deleteRestoChainFromRestaurant: jest.fn(),
}));

describe('userRestoController', () => {
  let UserRestoSchemaMock: any;

  beforeEach(() => {
    UserRestoSchemaMock = {
      findOne: jest.fn()
        .mockReturnThis(),
      find: jest.fn()
        .mockReturnThis(),
      sort: jest.fn()
        .mockReturnThis(),
      limit: jest.fn()
        .mockReturnThis(),
      exec: jest.fn()
        .mockReturnValue([{uid: 0}]),
      save: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      updateOne: jest.fn(),
      create: jest.fn()
        .mockReturnThis(),
    };

    mongoose.model = jest.fn()
      .mockReturnValue(UserRestoSchemaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addUserResto', () => {
    // it('should add a new user if username and email do not exist', async () => {
    //   UserRestoSchemaMock.findOne.mockResolvedValue(null);
    //   UserRestoSchemaMock.exec.mockResolvedValueOnce([]);
    //   UserRestoSchemaMock.create
    //     .mockResolvedValueOnce({ username: 'testUser' });
    //
    //   const result = await userRestoController
    //     .addUserResto('testUser', 'test@example.com', 'testPassword');
    //
    //   expect(UserRestoSchemaMock.findOne)
    //     .toHaveBeenCalledTimes(3);
    //   expect(UserRestoSchemaMock.save)
    //     .toHaveBeenCalled();
    //   expect(result)
    //     .toEqual([false, false]);
    // });
    //
    // it('should return an error array if username or email exists', async () => {
    //   UserRestoSchemaMock.findOne
    //     .mockResolvedValueOnce({ username: 'testUser' });
    //   UserRestoSchemaMock.exec.mockResolvedValueOnce([{ uid: 10 }]);
    //   UserRestoSchemaMock.create
    //     .mockResolvedValueOnce({ username: 'testUser' });
    //
    //   const result = await userRestoController
    //     .addUserResto('testUser', 'test@example.com', 'testPassword');
    //
    //   expect(result)
    //     .toEqual([false, true]);  // Username exists
    // });
  });

  describe('loginUserResto', () => {
    it('should return token and twoFactor when login is successful',
      async () => {
        const mockUserData = [
          {
            username: 'testUser',
            password: 'encryptedToken',
            twoFactor: 'enabled'
          },
        ];
        UserRestoSchemaMock.find.mockResolvedValue(mockUserData);

        const result = await userRestoController
          .loginUserResto('testUser', 'testPassword');

        expect(result)
          .toEqual({ token: 'encryptedToken', twoFactor: 'enabled' });
      }
    );

    it('should return false when login fails', async () => {
      UserRestoSchemaMock.find.mockResolvedValue([]);

      const result = await userRestoController
        .loginUserResto('testUser', 'wrongPassword');

      expect(result)
        .toBe(false);
    });
  });

  describe('getUserTokenResto', () => {
    it('should return encrypted token for existing user', async () => {
      const mockUserData = [{
        username: 'testUser',
        password: 'encryptedPassword'
      }];
      UserRestoSchemaMock.find.mockResolvedValue(mockUserData);

      const result = await userRestoController.getUserTokenResto('testUser');

      expect(result)
        .toBe('encryptedToken');
    });

    it('should return false if user is not found', async () => {
      UserRestoSchemaMock.find.mockResolvedValue([]);

      const result = await userRestoController.getUserTokenResto('unknownUser');

      expect(result)
        .toBe(false);
    });
  });

  describe('logoutUserResto', () => {
    it('should return true if token matches', async () => {
      const mockUserData = [{
        username: '',
        password: '',
        email: '',
      }];
      UserRestoSchemaMock.find.mockResolvedValue(mockUserData);

      const result = await userRestoController.logoutUserResto('testPassword');

      expect(result)
        .toBe(true);
    });

    it('should return false if token does not match', async () => {
      UserRestoSchemaMock.find.mockResolvedValue([]);

      const result = await userRestoController.logoutUserResto('wrongToken');

      expect(result)
        .toBe(false);
    });
  });

  describe('getRestoProfileDetails', () => {
    it('should return user profile details', async () => {
      const mockUser = {
        username: 'testUser',
        email: 'test@example.com',
        profilePicId: [1],
        restaurantChains: [{
          uid: 1,
          name: 'MCes'
        }],
        defaultMenuDesign: 'default',
        preferredLanguage: 'en',
        twoFactor: 'enabled',
      };
      UserRestoSchemaMock.findOne.mockResolvedValue(mockUser);

      const result = await userRestoController.getRestoProfileDetails(1);

      expect(result)
        .toEqual({
          username: 'testUser',
          email: 'test@example.com',
          profilePicId: [1],
          restaurantChains: [{
            uid: 1,
            name: 'MCes'
          }],
          defaultMenuDesign: 'default',
          preferredLanguage: 'en',
          twoFactor: 'enabled',
        });
    });
  });

  describe('deleteRestoChain', () => {
    it('should delete a restaurant chain', async () => {
      const mockUser = {
        restaurantChains: [{ name: 'chain1', uid: 0 }],
        save: jest.fn()
          .mockResolvedValue(true),
      };
      UserRestoSchemaMock.findOne.mockResolvedValue(mockUser);

      const result = await userRestoController.deleteRestoChain(1, 'chain1');

      expect(deleteRestoChainFromRestaurant)
        .toHaveBeenCalledWith(1, 0);
      expect(result)
        .toBe(true);
    });

    it('should return false if chain does not exist', async () => {
      UserRestoSchemaMock.findOne.mockResolvedValue(null);

      const result = await userRestoController
        .deleteRestoChain(1, 'chainNotExist');

      expect(result)
        .toBe(false);
    });
  });
});
