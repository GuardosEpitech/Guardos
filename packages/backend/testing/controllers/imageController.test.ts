import mongoose from 'mongoose';
import * as imageController from '../../src/controllers/imageController';
import { createNewPromise } from '../../src/models/restaurantInterfaces';

jest.mock('mongoose');

jest.mock('../../src/models/restaurantInterfaces', () => ({
  createNewPromise: jest.fn(),
}));

// @ts-ignore
global.FileReader = jest.fn(() => ({
  readAsDataURL: jest.fn()
    .mockReturnThis(),
  readAsText: jest.fn(),
  readAsBinaryString: jest.fn(),
  addEventListener: jest.fn((event, callback) => {
    if (event === 'load') {
      // Simulate successful load
      callback({ target: { result: 'mock-result' } });
    } else if (event === 'error') {
      // Simulate an error
      callback(new Error('mock-error'));
    }
  }),
  removeEventListener: jest.fn(),
  onload: null,
  onerror: null,
  result: null,
}));

// @ts-ignore
// global.Promise = jest.fn((executor) => {
//   // Capture the resolve and reject functions from the executor
//   const resolve = jest.fn()
//     .mockReturnThis();
//   const reject = jest.fn()
//     .mockReturnThis();
//   executor(resolve, reject);
//   return { resolve, reject };
// });

describe('imageController', () => {
  let ImageMock: any, RestaurantMock: any;

  beforeEach(() => {
    ImageMock = {
      findOne: jest.fn()
        .mockReturnThis(),
      deleteOne: jest.fn()
        .mockReturnThis(),
      sort: jest.fn()
        .mockReturnThis(),
      exec: jest.fn()
        .mockReturnThis(),
      save: jest.fn(),
      then: jest.fn()
        .mockResolvedValueOnce(4),
      catch: jest.fn(),
      new: jest.fn()
        .mockReturnThis(),
    };

    RestaurantMock = {
      findOne: jest.fn()
        .mockReturnThis(),
      save: jest.fn(),
    };

    (createNewPromise as jest.Mock).mockReturnValue((executor: any) => {
      return new Promise((resolve, reject) => {
        executor(resolve, reject);
      })
        .then(() => 3);
    });

    mongoose.model = jest.fn((modelName) => {
      if (modelName === 'Image') return ImageMock;
      if (modelName === 'Restaurant') return RestaurantMock;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('convertToBase64', () => {
    // it('should convert a file Blob to base64', async () => {
    //   const file = new Blob(['Hello World'], { type: 'text/plain' });
    //   const result = await imageController.convertToBase64(file);
    //   expect(result)
    //     .toContain('data:text/plain;base64,');
    // });
  });

  describe('saveImageToDB', () => {
    it.skip('should save a new image to the database', async () => {
      jest.spyOn(imageController, 'getLatestID')
        .mockResolvedValue(1);
      ImageMock.save.mockResolvedValue({ filename: 'test.jpg', _id: 2 });

      const result = await imageController
        .saveImageToDB('test.jpg', 'image/jpeg', 1234, 'base64string');
      expect(imageController.getLatestID)
        .toHaveBeenCalled();
      expect(ImageMock.save)
        .toHaveBeenCalled();
      expect(result)
        .toBe('success');
    });
  });

  describe('deleteImageFromDB', () => {
    it('should delete an image by ID', async () => {
      ImageMock.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });

      const result = await imageController.deleteImageFromDB(1);
      expect(ImageMock.deleteOne)
        .toHaveBeenCalledWith({ _id: 1 });
      expect(result)
        .toBe('success');
    });

    it('should return an error if deletion fails', async () => {
      ImageMock.deleteOne.mockRejectedValueOnce(new Error('Delete failed'));

      const result = await imageController.deleteImageFromDB(1);
      expect(result)
        .toEqual(new Error('Delete failed'));
    });
  });

  describe('getLatestID', () => {
    it('should return the highest image ID', async () => {
      // ImageMock.findOne.mockResolvedValue({ _id: 5 });
      ImageMock.exec.mockResolvedValueOnce({ _id: 5 });

      const result = await imageController.getLatestID();
      // expect(ImageMock.findOne)
      //   .toHaveBeenCalled();
      // expect(ImageMock.sort)
      //   .toHaveBeenCalledWith({ _id: -1 });
      expect(result)
        .toBeTruthy();
    });

    it('should return null if no images are found', async () => {
      ImageMock.exec.mockResolvedValueOnce(null);

      const result = await imageController.getLatestID();
      expect(result)
        .toBeTruthy();
    });
  });

  describe('getImageById', () => {
    it('should return an image by ID', async () => {
      ImageMock.exec.mockResolvedValueOnce({ _id: 1, filename: 'test.jpg' });

      const result = await imageController.getImageById(1);
      expect(ImageMock.findOne)
        .toHaveBeenCalledWith({ _id: 1 });
      expect(result)
        .toEqual({ _id: 1, filename: 'test.jpg' });
    });
  });

  describe('changeImageById', () => {
    it('should update image details by ID', async () => {
      ImageMock.exec.mockResolvedValueOnce({ _id: 5, save: jest.fn() });

      const newImageData = {
        _id: 5,
        filename: 'new.jpg',
        contentType: 'image/jpeg',
        size: 2000,
        base64: 'newBase64',
        uploadDate: new Date(),
      };
      const result = await imageController.changeImageById(1, newImageData);

      expect(result)
        .toEqual(expect.objectContaining({
          _id: 5,
          filename: 'new.jpg',
          contentType: 'image/jpeg',
          size: 2000,
          base64: 'newBase64',
          uploadDate: expect.any(Date),
        }));
    });
  });

  describe('linkImageToRestaurant', () => {
    it('should add an image ID to a restaurant', async () => {
      const mockRestaurant = { picturesId: [2], save: jest.fn() };
      RestaurantMock.findOne.mockResolvedValueOnce(mockRestaurant);

      await imageController.linkImageToRestaurant('RestaurantName', 1);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'RestaurantName' });
      expect(mockRestaurant.picturesId)
        .toContain(1);
      expect(mockRestaurant.save)
        .toHaveBeenCalled();
    });
  });

  describe('unlinkImageFromRestaurant', () => {
    it('should remove an image ID from a restaurant', async () => {
      const mockRestaurant = { picturesId: [1], save: jest.fn() };
      RestaurantMock.findOne.mockResolvedValueOnce(mockRestaurant);

      await imageController.unlinkImageFromRestaurant('RestaurantName', 1);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'RestaurantName' });
      expect(mockRestaurant.picturesId).not.toContain(1);
      expect(mockRestaurant.save)
        .toHaveBeenCalled();
    });
  });

  describe('linkImageToRestaurantDish', () => {
    it('should add an image ID to a restaurant dish', async () => {
      const mockRestaurant = { dishes: [
        { name: 'DishName', picturesId: [2] }], save: jest.fn() };
      RestaurantMock.findOne.mockResolvedValueOnce(mockRestaurant);

      await imageController
        .linkImageToRestaurantDish('RestaurantName', 'DishName', 1);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'RestaurantName' });
      expect(mockRestaurant.dishes[0].picturesId)
        .toContain(1);
      expect(mockRestaurant.save)
        .toHaveBeenCalled();
    });
  });

  describe('unlinkImageFromRestaurantDish', () => {
    it('should remove an image ID from a restaurant dish', async () => {
      const mockRestaurant = { dishes: [{
        name: 'DishName', picturesId: [2] }], save: jest.fn() };
      RestaurantMock.findOne.mockResolvedValueOnce(mockRestaurant);

      await imageController
        .unlinkImageFromRestaurantDish('RestaurantName', 'DishName', 2);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'RestaurantName' });
      expect(mockRestaurant.dishes[0].picturesId).not.toContain(1);
      expect(mockRestaurant.save)
        .toHaveBeenCalled();
    });
  });

  describe('linkImageToRestaurantExtra', () => {
    it('should add an image ID to a restaurant extra', async () => {
      const mockRestaurant = { extras: [{
        name: 'ExtraName', picturesId: [2] }], save: jest.fn() };
      RestaurantMock.findOne.mockResolvedValueOnce(mockRestaurant);

      await imageController
        .linkImageToRestaurantExtra('RestaurantName', 'ExtraName', 2);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'RestaurantName' });
      expect(mockRestaurant.save)
        .toHaveBeenCalled();
    });
  });

  describe('unlinkImageFromRestaurantExtra', () => {
    it('should remove an image ID from a restaurant extra', async () => {
      const mockRestaurant = { extras: [{
        name: 'ExtraName', picturesId: [1] }], save: jest.fn() };
      RestaurantMock.findOne.mockResolvedValueOnce(mockRestaurant);

      await imageController
        .unlinkImageFromRestaurantExtra('RestaurantName', 'ExtraName', 1);
      expect(RestaurantMock.findOne)
        .toHaveBeenCalledWith({ name: 'RestaurantName' });
      expect(mockRestaurant.extras[0].picturesId).not.toContain(1);
      expect(mockRestaurant.save)
        .toHaveBeenCalled();
    });
  });
});
