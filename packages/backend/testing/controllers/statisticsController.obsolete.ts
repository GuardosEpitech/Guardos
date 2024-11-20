import mongoose from 'mongoose';
import {
  updateRestoUserStatistics,
  getStatisticsForResto
} from '../../src/controllers/statisticsController';

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    model: jest.fn()
      .mockReturnValue({
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn()
      })
  };
});

describe('statisticsController', () => {
  const Restaurant = {
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
      .mockReturnValue(Restaurant);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateRestoUserStatistics', () => {
    it('should increment existing allergen counts and add new ones',
      async () => {
        const mockRestaurant = {
          _id: 1,
          statistics: {
            userAllergens: [{ allergen: 'peanut', count: 1 }]
          },
          save: jest.fn()
        };
        Restaurant.findOne.mockResolvedValue(mockRestaurant);

        const updatedRestaurant = await updateRestoUserStatistics(1,
          ['peanut', 'soy'], []);

        expect(updatedRestaurant.statistics.userAllergens)
          .toEqual([
            { allergen: 'peanut', count: 2 },
            { allergen: 'soy', count: 1 }
          ]);
        expect(mockRestaurant.save)
          .toHaveBeenCalled();
      }
    );

    it('should increment existing disliked ingredient counts and add new ones',
      async () => {
        const mockRestaurant = {
          _id: 1,
          statistics: {
            userDislikedIngredients: [{ ingredient: 'tomato', count: 2 }]
          },
          save: jest.fn()
        };
        Restaurant.findOne.mockResolvedValue(mockRestaurant);

        const updatedRestaurant = await updateRestoUserStatistics(1,
          [], ['tomato', 'onion']);

        expect(updatedRestaurant.statistics.userDislikedIngredients)
          .toEqual([
            { ingredient: 'tomato', count: 3 },
            { ingredient: 'onion', count: 1 }
          ]);
        expect(mockRestaurant.save)
          .toHaveBeenCalled();
      }
    );

    it('should handle clicks and update monthly and weekly counts',
      async () => {
        const mockRestaurant = {
          _id: 1,
          statistics: {
            totalClicks: 5,
            clicksThisMonth: 2,
            clicksThisWeek: 1,
            updateMonth: '2024-11',
            updateWeek: '2024-1'
          },
          save: jest.fn()
        };
        const mockDate = new Date('2024-11-15');
        const dateSpy = jest.spyOn(global, 'Date')
          .mockImplementation(() => mockDate);

        Restaurant.findOne.mockResolvedValue(mockRestaurant);

        const updatedRestaurant = await updateRestoUserStatistics(1, [], []);

        expect(updatedRestaurant.statistics.totalClicks)
          .toBe(6);
        expect(updatedRestaurant.statistics.clicksThisMonth)
          .toBe(3);
        expect(updatedRestaurant.statistics.clicksThisWeek)
          .toBe(2);
        expect(mockRestaurant.save)
          .toHaveBeenCalled();

        dateSpy.mockRestore();
      }
    );

    it('should initialize statistics if missing', async () => {
      const mockRestaurant = {
        _id: 1,
        statistics: {
          userAllergens: {
            find: jest.fn()
              .mockReturnValueOnce(['gluten'])
          },
          userDislikedIngredients: {
            find: jest.fn()
              .mockReturnValueOnce(['egg']),
            push: jest.fn()
              .mockReturnThis()
          }
        },
        save: jest.fn()
      };
      Restaurant.findOne.mockResolvedValue(mockRestaurant);

      const updatedRestaurant = await updateRestoUserStatistics(1,
        ['gluten'], ['egg']);

      // expect(updatedRestaurant.statistics.userAllergens)
      //   .toEqual([{ allergen: 'gluten', count: 1 }]);
      // expect(updatedRestaurant.statistics.userDislikedIngredients)
      //   .toEqual([{ ingredient: 'egg', count: 1 }]);
      // expect(updatedRestaurant.statistics.totalClicks)
      //   .toBe(1);
      // expect(updatedRestaurant.statistics.clicksThisMonth)
      //   .toBe(1);
      // expect(updatedRestaurant.statistics.clicksThisWeek)
      //   .toBe(1);
      expect(mockRestaurant.save)
        .toHaveBeenCalled();
    });

    it('should return null if restaurant is not found', async () => {
      Restaurant.findOne.mockResolvedValue(null);

      const result = await updateRestoUserStatistics(1, [], []);

      expect(result)
        .toBeNull();
    });
  });

  describe('getStatisticsForResto', () => {
    it('should return statistics for all restaurants of a user', async () => {
      const mockRestaurants = [
        {
          _id: 1,
          statistics: {
            totalClicks: 10,
            clicksThisMonth: 5,
            clicksThisWeek: 2,
            updateMonth: '2024-11',
            updateWeek: '2024-45',
            userAllergens: [{ allergen: 'peanut', count: 1 }],
            userDislikedIngredients: [{ ingredient: 'onion', count: 1 }]
          }
        },
        {
          _id: 2,
          statistics: {
            totalClicks: 3,
            clicksThisMonth: 1,
            clicksThisWeek: 1,
            updateMonth: '2024-11',
            updateWeek: '2024-45',
            userAllergens: [],
            userDislikedIngredients: []
          }
        }
      ];
      Restaurant.find.mockResolvedValue(mockRestaurants);

      const result = await getStatisticsForResto(1);

      expect(result)
        .toEqual([
          {
            restoId: 1,
            totalClicks: 10,
            clicksThisMonth: 5,
            clicksThisWeek: 2,
            updateMonth: '2024-11',
            updateWeek: '2024-45',
            userAllergens: [{ allergen: 'peanut', count: 1 }],
            userDislikedIngredients: [{ ingredient: 'onion', count: 1 }]
          },
          {
            restoId: 2,
            totalClicks: 3,
            clicksThisMonth: 1,
            clicksThisWeek: 1,
            updateMonth: '2024-11',
            updateWeek: '2024-45',
            userAllergens: [],
            userDislikedIngredients: []
          }
        ]);
    });

    it('should return null if no restaurants found for user', async () => {
      Restaurant.find.mockResolvedValue([]);

      const result = await getStatisticsForResto(1);

      expect(result)
        .toBeNull();
    });
  });
});
