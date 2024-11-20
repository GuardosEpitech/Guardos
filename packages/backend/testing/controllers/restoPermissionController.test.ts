import mongoose from 'mongoose';
import {
  getRestoPermissions,
  addRestoPermission,
  removeRestoPermissions,
  deleteAllRestoPermissions
} from '../../src/controllers/restoPermissionController';

describe('restoPermissionController', () => {
  const UserRestoMock = {
    findOne: jest.fn(),
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
      .mockReturnValue(UserRestoMock);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRestoPermissions', () => {
    it('should return permissions for a valid user', async () => {
      const mockPermissions = ['VIEW_MENU', 'EDIT_MENU'];
      UserRestoMock.findOne.mockResolvedValue({ permissions: mockPermissions });

      const result = await getRestoPermissions(1);
      expect(UserRestoMock.findOne)
        .toHaveBeenCalledWith({ uid: 1 });
      expect(result)
        .toEqual(mockPermissions);
    });

    it('should return false if no user is found', async () => {
      UserRestoMock.findOne.mockResolvedValue(null);

      const result = await getRestoPermissions(1);
      expect(UserRestoMock.findOne)
        .toHaveBeenCalledWith({ uid: 1 });
      expect(result)
        .toBe(false);
    });
  });

  describe('addRestoPermission', () => {
    it('should add permissions to a user and return updated permissions',
      async () => {
        const addedPermissions = ['EDIT_MENU'];
        const updatedPermissions = ['VIEW_MENU', 'EDIT_MENU'];
        UserRestoMock.findOneAndUpdate
          .mockResolvedValue({ permissions: updatedPermissions });

        const result = await addRestoPermission(1, addedPermissions);
        expect(UserRestoMock.findOneAndUpdate)
          .toHaveBeenCalledWith(
            { uid: 1 },
            { $addToSet: { permissions: { $each: addedPermissions } } },
            { new: true }
          );
        expect(result)
          .toEqual(updatedPermissions);
      }
    );

    it('should return false if user is not found', async () => {
      UserRestoMock.findOneAndUpdate.mockResolvedValue(null);

      const result = await addRestoPermission(1, ['EDIT_MENU']);
      expect(UserRestoMock.findOneAndUpdate)
        .toHaveBeenCalled();
      expect(result)
        .toBe(false);
    });
  });

  describe('removeRestoPermissions', () => {
    it('should remove permissions from a user and return updated permissions',
      async () => {
        const permissionsToRemove = ['EDIT_MENU'];
        const updatedPermissions = ['VIEW_MENU'];
        UserRestoMock.findOneAndUpdate
          .mockResolvedValue({ permissions: updatedPermissions });

        const result = await removeRestoPermissions(1, permissionsToRemove);
        expect(UserRestoMock.findOneAndUpdate)
          .toHaveBeenCalledWith(
            { uid: 1 },
            { $pullAll: { permissions: permissionsToRemove } },
            { new: true }
          );
        expect(result)
          .toEqual(updatedPermissions);
      }
    );

    it('should return false if user is not found', async () => {
      UserRestoMock.findOneAndUpdate.mockResolvedValue(null);

      const result = await removeRestoPermissions(1, ['EDIT_MENU']);
      expect(UserRestoMock.findOneAndUpdate)
        .toHaveBeenCalled();
      expect(result)
        .toBe(false);
    });
  });

  describe('deleteAllRestoPermissions', () => {
    it('should delete all permissions for a user and return undefined',
      async () => {
        UserRestoMock.findOneAndUpdate
          .mockResolvedValue({ permissions: undefined });

        const result = await deleteAllRestoPermissions(1);
        expect(UserRestoMock.findOneAndUpdate)
          .toHaveBeenCalledWith(
            { uid: 1 },
            { $unset: { permissions: 1 } },
            { new: true }
          );
        expect(result)
          .toBeUndefined();
      }
    );

    it('should return false if user is not found', async () => {
      UserRestoMock.findOneAndUpdate.mockResolvedValue(null);

      const result = await deleteAllRestoPermissions(1);
      expect(UserRestoMock.findOneAndUpdate)
        .toHaveBeenCalled();
      expect(result)
        .toBe(false);
    });
  });
});
