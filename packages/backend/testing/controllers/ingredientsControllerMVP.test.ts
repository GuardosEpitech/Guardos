import mongoose from 'mongoose';
import * as ingredientsController
  from '../../src/controllers/ingredientsControllerMVP';

// Mock mongoose model
jest.mock('mongoose');

describe('ingredientsControllerMVP', () => {
  const IngredientSchemaMock = {
    findOne: jest.fn()
      .mockReturnThis(),
    find: jest.fn()
      .mockReturnThis(),
    deleteOne: jest.fn()
      .mockReturnThis(),
    sort: jest.fn()
      .mockReturnThis(),
    limit: jest.fn()
      .mockReturnThis(),
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

  describe('createNewIngredient', () => {
    // it('should save a new ingredient if it does not exist', async () => {
    //   IngredientSchemaMock.findOne.mockResolvedValue(null); // No existing ingredient
    //   IngredientSchemaMock.save.mockResolvedValue({ name: 'Salt', _id: 1 });
    //
    //   const result = await ingredientsController
    //     .createNewIngredient('Salt', 1, ['None']);
    //
    //   expect(mongoose.model)
    //     .toHaveBeenCalledWith('IngredientsMVP', expect.anything());
    //   expect(IngredientSchemaMock.findOne)
    //     .toHaveBeenCalledWith({
    //       name: { $regex: new RegExp('^' + 'Salt' + '$', 'i') },
    //     });
    //   expect(IngredientSchemaMock.save)
    //     .toHaveBeenCalled();
    //   expect(result)
    //     .toEqual({ status: 200, message: 'Ingredient saved successfully.' });
    // });

    it('should return an error if the ingredient already exists', async () => {
      IngredientSchemaMock.findOne.mockResolvedValueOnce({ _id: 1, name: 'Salt' });

      const result = await ingredientsController
        .createNewIngredient('Salt', 1, ['None']);

      expect(IngredientSchemaMock.findOne)
        .toHaveBeenCalled();
      expect(result)
        .toEqual({
          status: 400,
          message: 'Ingredient with name Salt already exists.',
        });
    });

  //   it('should handle an error if saving fails', async () => {
  //     IngredientSchemaMock.findOne.mockResolvedValue(null);
  //     IngredientSchemaMock.save.mockRejectedValue(new Error('Save failed'));
  //
  //     const result = await ingredientsController
  //       .createNewIngredient('Sugar', 2, ['None']);
  //
  //     expect(IngredientSchemaMock.save)
  //       .toHaveBeenCalled();
  //     expect(result)
  //       .toEqual({ status: 500, message: 'Internal Server Error.' });
  //   });
  });

  describe('getAllIngredients', () => {
    it('should return a list of all ingredients', async () => {
      IngredientSchemaMock.find.mockResolvedValueOnce([{ name: 'Salt' }, { name: 'Pepper' }]);

      const result = await ingredientsController.getAllIngredients();

      expect(IngredientSchemaMock.find)
        .toHaveBeenCalled();
      expect(result)
        .toEqual([{ name: 'Salt' }, { name: 'Pepper' }]);
    });
  });

  describe('getIngredientByName', () => {
    it('should return an ingredient by name', async () => {
      IngredientSchemaMock.find.mockResolvedValueOnce([{ name: 'Salt' }]);

      const result = await ingredientsController.getIngredientByName('Salt');

      expect(IngredientSchemaMock.find)
        .toHaveBeenCalledWith({ name: 'Salt' });
      expect(result)
        .toEqual([{ name: 'Salt' }]);
    });

    it('should return an empty array if the ingredient is not found', async () => {
      IngredientSchemaMock.find.mockResolvedValueOnce([]);

      const result = await ingredientsController.getIngredientByName('Unknown');

      expect(result)
        .toEqual([]);
    });
  });

  describe('deleteIngredient', () => {
    it('should delete an ingredient by id', async () => {
      IngredientSchemaMock.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await ingredientsController.deleteIngredient('Salt', 1);

      expect(IngredientSchemaMock.deleteOne)
        .toHaveBeenCalledWith({ _id: 1 });
    });

    it('should handle cases where ingredient deletion fails', async () => {
      IngredientSchemaMock.deleteOne.mockRejectedValue(new Error('Delete failed'));

      await expect(ingredientsController.deleteIngredient('Salt', 1)).rejects.toThrow(
        'Delete failed'
      );
    });
  });

  describe('findMaxIndexIngredients', () => {
    it('should return the highest ingredient index', async () => {
      IngredientSchemaMock.limit.mockResolvedValue([{ _id: 5 }]);

      const result = await ingredientsController.findMaxIndexIngredients();

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
      IngredientSchemaMock.limit.mockResolvedValue([]);

      const result = await ingredientsController.findMaxIndexIngredients();

      expect(result)
        .toBe(0);
    });
  });
});
