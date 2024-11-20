import mongoose from 'mongoose';
import {
  getVisitorPermissions,
  addVisitorPermission,
  removePermissions,
  deleteAllPermissions
} from '../../src/controllers/visitorPermissionController';
import {userSchema} from '../../src/models/userInterface';

// Mock Mongoose model and methods
jest.mock('mongoose', () => ({
  Schema: jest.fn()
    .mockImplementation(() => ({})),
  model: jest.fn()
    .mockReturnThis(),
  findOne: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

describe('User Permissions Service', () => {
  const mockUser = {
    uid: 123,
    permissions: ['default', 'basicSubscription'],
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Testing getVisitorPermissions
  describe('getVisitorPermissions', () => {
    it('should return user permissions if user exists', async () => {
      mongoose.model('User').findOne = jest.fn()
        .mockResolvedValue(mockUser);

      const permissions = await getVisitorPermissions(123);
      expect(mongoose.model)
        .toHaveBeenCalledWith('User', userSchema, 'User');
      expect(mongoose.model('User').findOne)
        .toHaveBeenCalledWith({uid: 123});
      expect(permissions)
        .toEqual(mockUser.permissions);
    });

    it('should return false if user does not exist', async () => {
      mongoose.model('User').findOne = jest.fn()
        .mockResolvedValue(null);

      const permissions = await getVisitorPermissions(123);
      expect(mongoose.model('User').findOne)
        .toHaveBeenCalledWith({uid: 123});
      expect(permissions)
        .toBe(false);
    });
  });

  // Testing addVisitorPermission
  describe('addVisitorPermission', () => {
    it('should add permissions and return updated permissions', async () => {
      const updatedUser = {
        uid: 123,
        permissions: ['default', 'basicSubscription', 'premiumUser'],
      };

      mongoose.model('User').findOneAndUpdate = jest.fn()
        .mockResolvedValue(updatedUser);

      const permissions = await addVisitorPermission(123, ['premiumUser']);
      expect(mongoose.model('User').findOneAndUpdate)
        .toHaveBeenCalledWith(
          {uid: 123},
          {$addToSet: {permissions: {$each: ['premiumUser']}}},
          {new: true}
        );
      expect(permissions)
        .toEqual(updatedUser.permissions);
    });

    it('should return false if user does not exist', async () => {
      mongoose.model('User').findOneAndUpdate = jest.fn()
        .mockResolvedValue(null);

      const permissions = await addVisitorPermission(123, ['premiumUser']);
      expect(permissions)
        .toBe(false);
    });
  });

  // Testing removePermissions
  describe('removePermissions', () => {
    it('should remove specified permissions and return updated permissions',
      async () => {
        const updatedUser = {
          uid: 123,
          permissions: ['default', 'basicSubscription'],
        };

        mongoose.model('User').findOneAndUpdate = jest.fn()
          .mockResolvedValue(updatedUser);

        const permissions = await removePermissions(123, ['basicSubscription']);
        expect(mongoose.model('User').findOneAndUpdate)
          .toHaveBeenCalledWith(
            {uid: 123},
            {$pullAll: {permissions: ['basicSubscription']}},
            {new: true}
          );
        expect(permissions)
          .toEqual(updatedUser.permissions);
      }
    );

    it('should return false if user does not exist', async () => {
      mongoose.model('User').findOneAndUpdate = jest.fn()
        .mockResolvedValue(null);

      const permissions = await removePermissions(123, ['basicSubscription']);
      expect(permissions)
        .toBe(false);
    });
  });

  // Testing deleteAllPermissions
  describe('deleteAllPermissions', () => {
    it('should remove all permissions and return updated user', async () => {
      const updatedUser : {
        uid: number,
        permissions: string[]
      } = {
        uid: 123,
        permissions: [],
      };

      mongoose.model('User').findOneAndUpdate = jest.fn()
        .mockResolvedValue(updatedUser);

      const permissions = await deleteAllPermissions(123);
      expect(mongoose.model('User').findOneAndUpdate)
        .toHaveBeenCalledWith(
          {uid: 123},
          {$unset: {permissions: 1}},
          {new: true}
        );
      expect(permissions)
        .toEqual(updatedUser.permissions);
    });

    it('should return false if user does not exist', async () => {
      mongoose.model('User').findOneAndUpdate = jest.fn()
        .mockResolvedValue(null);

      const permissions = await deleteAllPermissions(123);
      expect(permissions)
        .toBe(false);
    });
  });
});
