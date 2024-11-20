import mongoose from 'mongoose';
import * as dishesController from '../../src/controllers/dishesController';
import * as restaurantController
  from '../../src/controllers/restaurantController';
import {getAllUserRestaurants, getRestaurantByID, getAllRestosFromRestoChain}
  from '../../src/controllers/restaurantController';
import {IRestaurantFrontEnd} from '../../../shared/models/restaurantInterfaces';

jest.mock('../../src/controllers/restaurantController', () => ({
  getAllUserRestaurants: jest.fn(),
  getRestaurantByID: jest.fn(),
  getAllRestosFromRestoChain: jest.fn(),
}));

describe('dishesController', () => {
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
  const mockRestaurantData: IRestaurantFrontEnd & {mealType: {
      name: string;
      id: number;
      sortId: number;
      find: any;
    }} = {
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
      mealType: {
        name: 'Lunch',
        id: 2,
        sortId: 3,
        find: jest.fn()
          .mockReturnValue({
            name: 'Lunch',
            id: 2,
            sortId: 3
          })
      }
    };

  const mockRestaurantModel = {
    find: jest.fn()
      .mockReturnValue([mockRestaurantData]),
    findOne: jest.fn()
      .mockReturnValue(mockRestaurantData),
    findOneAndUpdate: jest.fn()
      .mockReturnValue(mockRestaurantData),
  };

  beforeAll(() => {
    mongoose.model = jest.fn()
      .mockReturnValue(mockRestaurantModel);
    mockRestaurantData.dishes.find = jest.fn()
      .mockReturnValue(mockDish);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDishesByRestaurantName', () => {
    it('should return dishes for a given restaurant name', async () => {
      const restaurantName = 'Test Restaurant';
      const dishes = [{ name: 'Dish 1' }];
      mockRestaurantModel.find.mockResolvedValueOnce([{ dishes }]);

      const result = await dishesController
        .getDishesByRestaurantName(restaurantName);
      expect(mockRestaurantModel.find)
        .toHaveBeenCalledWith({ name: restaurantName }, 'dishes');
      expect(result)
        .toEqual([{ dishes }]);
    });
  });

  describe('getDishByName', () => {
    it('should return a specific dish by name', async () => {
      const restaurantName = 'Test Restaurant';
      const dishName = 'Dish 1';
      const dish = { name: dishName };
      mockRestaurantModel.findOne.mockResolvedValueOnce({ dishes: {
        find: jest.fn()
          .mockReturnValue(dish)
      }});

      const result = await dishesController
        .getDishByName(restaurantName, dishName);
      expect(result)
        .toEqual(dish);
      expect(mockRestaurantModel.findOne)
        .toHaveBeenCalledWith({ name: restaurantName });
    });

    it('should return null if restaurant is not found', async () => {
      mockRestaurantModel.findOne.mockResolvedValueOnce(null);
      const result = await dishesController
        .getDishByName('Unknown Restaurant', 'Dish 1');
      expect(result)
        .toBeNull();
    });
  });

  describe('getDishByID', () => {
    it('should return a dish by its ID', async () => {
      const restaurantID = 123;
      const dishID = 456;
      const dish = { uid: dishID, name: 'Dish 1' };
      mockRestaurantModel.findOne.mockResolvedValueOnce({ dishes: [dish] });

      const result = await dishesController
        .getDishByID(restaurantID, dishID);
      expect(mockRestaurantModel.findOne)
        .toHaveBeenCalledWith({ _id: restaurantID });
      expect(result)
        .toEqual(dish);
    });

    it('should return null if the restaurant is not found', async () => {
      mockRestaurantModel.findOne.mockResolvedValueOnce(null);
      const result = await dishesController.getDishByID(123, 456);
      expect(result)
        .toBeNull();
    });
  });

  describe('getDishByUser', () => {
    it('should return dishes for all restaurants of a user', async () => {
      const loggedInUserId = 1;
      (getAllUserRestaurants as jest.MockedFunction<typeof getAllUserRestaurants>)
        .mockResolvedValue([mockRestaurantData]);

      const result = await dishesController.getDishByUser(loggedInUserId);
      expect(restaurantController.getAllUserRestaurants)
        .toHaveBeenCalledWith(loggedInUserId);
      expect(result.length)
        .toEqual(2);
    });
  });

  describe('getAllDishes', () => {
    it('should return all dishes from all restaurants', async () => {
      const result = await dishesController.getAllDishes();
      expect(mockRestaurantModel.find)
        .toHaveBeenCalled();
      expect(result.length)
        .toEqual(2);
    });
  });

  describe('createNewDish', () => {
    it('should create a new dish for a restaurant', async () => {
      const restaurantName = 'Test Restaurant';
      const userID = 1;
      const dish = {
        name: 'New Dish',
        discount: 10,
        uid: 1,
        description: 'bla',
        price: 12,
        userID: 1,
        validTill: '2024-11-11',
        category: {
          menuGroup: 'Lunch',
          foodGroup: 'Group 2',
          extraGroup: ['Group 3'],
        }
      };

      mockRestaurantModel.findOne.mockResolvedValueOnce(mockRestaurantData);

      const result = await dishesController
        .createNewDish(restaurantName, dish, userID);
      expect(result.name)
        .toEqual(dish.name);
    });
  });

  describe('createNewForEveryRestoChainDish', () => {
    it('should create a new dish for every restaurant chain', async () => {
      const dish = {
        name: 'New Dish',
        discount: 10,
        uid: 1,
        description: 'bla',
        price: 12,
        userID: 1,
        validTill: '2024-11-11',
        category: {
          menuGroup: 'Group 1',
          foodGroup: 'Group 2',
          extraGroup: ['Group 3'],
        }
      };

      (getAllRestosFromRestoChain as jest.MockedFunction<typeof getAllRestosFromRestoChain>)
        .mockResolvedValue([mockRestaurantData]);

      const result = await dishesController
        .createNewForEveryRestoChainDish(dish, 1, 2, 'Test Restaurant');
      expect(result.name)
        .toEqual(dish.name);
    });
  });

  describe('changeDishByName', () => {
    it('should change a dish by name', async () => {
      const restaurantName = 'Test Restaurant';
      const newDish = {
        name: 'New Dish',
        discount: 10,
        uid: 1,
        userID: 1,
        description: 'bla',
        price: 12,
        validTill: '2024-11-11',
        category: {
          menuGroup: 'Group 1',
          foodGroup: 'Group 2',
          extraGroup: ['Group 3'],
        },
        allergens: ['Gluten'],
        combo: [] as unknown as [number],
        pictures: ['http://testrestaurant.com/springrolls.jpg'],
        picturesId: [1],
        products: ['Wrapper', 'Vegetables'],
      };
      mockRestaurantModel.findOne.mockResolvedValueOnce({
        name: restaurantName,
        dishes: {
          find: jest.fn()
            .mockReturnValueOnce(mockDish)
        }
      });
      mockRestaurantModel.findOneAndUpdate.mockResolvedValueOnce(newDish);

      await dishesController
        .changeDishByName(restaurantName, newDish);
      expect(mockRestaurantModel.findOneAndUpdate)
        .toHaveBeenCalled();
    });
  });

  describe('deleteDishByName', () => {
    it('should delete a dish by name', async () => {
      const restaurantName = 'Test Restaurant';
      const dishName = 'Dish to Delete';
      mockRestaurantModel.findOneAndUpdate
        .mockResolvedValueOnce({ name: dishName });

      const result = await dishesController
        .deleteDishByName(restaurantName, dishName);
      expect(mockRestaurantModel.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { name: restaurantName },
          { $pull: { dishes: { name: dishName } } },
          { new: true }
        );
      expect(result)
        .toBe(`${dishName} deleted`);
    });
  });

  describe('updateDish', () => {
    it('should update a dish for a restaurant', async () => {
      const restaurantName = 'Test Restaurant';
      mockRestaurantModel.findOneAndUpdate.mockResolvedValueOnce(mockDish);

      await dishesController
        .updateDish(restaurantName, mockDish);
      expect(mockRestaurantModel.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { name: restaurantName, 'dishes.name': mockDish.name },
          { $set: { 'dishes.$': mockDish } },
          { new: true }
        );
    });
  });

  describe('addDishDiscount', () => {
  //   it.skip('should add a discount to a dish', async () => {
  //     const restoID = 1;
  //     const dish = {
  //       name: 'Salad',
  //       discount: 10,
  //       uid: 1,
  //       description: 'bla',
  //       price: 12,
  //       userID: 1,
  //       validTill: '2024-11-11',
  //     };
  //     (getRestaurantByID as jest.MockedFunction<typeof getRestaurantByID>)
  //       .mockResolvedValue(mockRestaurantData);
  //     mockRestaurantModel.findOne.mockResolvedValueOnce(mockRestaurantData);
  //
  //     const result = await dishesController.addDishDiscount(restoID, dish);
  //     expect(restaurantController.getRestaurantByID)
  //       .toHaveBeenCalledWith(restoID);
  //     expect(result)
  //       .toEqual(expect.objectContaining({ discount: dish.discount }));
  //   });
  });

  describe('removeDishDiscount', () => {
    it('should remove a discount from a dish', async () => {
      const restoID = 1;
      const dish = {
        name: 'Salad',
        discount: 0,
        uid: 1,
        description: 'bla',
        price: 12,
        userID: 1,
        validTill: '2024-11-11',
      };
      const copyMockRestaurantData = {
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
        dishes: {
          find: jest.fn()
            .mockReturnValue(mockDish)
        },
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
        mealType: {
          name: 'Lunch',
          id: 2,
          sortId: 3,
          find: jest.fn()
            .mockReturnValue({
              name: 'Lunch',
              id: 2,
              sortId: 3
            })
        }
      };

      (getRestaurantByID as jest.MockedFunction<typeof getRestaurantByID>)
        .mockResolvedValue(mockRestaurantData);
      mockRestaurantModel.findOne.mockResolvedValueOnce(mockRestaurantData);
      mockRestaurantModel.findOne.mockResolvedValueOnce(copyMockRestaurantData);
      mockRestaurantModel.findOneAndUpdate.mockResolvedValueOnce(mockDish);

      const result = await dishesController.removeDishDiscount(restoID, dish);
      expect(restaurantController.getRestaurantByID)
        .toHaveBeenCalledWith(restoID);
      expect(result)
        .toEqual(expect.objectContaining({ discount: -1 }));
    });
  });

  describe('addDishCombo', () => {
    it('should add a combo to a dish', async () => {
      const dish = {
        name: 'Salad',
        discount: 0,
        uid: 1,
        description: 'bla',
        price: 12,
        userID: 1,
        validTill: '2024-11-11',
      };
      const combo = [1, 2];
      mockRestaurantModel.findOne.mockResolvedValueOnce(mockRestaurantData);
      mockRestaurantModel.findOneAndUpdate.mockResolvedValueOnce(mockDish);

      const result = await dishesController
        .addDishCombo(mockRestaurantData, dish, combo);
      expect(result)
        .toEqual(expect.objectContaining({ combo: combo }));
    });
  });

  describe('removeDishCombo', () => {
    it('should remove a combo from a dish', async () => {
      const dish = {
        name: 'Salad',
        discount: 0,
        uid: 1,
        description: 'bla',
        price: 12,
        userID: 1,
        validTill: '2024-11-11',
      };
      mockRestaurantModel.findOne.mockResolvedValueOnce(mockRestaurantData);
      mockRestaurantModel.findOneAndUpdate.mockResolvedValueOnce(mockDish);

      const result = await dishesController
        .removeDishCombo(mockRestaurantData, dish);
      expect(result)
        .toEqual(expect.objectContaining({ combo: [] }));
    });
  });
});
