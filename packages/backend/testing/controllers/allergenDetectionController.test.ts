import { detectAllergens }
  from '../../src/controllers/allergenDetectionController';
import { findIngredientInfos } from '../../src/middleware/allergensMiddleware';

// Mock the findIngredientInfos function
jest.mock('../../src/middleware/allergensMiddleware', () => ({
  findIngredientInfos: jest.fn(),
}));

describe('Allergen Detection Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('detectAllergens', () => {
    it('should return 400 if no product provided', async () => {
      const req = { body: { } };

      // @ts-ignore
      const result = await detectAllergens(req);

      expect(result)
        .toEqual({ status: 400, data: 'No ingredients provided' });
    });

    it('should detect allergens in a single ingredient from req.body.name', async () => {
      const req = { body: { name: 'apple' } };
      (findIngredientInfos as jest.Mock)
        .mockResolvedValueOnce('No allergens found');

      // @ts-ignore
      const result = await detectAllergens(req);

      expect(findIngredientInfos)
        .toHaveBeenCalledWith('apple');
      expect(result)
        .toEqual({ status: 404, data: ['No allergens found'] });
    });

    it('should detect allergens for multiple products in req.body.dish.products', async () => {
      const req = { body: { dish: { products: ['peanut', 'milk'] } } };
      (findIngredientInfos as jest.Mock)
        .mockResolvedValueOnce('Contains peanut allergens')
        .mockResolvedValueOnce('Contains milk allergens');

      // @ts-ignore
      const result = await detectAllergens(req);

      expect(findIngredientInfos)
        .toHaveBeenCalledWith('peanut');
      expect(findIngredientInfos)
        .toHaveBeenCalledWith('milk');
      expect(result)
        .toEqual({
          status: 200,
          data: ['Contains peanut allergens', 'Contains milk allergens'],
        });
    });

    it('should handle no allergens found in any ingredient', async () => {
      const req = { body: { dish: { products: ['lettuce'] } } };
      (findIngredientInfos as jest.Mock)
        .mockResolvedValueOnce('No allergens found');

      // @ts-ignore
      const result = await detectAllergens(req);

      expect(findIngredientInfos)
        .toHaveBeenCalledWith('lettuce');
      expect(result)
        .toEqual({ status: 404, data: ['No allergens found'] });
    });

    it('should return 500 if an error occurs', async () => {
      const req = { body: { dish: { products: ['unknown'] } } };
      (findIngredientInfos as jest.Mock)
        .mockRejectedValueOnce(new Error('Detection error'));

      // @ts-ignore
      const result = await detectAllergens(req);

      expect(result)
        .toEqual({ status: 500, data: 'Failed to detect allergens' });
    });
  });
});
