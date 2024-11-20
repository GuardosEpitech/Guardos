import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDataBase, readAndGetAllRestaurants, SUCCEED }
  from '../../src/controllers/connectDataBase';
import { restaurantSchema } from '../../src/models/restaurantInterfaces';

// Mock dotenv to load environment variables
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

// Mock mongoose and its functions
jest.mock('mongoose', () => ({
  connect: jest.fn()
    .mockReturnThis(),
  connection: {
    once: jest.fn((event, callback) => {
      if (event === 'open') callback();
    }),
  },
  model: jest.fn()
    .mockReturnValue({ find: jest.fn()
      .mockReturnValue([
        { name: 'Restaurant A' },
        { name: 'Restaurant B' },
      ])}),
  set: jest.fn(),
  Schema: jest.fn()
    .mockReturnThis(),
}));

jest.mock('../../src/models/restaurantInterfaces');

describe('Database Connection', () => {
  beforeEach(() => {
    // Set up environment variables for testing
    process.env.dbUser = 'testUser';
    process.env.dbPassword = 'testPassword';
    process.env.dbCluster = 'testCluster';
    process.env.dbName = 'testDb';
    jest.clearAllMocks();
  });

  describe('connectDataBase', () => {
    it('should succeed in connecting to the database', async () => {
      (mongoose.connect as jest.Mock).mockResolvedValueOnce({open: jest.fn()});

      const result = await connectDataBase();

      expect(dotenv.config)
        .toHaveBeenCalled();
      expect(mongoose.set)
        .toHaveBeenCalledWith('strictQuery', false);
      expect(mongoose.connect)
        .toHaveBeenCalledWith(
          'mongodb+srv://testUser:testPassword@testCluster/testDb?retryWrites=true&w=majority',
          { useNewUrlParser: true, useUnifiedTopology: true }
        );
      expect(mongoose.connection.once)
        .toHaveBeenCalledWith('open', expect.any(Function));
      expect(result)
        .toBe(SUCCEED);
    });
  });

  describe('readAndGetAllRestaurants', () => {
    let findMock: any;

    beforeAll(() => {
      findMock = jest.fn()
        .mockReturnValue({ exec: jest.fn() });
      const mockRestaurantModel = {
        find: findMock,
      };
      (mongoose.connect as jest.Mock)
        .mockReturnValueOnce(mockRestaurantModel);
    });

    it('should retrieve all restaurants successfully', async () => {
      const mockRestaurants = [
        { name: 'Restaurant A' },
        { name: 'Restaurant B' },
      ];
      findMock.mockResolvedValueOnce(mockRestaurants);

      const result = await readAndGetAllRestaurants();

      expect(mongoose.model)
        .toHaveBeenCalledWith('Restaurants', restaurantSchema);
      expect(result)
        .toEqual(mockRestaurants);
    });
  });
});
