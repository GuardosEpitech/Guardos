import Filter from '../../src/controllers/restaurantFilterController';
import * as dbModule from '../../src/controllers/connectDataBase';
import {IRestaurantBackEnd} from '../../../shared/models/restaurantInterfaces';

const readAndGetAllRestaurants = jest
  .spyOn(dbModule, 'readAndGetAllRestaurants');

describe('Filter Controller', () => {
  let filter: Filter;
  let sampleRestaurants: IRestaurantBackEnd[];

  beforeEach(() => {
    // Mocking the restaurant data
    sampleRestaurants = [
      {
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
        products: [{ ingredients: [], name: 'Burger', allergens: [] }],
        website: 'http://example.com',
        phoneNumber: '123456789',
        mealType: [{ id: 2, name: 'Lunch', sortId: 1 }],
        dishes: [
          {
            uid: 1,
            name: 'Dish A',
            description: 'Spicy dish',
            products: ['Product A'],
            pictures: ['pic2.jpg'],
            picturesId: [2],
            price: 15,
            allergens: ['gluten'],
            category: { menuGroup: 'Main', foodGroup: 'Main', extraGroup: [] },
            discount: 0,
            validTill: '2022-01-01',
            combo: [1]
          }
        ],
        location: {
          streetName: 'Sample Street',
          streetNumber: '123',
          postalCode: '12345',
          country: 'Sample Country',
          city: 'Sample City',
          latitude: '123',
          longitude: '123',
        },
        extras: [],
        menuDesignID: 1
      }
    ];
    readAndGetAllRestaurants.mockReset();
    readAndGetAllRestaurants.mockResolvedValue(sampleRestaurants);
    filter = new Filter();
  });

  it('should instantiate and load all restaurants', async () => {
    const restaurants = await filter.getRestaurants();
    expect(restaurants.length)
      .toBe(1);
    expect(restaurants[0].name)
      .toBe('Sample Resto');
  });

  describe('filterForRestaurantsWithAllergens', () => {
    it('should filter restaurants based on allergens', async () => {
      const filteredRestaurants =
        await filter.filterForRestaurantsWithAllergens(['peanuts']);
      expect(filteredRestaurants.length)
        .toBe(1);
      expect(filteredRestaurants[0].hitRate)
        .toBeGreaterThan(0);
    });

    it('should return 0 hitRate for no matching allergens', async () => {
      const filteredRestaurants =
        await filter.filterForRestaurantsWithAllergens(['gluten']);
      expect(filteredRestaurants[0].hitRate)
        .toBe(0);
    });
  });

  describe('filterForRestaurantWithNameOrGroup', () => {
    it('should filter by restaurant name', async () => {
      const results =
        await filter.filterForRestaurantWithNameOrGroup(['Sample']);
      expect(results[0].hitRate)
        .toBe(100);
      expect(results[0].name)
        .toBe('Sample Resto');
    });

    it('should filter by dish name and food group', async () => {
      const results =
        await filter.filterForRestaurantWithNameOrGroup(['Dish A']);
      expect(results[0].hitRate)
        .toBeGreaterThan(0);
    });
  });

  describe('filterForRestaurantWithRating', () => {
    it('should filter by restaurant rating within a range', async () => {
      const results = await filter.filterForRestaurantWithRating([4, 5]);
      expect(results.length)
        .toBeGreaterThan(0);
      expect(results[0].rating)
        .toBe(4.5);
      expect(results[0].hitRate)
        .toBe(100);
    });

    it('should return 0 hitRate if rating does not match range', async () => {
      const results = await filter.filterForRestaurantWithRating([2, 3]);
      expect(results[0].hitRate)
        .toBe(0);
    });
  });

  describe('filterForRestaurantWithCategory', () => {
    it('should filter by category', async () => {
      const results = await filter.filterForRestaurantWithCategory(['Main']);
      expect(results[0].hitRate)
        .toBeGreaterThan(0);
    });

    it('should return 0 hitRate if category does not match', async () => {
      const results = await filter.filterForRestaurantWithCategory(['Dessert']);
      expect(results[0].hitRate)
        .toBe(0);
    });
  });

  describe('filterForRestaurantWithLocation', () => {
    it('should filter by location', async () => {
      const results =
        await filter.filterForRestaurantWithLocation('Sample City');
      expect(results[0].hitRate)
        .toBe(100);
    });

    it('should return 0 hitRate if location does not match', async () => {
      const results =
        await filter.filterForRestaurantWithLocation('Nonexistent City');
      expect(results[0].hitRate)
        .toBe(0);
    });
  });

  describe('createRestaurantObjFe', () => {
    it('should create a restaurant object for frontend with a hit rate', () => {
      const hitRate = 80;
      const objFe = filter.createRestaurantObjFe(sampleRestaurants[0], hitRate);
      expect(objFe.hitRate)
        .toBe(hitRate);
      expect(objFe.name)
        .toBe('Sample Resto');
    });
  });

  describe('returnDefaultQuery', () => {
    it('should return all restaurants with a default hit rate', async () => {
      const results = await filter.returnDefaultQuery();
      expect(results.length)
        .toBe(1);
      expect(results[0].hitRate)
        .toBe(100);
    });
  });
});
