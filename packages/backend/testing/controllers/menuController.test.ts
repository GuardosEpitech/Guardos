import { getMenuByRestoID } from '../../src/controllers/menuController';
import { getRestaurantByID } from '../../src/controllers/restaurantController';
import { getProductByName } from '../../src/controllers/productsController';
import {IRestaurantFrontEnd} from '../../../shared/models/restaurantInterfaces';
import {IProductBE} from '../../../shared/models/productInterfaces';

// Mocking dependent functions
jest.mock('../../src/controllers/restaurantController', () => ({
  getRestaurantByID: jest.fn(),
}));
jest.mock('../../src/controllers/productsController');

describe('Menu Controller Tests', () => {
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
          {
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
          },
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
      {
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
      },
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

  const mockProductData = {
    name: 'Wrapper',
    userID: 1,
    id: 1,
    allergens: ['Gluten'],
    ingredients: ['Wheat', 'Salt'],
    restaurantId: [1],
  };

  const mockProductDataWithoutAllergens: IProductBE = {
    name: 'Vegetables',
    userID: 1,
    id: 2,
    allergens: [],
    ingredients: ['Carrot', 'Cabbage'],
    restaurantId: [2],
  };

  beforeEach(() => {
    // Setting up mock implementations for getRestaurantByID and getProductByName
    (getRestaurantByID as jest.MockedFunction<typeof getRestaurantByID>)
      .mockResolvedValue(mockRestaurantData);
    (getProductByName as jest.MockedFunction<typeof getProductByName>)
      .mockResolvedValueOnce(mockProductData);
    (getProductByName as jest.MockedFunction<typeof getProductByName>)
      .mockResolvedValueOnce(mockProductDataWithoutAllergens);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMenuByRestoID', () => {
    it('should return the full menu when there are no allergen or disliked ingredient restrictions', async () => {
      const menu = await getMenuByRestoID(1, [], []);
      expect(menu)
        .toEqual(mockRestaurantData.categories);

      menu.forEach(category => {
        category.dishes.forEach(dish => {
          expect(dish.fitsPreference)
            .toBe(true);
        });
      });
    });

    it('should mark dishes with allergens as not fitting preference', async () => {
      const menu = await getMenuByRestoID(1, ['Nuts'], []);
      expect(menu[0].dishes[1].fitsPreference)
        .toBe(false); // Salad has nuts
      expect(menu[1].dishes[0].fitsPreference)
        .toBe(true); // Pasta has no allergens
    });

    it('should mark dishes with disliked ingredients as not fitting preference', async () => {
      const menu = await getMenuByRestoID(1, [], ['Wheat']);
      expect(menu[0].dishes[0].fitsPreference)
        .toBe(false); // Spring Rolls have Wrapper with Wheat
      expect(menu[1].dishes[0].fitsPreference)
        .toBe(true); // Pasta does not contain disliked ingredients
    });

    it('should handle both allergen and disliked ingredient filters', async () => {
      const menu = await getMenuByRestoID(1, ['Nuts'], ['Wheat']);
      expect(menu[0].dishes[0].fitsPreference)
        .toBe(false); // Spring Rolls contain Wheat in Wrapper
      expect(menu[0].dishes[1].fitsPreference)
        .toBe(false); // Salad has Nuts
      expect(menu[1].dishes[0].fitsPreference)
        .toBe(true); // Pasta fits preferences
    });

    it('should skip unavailable products and not throw errors', async () => {
      (getProductByName as jest.MockedFunction<typeof getProductByName>)
        .mockResolvedValueOnce(null); // Simulate missing product

      const menu = await getMenuByRestoID(1, [], ['Wheat']);
      expect(menu)
        .toBeTruthy();
      expect(menu[0].dishes[1].fitsPreference)
        .toBe(true); // Spring Rolls without matching product still processed
    });

    it('should return empty categories if restaurant does not exist', async () => {
      (getRestaurantByID as jest.MockedFunction<typeof getRestaurantByID>)
        .mockResolvedValueOnce(null);

      const menu = await getMenuByRestoID(99, [], []);
      expect(menu)
        .toBeNull();
    });

  });
});
