import mongoose from 'mongoose';
import * as ingredientController
  from '../../src/controllers/ingredientsController';

// Mock mongoose model
jest.mock('mongoose');

describe('ingredientController', () => {
  const IngredientSchemaMock = {
    find: jest.fn()
      .mockReturnThis(),
    findOne: jest.fn()
      .mockReturnThis(),
    deleteOne: jest.fn()
      .mockReturnThis(),
    sort: jest.fn()
      .mockReturnThis(),
    limit: jest.fn()
      .mockReturnValue([{ _id: 1 }]),
    exec: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(() => {
    mongoose.model = jest.fn()
      .mockReturnValue(IngredientSchemaMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isArrayOfStrings', () => {
    it('should return true if the input is an array of strings', () => {
      const result = ingredientController.isArrayOfStrings(['apple', 'banana']);
      expect(result)
        .toBe(true);
    });

    it('should return false if the input is not an array of strings', () => {
      const result = ingredientController.isArrayOfStrings(['apple', 1, true]);
      expect(result)
        .toBe(false);
    });
  });

  describe('findRelevantAllergens', () => {
    it('should return a list of allergens not in health labels', () => {
      const healthLabels = ['gluten_free', 'soy_free'];
      const result = ingredientController.findRelevantAllergens(healthLabels);
      expect(result)
        .toContain('Crustaceans and crustacean products');
      expect(result).not.toContain('Gluten-containing grains');
      expect(result).not.toContain('Soy and soy products');
    });
  });

  describe('createNewIngredient', () => {
    // it('should create and save a new ingredient', async () => {
    //   IngredientSchemaMock.save.mockResolvedValueOnce({ name: 'Salt', _id: 1 });
    //
    //   await ingredientController
    //     .createNewIngredient('123', 'Salt', { calories: 10 },
    //       ['gluten_free'], ['Gluten']);
    //
    //   expect(IngredientSchemaMock.save)
    //     .toHaveBeenCalled();
    // });
  });

  describe('getAllIngredients', () => {
    it('should return all ingredients', async () => {
      IngredientSchemaMock.find
        .mockResolvedValueOnce([{ name: 'Salt' }, { name: 'Pepper' }]);

      const result = await ingredientController.getAllIngredients();

      expect(IngredientSchemaMock.find)
        .toHaveBeenCalled();
      expect(result)
        .toEqual([{ name: 'Salt' }, { name: 'Pepper' }]);
    });
  });

  describe('getIngredientByName', () => {
    it('should return ingredients by name', async () => {
      IngredientSchemaMock.find.mockResolvedValueOnce([{ name: 'Salt' }]);

      const result = await ingredientController.getIngredientByName('Salt');

      expect(IngredientSchemaMock.find)
        .toHaveBeenCalledWith({ name: 'salt' });
      expect(result)
        .toEqual([{ name: 'Salt' }]);
    });

    it('should return an empty array if no ingredient is found', async () => {
      IngredientSchemaMock.find.mockResolvedValueOnce([]);

      const result = await ingredientController.getIngredientByName('Unknown');

      expect(result)
        .toEqual([]);
    });
  });

  describe('getIngredientById', () => {
    it('should return ingredient by foodID', async () => {
      IngredientSchemaMock.find
        .mockResolvedValueOnce([{ foodID: '123', name: 'Salt' }]);

      const result = await ingredientController.getIngredientById('123');

      expect(IngredientSchemaMock.find)
        .toHaveBeenCalledWith({ foodID: '123' });
      expect(result)
        .toEqual([{ foodID: '123', name: 'Salt' }]);
    });
  });

  describe('deleteIngredient', () => {
    it('should delete an ingredient by ID', async () => {
      IngredientSchemaMock.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

      await ingredientController.deleteIngredient('Salt', '123');

      expect(IngredientSchemaMock.deleteOne)
        .toHaveBeenCalledWith({ _id: '123' });
    });

    it('should handle cases where ingredient deletion fails', async () => {
      IngredientSchemaMock.deleteOne
        .mockRejectedValueOnce(new Error('Delete failed'));

      await expect(ingredientController
        .deleteIngredient('Salt', '123')).rejects.toThrow('Delete failed');
    });
  });

  describe('findMaxIndexIngredients', () => {
    it('should return the highest ingredient index', async () => {
      IngredientSchemaMock.limit.mockResolvedValueOnce([{ _id: 5 }]);

      const result = await ingredientController.findMaxIndexIngredients();

      expect(IngredientSchemaMock.find)
        .toHaveBeenCalled();
      expect(IngredientSchemaMock.sort)
        .toHaveBeenCalledWith({ _id: -1 });
      expect(IngredientSchemaMock.limit)
        .toHaveBeenCalledWith(1);
      expect(result)
        .toBe(5);
    });

    it('should return 0 if no ingredients are found', async () => {
      IngredientSchemaMock.limit.mockResolvedValueOnce([]);

      const result = await ingredientController.findMaxIndexIngredients();

      expect(result)
        .toBe(0);
    });
  });
});
