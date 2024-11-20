import mongoose from 'mongoose';
import * as restaurantController
  from '../../src/controllers/restaurantController';

jest.mock('mongoose');

describe('restaurantController', () => {
  const dish = {
    uid: 1,
    name: 'Dish A',
    description: 'Spicy dish',
    products: ['Product A'],
    pictures: ['pic2.jpg'],
    picturesId: [2],
    price: 15,
    allergens: ['gluten'],
    category: { menuGroup: 'Main', foodGroup: 'Main', extraGroup: ['x'] },
    discount: 0,
    validTill: '2022-01-01',
    combo: [1]
  };
  const sampleRestaurants = {
    uid: 1,
    name: 'Sample Resto',
    userID: 1,
    restoChainID: 10,
    description: 'A great place',
    rating: 4.5,
    ratingCount: 200,
    openingHours: [{ day: 1, open: '10:00', close: '22:00' }],
    pictures: ['pic1.jpg'],
    picturesId: [1],
    products: [{ ingredients: ['joghurt'],
      name: 'Burger', allergens: ['milk'] }],
    website: 'http://example.com',
    phoneNumber: '123456789',
    mealType: [{ id: 2, name: 'Lunch', sortId: 1 }],
    dishes: [ dish, ],
    location: {
      streetName: 'Fasanenstraße',
      streetNumber: '86',
      city: 'Berlin',
      postalCode: '10623',
      country: 'Germany',
      latitude: '',
      longitude: '',
    },
    extras: [dish],
    menuDesignID: 1
  };
  const RestaurantMock = {
    findOne: jest.fn()
      .mockResolvedValue(sampleRestaurants),
    find: jest.fn()
      .mockResolvedValue([sampleRestaurants]),
    create: jest.fn()
      .mockResolvedValue({
        name: 'New Restaurant',
        _id: 2,
        userID: 1,
        dishes: [],
        products: [],
        rating: 0,
        location: {}
      }),
    updateMany: jest.fn()
      .mockResolvedValue({ nModified: 1 }),
    deleteOne: jest.fn()
      .mockResolvedValue({ deletedCount: 1 }),
    findOneAndUpdate: jest.fn()
      .mockResolvedValue({
        name: 'Updated Restaurant',
        _id: 1,
        userID: 1,
        dishes: [],
        products: [],
        rating: 0,
        location: {}
      }),
    save: jest.fn(),
  };

  beforeEach(() => {
    mongoose.model = jest.fn()
      .mockReturnValue(RestaurantMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewRestaurant', () => {
    // it('should create a new restaurant', async () => {
    //   const newRestaurantData = {
    //     uid: 2,
    //     name: 'New Restaurant',
    //     phoneNumber: '+1000000000',
    //     website: 'www.newrestaurant.com',
    //     description: 'Great place',
    //     location: {
    //       streetName: 'Fasanenstraße',
    //       streetNumber: '86',
    //       city: 'Berlin',
    //       postalCode: '10623',
    //       country: 'Germany',
    //       latitude: '',
    //       longitude: '',
    //     },
    //     openingHours: [{ open: '9:00', close: '22:00', day: 0 }],
    //     menuDesignID: 1,
    //     userToken: 'token',
    //     restoChainID: 2,
    //   };
    //
    //   jest.spyOn(RestaurantMock, 'save')
    //     .mockImplementationOnce(() => Promise.resolve(newRestaurantData));
    //
    //   const createdRestaurant =
    //     await restaurantController.createNewRestaurant(newRestaurantData, 1, 2);
    //
    //   // expect(geocodeAddress)
    //   //   .toHaveBeenCalled();
    //   expect(RestaurantMock.create)
    //     .toHaveBeenCalledWith({
    //       _id: 2,
    //       ...newRestaurantData,
    //     });
    //   expect(createdRestaurant)
    //     .toEqual({
    //       name: 'New Restaurant',
    //       _id: 2,
    //       userID: 1,
    //       dishes: [],
    //       products: [],
    //       rating: 0,
    //       location: {}
    //     });
    // });
  });

  describe('getRestaurantByName', () => {
    it('should return a restaurant by name', async () => {
      const result =
        await restaurantController.getRestaurantByName('Test Restaurant');
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'Test Restaurant' });
      expect(result.name)
        .toEqual('Sample Resto');
    });

    it('should return null if restaurant not found', async () => {
      RestaurantMock.findOne.mockResolvedValueOnce(null);
      const result =
        await restaurantController
          .getRestaurantByName('Non Existent Restaurant');
      expect(result)
        .toBeNull();
    });
  });

  describe('getRestaurantByID', () => {
    it('should return a restaurant by id', async () => {
      await restaurantController.getRestaurantByID(1);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ _id: 1 });
    });
  });

  describe('getAllRestaurants', () => {
    it('should return all restaurants', async () => {
      const result = await restaurantController.getAllRestaurants();
      expect(RestaurantMock.find)
        .toHaveBeenCalled();
      expect(result[0].name)
        .toEqual('Sample Resto');
    });
  });

  describe('getAllUserRestaurants', () => {
    it('should return all user restaurants', async () => {
      const result = await restaurantController.getAllUserRestaurants(1);
      expect(RestaurantMock.find)
        .toHaveBeenCalled();
      expect(result[0].name)
        .toEqual('Sample Resto');
    });
  });

  describe('getAllUserRestaurantChains', () => {
    it('should return all user restaurants chains', async () => {
      await restaurantController.getAllUserRestaurantChains(1);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalled();
    });
  });

  describe('getAllRestosFromRestoChain', () => {
    it('should return all restaurants from a restaurant chain', async () => {
      const result = await restaurantController.getAllRestosFromRestoChain(1, 2);
      expect(RestaurantMock.find)
        .toHaveBeenCalled();
      expect(result[0].name)
        .toEqual('Sample Resto');
    });
  });

  describe('deleteRestoChainFromRestaurant', () => {
    it('should delete a restaurant chain from a restaurant', async () => {
      const result = await restaurantController.deleteRestoChainFromRestaurant(1, 2);
      expect(RestaurantMock.updateMany)
        .toHaveBeenCalledWith(
          { userID: 1, restoChainID: 2 },
          { $unset: { restoChainID: 1 } }
        );
      expect(result)
        .toEqual({nModified: 1});
    });
  });

  describe('deleteRestaurantByName', () => {
    it('should delete a restaurant by name', async () => {
      const result = await restaurantController
        .deleteRestaurantByName('Test Restaurant');
      expect(RestaurantMock.deleteOne)
        .toHaveBeenCalledWith({ name: 'Test Restaurant' });
      expect(result)
        .toBe('deleted Test Restaurant');
    });

    it('should return an error if no restaurant is deleted', async () => {
      RestaurantMock.deleteOne.mockResolvedValue({ deletedCount: 0 });
      const result = await restaurantController
        .deleteRestaurantByName('Non Existent Restaurant');
      expect(result)
        .toBe('deleted Non Existent Restaurant');
    });
  });

  describe('changeRestaurant', () => {
    it('should update a restaurant details', async () => {
      const updatedData = {
        ...sampleRestaurants,
        uid: 1,
        name: 'Updated Restaurant',
        description: 'Updated description',
        phoneNumber: '+1000000001',
        menuDesignID: 1,
        restoChainID: 2,
      };

      const result = await restaurantController
        .changeRestaurant({...updatedData, userToken: 'token'},
          'Test Restaurant');
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'Test Restaurant' });
      expect(result)
        .toEqual({
          ...sampleRestaurants,
          ...updatedData
        });
    });
  });

  describe('addRestoProduct', () => {
    it('should add a product to a restaurant', async () => {
      const product = {
        name: 'Product B',
        allergens: ['gluten'],
        ingredients: ['joghurt'],
      };

      RestaurantMock.findOneAndUpdate.mockResolvedValueOnce({
        ...sampleRestaurants,
        products: [product],
      });

      const updatedRestaurant = await restaurantController
        .addRestoProduct(product, 'Test Restaurant');

      expect(RestaurantMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { name: 'Test Restaurant' },
          { $push: { products: product } },
          { new: true }
        );
      expect(updatedRestaurant.products)
        .toContainEqual(product);
    });
  });

  describe('getAllUserRestaurantsFiltered', () => {
    it('should return user restaurants filtered by location or name',
      async () => {
        const locationOrName = 'Test City';
        const result = await restaurantController
          .getAllUserRestaurantsFiltered(1, locationOrName);
        expect(RestaurantMock.find)
          .toHaveBeenCalledWith({
            userID: 1,
            $or: [
              { name: { $regex: new RegExp(locationOrName, 'i') } },
              { 'location.streetName':
                  { $regex: new RegExp(locationOrName, 'i') } },
              { 'location.city': { $regex: new RegExp(locationOrName, 'i') } },
              { 'location.postalCode':
                  { $regex: new RegExp(locationOrName, 'i') } },
            ],
          });
        expect(result[0].name)
          .toEqual('Sample Resto');
        expect(result[0].location)
          .toEqual({
            streetName: 'Fasanenstraße',
            streetNumber: '86',
            city: 'Berlin',
            postalCode: '10623',
            country: 'Germany',
            latitude: 52.50855,
            longitude: 13.32883,
          });
      }
    );
  });

  describe('getAllRestoReviews', () => {
    it('should return all reviews for a restaurant', async () => {
      RestaurantMock.findOne.mockResolvedValueOnce({ 
        name: 'Test Restaurant',
        reviews: [{ userName: 'user1', comment: 'Great place', note: 5 }] 
      });
      const reviews = await restaurantController
        .getAllRestoReviews('Test Restaurant');
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'Test Restaurant' });
      expect(reviews)
        .toEqual([{ userName: 'user1', comment: 'Great place', note: 5 }]);
    });

    it('should return null if restaurant not found', async () => {
      RestaurantMock.findOne.mockResolvedValueOnce(null);
      const reviews = await restaurantController
        .getAllRestoReviews('Non Existent Restaurant');
      expect(reviews)
        .toBeNull();
    });
  });

  // Test for addRestoReview
  describe('addRestoReview', () => {
    it('should add a review to a restaurant', async () => {
      const review = { 
        _id: 'user1',
        comment: 'Excellent food!',
        note: 5,
        date: new Date()
      };
      const restoName = 'Test Restaurant';

      RestaurantMock.findOneAndUpdate.mockResolvedValueOnce({
        name: restoName,
        reviews: [review],
      });

      const updatedRestaurant = await restaurantController
        .addRestoReview(review, restoName);
      expect(RestaurantMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { name: restoName },
          { $push: { reviews: review } },
          { new: true }
        );
      expect(updatedRestaurant.reviews)
        .toContainEqual(review);
    });
  });

  // Test for getReviewByUserName
  describe('getReviewByUserName', () => {
    it('should return all reviews by a specific user', async () => {
      const userName = 'user1';
      RestaurantMock.find.mockResolvedValueOnce([
        { name: 'Test Restaurant', reviews: [
          { userName: 'user1', comment: 'Great!', note: 5 }
        ] },
      ]);

      const reviews = await restaurantController.getReviewByUserName(userName);
      expect(RestaurantMock.find)
        .toHaveBeenCalled();
      expect(reviews)
        .toEqual([
          { userName: 'user1',
            comment: 'Great!',
            note: 5,
            restoName: 'Test Restaurant',
            _id: expect.any(String),
            date: expect.any(Date)
          }
        ]);
    });
  });

  // Test for deleteRestoReview
  describe('deleteRestoReview', () => {
    it('should delete a review from a restaurant', async () => {
      const reviewId = '12345';
      const restoName = 'Test Restaurant';

      RestaurantMock.findOneAndUpdate.mockResolvedValueOnce({
        name: restoName,
        reviews: [],
      });

      const result = await restaurantController
        .deleteRestoReview(reviewId, restoName);
      expect(RestaurantMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { name: restoName },
          { $pull: { reviews: { _id: reviewId } } },
          { new: true }
        );
      expect(result.reviews)
        .toEqual([]);
    });
  });

  // Test for modifyRestoReview
  describe('modifyRestoReview', () => {
    it('should modify a review for a restaurant', async () => {
      const reviewId = '12345';
      const modifiedFields = { comment: 'Updated comment' };
      const restoName = 'Test Restaurant';

      RestaurantMock.findOneAndUpdate.mockResolvedValueOnce({
        name: restoName,
        reviews: [{
          _id: reviewId,
          userName: 'user1',
          comment: 'Updated comment',
          note: 5
        }],
      });

      const updatedRestaurant = await restaurantController
        .modifyRestoReview(reviewId, modifiedFields, restoName);
      expect(RestaurantMock.findOneAndUpdate)
        .toHaveBeenCalledWith(
          { name: restoName, 'reviews._id': reviewId },
          { $set: { 'reviews.$.comment': 'Updated comment' } },
          { new: true }
        );
      expect(updatedRestaurant.reviews[0].comment)
        .toBe('Updated comment');
    });
  });

  // Test for addCategory
  describe('addCategory', () => {
    it('should add new categories to a restaurant', async () => {
      const uid = 1;
      const newCategories: [{name: string, hitRate: number}] =
        [{ name: 'Vegan', hitRate: 5 }];

      RestaurantMock.findOne.mockResolvedValueOnce({
        ...sampleRestaurants,
        save: jest.fn()
          .mockResolvedValue(true)
      });

      const result = await restaurantController.addCategory(uid, newCategories);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ _id: uid });
      expect(result)
        .toHaveProperty('categories');
      expect(result.categories)
        .toEqual([{ dishes: [], name: 'Vegan', hitRate: 5 }]);
    });
  });

  describe('doesUserOwnRestaurantByName', () => {
    it('should return restaurant if user is the owner', async () => {
      const restoName = 'Sample Resto';
      const userID = 1;

      const restaurant = await restaurantController
        .doesUserOwnRestaurantByName(restoName, userID);
      expect(restaurant.name)
        .toEqual(restoName);
      expect(restaurant.userID)
        .toEqual(userID);
    });

    it('should return null if user is not the owner', async () => {
      const restoName = 'Test Restaurant';
      const userID = 2;

      const restaurant = await restaurantController
        .doesUserOwnRestaurantByName(restoName, userID);
      expect(restaurant)
        .toBeNull();
    });
  });
});
