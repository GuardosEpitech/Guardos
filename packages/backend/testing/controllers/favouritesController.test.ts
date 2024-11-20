import mongoose from 'mongoose';
import * as favouritesController
  from '../../src/controllers/favouritesController';
import { getRestaurantByID } from '../../src/controllers/restaurantController';
import { getDishByID } from '../../src/controllers/dishesController';
import {IRestaurantFrontEnd} from '../../../shared/models/restaurantInterfaces';

jest.mock('mongoose');
jest.mock('../../src/controllers/restaurantController');
jest.mock('../../src/controllers/dishesController');

describe('favouritesController', () => {
  let UserMock: any;
  const mockDish: any = {
    name: 'Spring Rolls',
    uid: 1,
    description: 'Crispy spring rolls',
    price: 5.99,
    allergens: ['Gluten'],
    fitsPreference: true,
    pictures: ['http://testrestaurant.com/springrolls.jpg'],
    picturesId: [1],
    category: {
      foodGroup: 'Starters',
      extraGroup: ['Vegan'],
      menuGroup: 'Appetizers',
    },
    resto: 'Test Restaurant',
    products: ['Wrapper', 'Vegetables'],
    discount: 0,
    validTill: '2023-12-31',
    combo: [],
  };
  const mockRestaurantData: IRestaurantFrontEnd = {
    name: 'Test Restaurant',
    uid: 1,
    userID: 1,
    restoChainID: 1,
    phoneNumber: '123-456-7890',
    website: 'http://testrestaurant.com',
    description: 'A test restaurant for unit testing.',
    categories: [
      {
        name: 'Appetizers',
        hitRate: 50,
        dishes: [
          mockDish,
          {
            name: 'Salad',
            uid: 2,
            description: 'Fresh garden salad',
            price: 4.99,
            allergens: ['Nuts'],
            fitsPreference: true,
            pictures: ['http://testrestaurant.com/salad.jpg'],
            picturesId: [2],
            category: {
              foodGroup: 'Starters',
              extraGroup: ['Vegetarian'],
              menuGroup: 'Appetizers',
            },
            resto: 'Test Restaurant',
            products: ['Lettuce', 'Dressing'],
            discount: 0,
            validTill: '2023-12-31',
            combo: [],
          },
        ],
      },
      {
        name: 'Main Course',
        hitRate: 100,
        dishes: [
          {
            name: 'Pasta',
            uid: 3,
            description: 'Delicious pasta with tomato sauce',
            price: 10.99,
            allergens: [],
            fitsPreference: true,
            pictures: ['http://testrestaurant.com/pasta.jpg'],
            picturesId: [3],
            category: {
              foodGroup: 'Main',
              extraGroup: ['Vegetarian'],
              menuGroup: 'Main Course',
            },
            resto: 'Test Restaurant',
            products: ['Noodles', 'Tomato Sauce'],
            discount: 0,
            validTill: '2023-12-31',
            combo: [],
          },
        ],
      },
    ],
    location: {
      streetName: 'Test St',
      streetNumber: '1',
      postalCode: '12345',
      city: 'Test City',
      country: 'Testland',
      latitude: '0',
      longitude: '0',
    },
    openingHours: [
      {
        day: 0,
        open: '09:00',
        close: '21:00',
      },
      {
        day: 1,
        open: '09:00',
        close: '21:00',
      },
    ],
    pictures: ['http://testrestaurant.com/pic1.jpg'],
    picturesId: [1],
    hitRate: 100,
    range: 5,
    rating: 4.5,
    ratingCount: 100,
    products: [
      {
        name: 'Wrapper',
        allergens: ['Gluten'],
        ingredients: ['Wheat', 'Salt'],
      },
      {
        name: 'Vegetables',
        allergens: [],
        ingredients: ['Carrot', 'Cabbage'],
      },
    ],
    dishes: [
      mockDish,
      {
        name: 'Salad',
        uid: 2,
        description: 'Fresh garden salad',
        price: 4.99,
        allergens: ['Nuts'],
        fitsPreference: true,
        pictures: ['http://testrestaurant.com/salad.jpg'],
        picturesId: [2],
        category: {
          foodGroup: 'Starters',
          extraGroup: ['Vegetarian'],
          menuGroup: 'Appetizers',
        },
        resto: 'Test Restaurant',
        products: ['Lettuce', 'Dressing'],
        discount: 0,
        validTill: '2023-12-31',
        combo: [],
      },
    ],
    menuDesignID: 1,
    statistics: {
      totalClicks: 1000,
      clicksThisMonth: 100,
      clicksThisWeek: 25,
      updateMonth: '2023-10',
      updateWeek: '2023-10-01',
      userDislikedIngredients: [{ name: 'Wheat', count: 10 }],
      userAllergens: [{ name: 'Nuts', count: 5 }],
    },
  };

  beforeEach(() => {
    UserMock = {
      findOne: jest.fn()
        .mockReturnThis(),
      findOneAndUpdate: jest.fn()
        .mockReturnThis(),
      exec: jest.fn(),
    };

    mongoose.model = jest.fn((modelName) => {
      if (modelName === 'User') return UserMock;
    });

    (getRestaurantByID as jest.MockedFunction<typeof getRestaurantByID>)
      .mockResolvedValue(mockRestaurantData);
    (getDishByID as jest.MockedFunction<typeof getDishByID>)
      .mockResolvedValue(mockDish);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRestoFavourites', () => {
    it('should return the list of favourite restaurants for a user', async () => {
      const userData = {
        favouriteLists: { restoIDs: [1, 2] },
      };
      UserMock.findOne.mockResolvedValue(userData);

      const result = await favouritesController.getRestoFavourites(1);
      expect(UserMock.findOne)
        .toHaveBeenCalledWith({ uid: 1 });
      expect(getRestaurantByID)
        .toHaveBeenCalledTimes(2); // For both restaurant IDs
      expect(result[0].name)
        .toEqual('Test Restaurant');
    });

    it('should return null if user is not found', async () => {
      UserMock.findOne.mockResolvedValue(null);

      const result = await favouritesController.getRestoFavourites(1);
      expect(result)
        .toBeNull();
    });

    it('should throw error on failure', async () => {
      UserMock.findOne.mockRejectedValue(new Error('Database error'));

      await expect(favouritesController.getRestoFavourites(1))
        .rejects.toThrow('Database error');
    });
  });

  describe('getDishFavourites', () => {
    it('should return the list of favourite dishes for a user', async () => {
      const userData = {
        favouriteLists: {
          dishIDs: [
            { restoID: 1, dishID: 1 },
            { restoID: 2, dishID: 2 },
          ],
        },
      };
      UserMock.findOne.mockResolvedValue(userData);

      const result = await favouritesController.getDishFavourites(1);
      expect(UserMock.findOne)
        .toHaveBeenCalledWith({ uid: 1 });
      expect(getDishByID)
        .toHaveBeenCalledTimes(2); // For both dishes
      expect(result[0].dish.name)
        .toEqual('Spring Rolls');
    });

    it('should return null if user is not found', async () => {
      UserMock.findOne.mockResolvedValue(null);

      const result = await favouritesController.getDishFavourites(1);
      expect(result)
        .toBeNull();
    });

    it('should throw error on failure', async () => {
      UserMock.findOne.mockRejectedValue(new Error('Database error'));

      await expect(favouritesController.getDishFavourites(1))
        .rejects.toThrow('Database error');
    });
  });

  describe('addRestoAsFavourite', () => {
    it('should add a restaurant to the favourites list', async () => {
      const userData = { favouriteLists: { restoIDs: [1] } };
      UserMock.findOneAndUpdate.mockResolvedValue(userData);

      const result = await favouritesController.addRestoAsFavourite(1, 2);
      expect(UserMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { uid: 1 },
          { $addToSet: { 'favouriteLists.restoIDs': 2 } },
          { new: true }
        );
      expect(result)
        .toEqual(userData);
    });

    it('should return null if user not found', async () => {
      UserMock.findOneAndUpdate.mockResolvedValue(null);

      const result = await favouritesController.addRestoAsFavourite(1, 2);
      expect(result)
        .toBeNull();
    });

    it('should throw error on failure', async () => {
      UserMock.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await expect(favouritesController.addRestoAsFavourite(1, 2))
        .rejects.toThrow('Database error');
    });
  });

  describe('addDishAsFavourite', () => {
    it('should add a dish to the favourites list', async () => {
      const userData = { favouriteLists: { dishIDs: [1] } };
      UserMock.findOneAndUpdate.mockResolvedValue(userData);

      const result = await favouritesController.addDishAsFavourite(1, 2, 3);
      expect(UserMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { uid: 1 },
          {
            $addToSet: {
              'favouriteLists.dishIDs': { restoID: 2, dishID: 3 },
            },
          },
          { new: true }
        );
      expect(result)
        .toEqual(userData);
    });

    it('should return null if user not found', async () => {
      UserMock.findOneAndUpdate.mockResolvedValue(null);

      const result = await favouritesController.addDishAsFavourite(1, 2, 3);
      expect(result)
        .toBeNull();
    });

    it('should throw error on failure', async () => {
      UserMock.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await expect(favouritesController.addDishAsFavourite(1, 2, 3))
        .rejects.toThrow('Database error');
    });
  });

  describe('deleteRestoFromFavourites', () => {
    it('should remove a restaurant from the favourites list', async () => {
      const userData = { favouriteLists: { restoIDs: [1, 2] } };
      UserMock.findOneAndUpdate.mockResolvedValue(userData);

      const result = await favouritesController.deleteRestoFromFavourites(1, 2);
      expect(UserMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { uid: 1 },
          { $pull: { 'favouriteLists.restoIDs': 2 } },
          { new: true }
        );
      expect(result)
        .toEqual(userData);
    });

    it('should return null if user not found', async () => {
      UserMock.findOneAndUpdate.mockResolvedValue(null);

      const result = await favouritesController.deleteRestoFromFavourites(1, 2);
      expect(result)
        .toBeNull();
    });

    it('should throw error on failure', async () => {
      UserMock.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await expect(favouritesController.deleteRestoFromFavourites(1, 2))
        .rejects.toThrow('Database error');
    });
  });

  describe('deleteDishFromFavourites', () => {
    it('should remove a dish from the favourites list', async () => {
      const userData = { favouriteLists:
          { dishIDs: [{ restoID: 1, dishID: 2 }] } };
      UserMock.findOneAndUpdate.mockResolvedValue(userData);

      const result = await favouritesController
        .deleteDishFromFavourites(1, 1, 2);
      expect(UserMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { uid: 1 },
          { $pull: { 'favouriteLists.dishIDs': { restoID: 1, dishID: 2 } } },
          { new: true }
        );
      expect(result)
        .toEqual(userData);
    });

    it('should return null if user not found', async () => {
      UserMock.findOneAndUpdate.mockResolvedValue(null);

      const result = await favouritesController
        .deleteDishFromFavourites(1, 1, 2);
      expect(result)
        .toBeNull();
    });

    it('should throw error on failure', async () => {
      UserMock.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

      await expect(favouritesController
        .deleteDishFromFavourites(1, 1, 2)).rejects.toThrow('Database error');
    });
  });
});
