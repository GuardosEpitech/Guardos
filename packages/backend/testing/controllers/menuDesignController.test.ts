import mongoose from 'mongoose';
import { getAllMenuDesigns } from '../../src/controllers/menuDesignsController';

describe('Menu Design Controller Tests', () => {
  const mockMenuDesignData = [
    {
      _id: '1',
      designName: 'Modern',
      template: 'modern-template',
    },
    {
      _id: '2',
      designName: 'Classic',
      template: 'classic-template',
    },
  ];

  const MenuDesignModel = {
    find: jest.fn(),
  };

  beforeEach(() => {
    mongoose.model = jest.fn()
      .mockReturnValue(MenuDesignModel);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMenuDesigns', () => {
    it('should return all menu designs', async () => {
      MenuDesignModel.find.mockResolvedValueOnce(mockMenuDesignData);

      const result = await getAllMenuDesigns();
      expect(result)
        .toEqual(mockMenuDesignData);
      expect(MenuDesignModel.find)
        .toHaveBeenCalled();
    });

    it('should return an empty array if no menu designs are found', async () => {
      MenuDesignModel.find.mockResolvedValueOnce([]);

      const result = await getAllMenuDesigns();
      expect(result)
        .toEqual([]);
      expect(MenuDesignModel.find)
        .toHaveBeenCalled();
    });
  });
});
