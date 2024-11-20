// import mongoose, {Model} from 'mongoose';
// import * as productsController from '../../src/controllers/productsController';
//
// const Product = mongoose.model('Product', new mongoose.Schema());
//
// jest.mock('mongoose', () => ({
//   model: jest.fn(() => {
//     return jest.fn()
//       .mockImplementation(() => ({
//         save: jest.fn()
//           .mockResolvedValue('Mocked product saved!'),
//       }));
//   }),
//   Schema: jest.fn(),
//   new: jest.fn(),
//   constructor: jest.fn(),
//   save: jest.fn(),
// }));
// // jest.mock('mongoose', () => ({
// //   model: jest.fn(() => return jest.fn().mockImplementation(() => ({
// //       save: jest.fn().mockResolvedValue('Mocked product saved!'),
// //     }));),
// //   Schema: jest.fn()
// //     .mockReturnThis(),
// // }));
//
// describe('productsController', () => {
//   const product = {
//     name: 'New Product',
//     allergens: ['milk'],
//     ingredients: ['joghurt']
//   };
//   const ProductMock: any = {
//     find: jest.fn()
//       .mockReturnThis(),
//     sort: jest.fn()
//       .mockReturnThis(),
//     limit: jest.fn()
//       .mockReturnValue([{_id: 100}]),
//     findOne: jest.fn(),
//     findOneAndUpdate: jest.fn(),
//     save: jest.fn(),
//     deleteOne: jest.fn(),
//     new: jest.fn()
//       .mockResolvedValue(product),
//     constructor: jest.fn()
//       .mockResolvedValue(product),
//   };
//   const RestaurantMock: any = {
//     findById: jest.fn()
//       .mockReturnValue({ userID: 1}),
//     findOneAndUpdate: jest.fn(),
//     find: jest.fn()
//       .mockReturnThis(),
//     sort: jest.fn()
//       .mockReturnThis(),
//     limit: jest.fn()
//       .mockReturnValue([{_id: 100}]),
//   };
//
//   beforeEach(() => {
//     // mongoose.model = jest.fn()
//     //   .mockReturnValueOnce(ProductMock)
//     //   .mockReturnValueOnce(RestaurantMock)
//     //   .mockReturnValueOnce(ProductMock);
//
//     mongoose.model = jest.fn((modelName) => {
//       if (modelName === 'Product') return ProductMock as Model<any>;
//       if (modelName === 'Restaurant') return RestaurantMock;
//     });
//
//     (Product as unknown as jest.Mock).mockImplementation(() => ProductMock);
//   });
//
//   afterEach(() => {
//     jest.clearAllMocks();
//     jest.resetAllMocks();
//   });
//
//   describe('getMaxProductId', () => {
//     it('should return the max product ID incremented by 1', async () => {
//
//       const result = await productsController.getMaxProductId();
//
//       expect(result)
//         .toBe(101);
//     });
//
//     it('should return -1 if no products are found', async () => {
//       ProductMock.limit.mockReturnValueOnce([]);
//
//       const result = await productsController.getMaxProductId();
//
//       expect(result)
//         .toBe(-1);
//     });
//
//     it('should return null if an error occurs', async () => {
//       ProductMock.find.mockRejectedValueOnce(new Error('Database error'));
//
//       const result = await productsController.getMaxProductId();
//
//       expect(result)
//         .toBeNull();
//     });
//   });
//
//   describe('createOrUpdateProduct', () => {
//     // it('should create a new product if it does not exist', async () => {
//     //   ProductMock.findOne.mockResolvedValueOnce(null);
//     //   RestaurantMock.findById.mockResolvedValueOnce({ userID: 1, products: [] });
//     //   // productsController.getMaxProductId = jest.fn()
//     //   //   .mockResolvedValue(101);
//     //   jest.spyOn(productsController, 'getMaxProductId')
//     //     .mockImplementation(() => Promise.resolve(101));
//     //
//     //   await productsController.createOrUpdateProduct(product, 1);
//     //
//     //   expect(ProductMock.save)
//     //     .toHaveBeenCalled();
//     // });
//     //
//     // it('should update the restaurant ID if the product exists but the restaurant ID is not included', async () => {
//     //   const existingProduct = {
//     //     name: 'Test Product',
//     //     restaurantId: [2],
//     //     save: jest.fn()
//     //   };
//     //   ProductMock.findOne.mockResolvedValueOnce(existingProduct);
//     //   RestaurantMock.findById.mockResolvedValueOnce({ userID: 1,});
//     //
//     //   await productsController.createOrUpdateProduct(product, 1);
//     //
//     //   expect(ProductMock.save)
//     //     .toHaveBeenCalled();
//     // });
//
//     it('should not create or update a product if the restaurant does not exist', async () => {
//       RestaurantMock.findById.mockReturnValueOnce(null);
//
//       await productsController.createOrUpdateProduct(product, 1);
//
//       expect(ProductMock.save).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('addProductsFromRestaurantToOwnDB', () => {
//     // it('should add products from a restaurant to the database if they do not exist', async () => {
//     //   RestaurantMock.findById.mockResolvedValueOnce({ userID: 1, products: [{
//     //     name: 'Test Product',
//     //     allergens: ['milk'],
//     //     ingredients: ['joghurt']
//     //   }] });
//     //   ProductMock.findOne.mockResolvedValueOnce(null);
//     //   // productsController.getMaxProductId = jest.fn()
//     //   //   .mockResolvedValue(101);
//     //
//     //   await productsController.addProductsFromRestaurantToOwnDB(1);
//     //
//     //   expect(ProductMock.save)
//     //     .toHaveBeenCalled();
//     // });
//     //
//     // it('should update existing products with the new restaurant ID if they already exist', async () => {
//     //   RestaurantMock.findById.mockReturnValueOnce({ userID: 1, products: [{
//     //     name: 'Test Product', allergens: ['milk'], ingredients: ['abc'] }] });
//     //   ProductMock.findOne.mockReturnValueOnce(
//     //     { name: 'Test Product', restaurantId: [2] });
//     //
//     //   await productsController.addProductsFromRestaurantToOwnDB(1);
//     //
//     //   expect(ProductMock.save)
//     //     .toHaveBeenCalled();
//     // });
//
//     it('should not add products if the restaurant is not found', async () => {
//       RestaurantMock.findById.mockReturnValueOnce(null);
//
//       await productsController.addProductsFromRestaurantToOwnDB(1);
//
//       expect(ProductMock.save).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('addProductsToDB', () => {
//     // it('should add a new product to the DB if it does not exist', async () => {
//     //   ProductMock.findOne.mockReturnValueOnce(null);
//     //   RestaurantMock.findById.mockReturnValueOnce({ userID: 1, });
//     //   // productsController.getMaxProductId = jest.fn()
//     //   //   .mockResolvedValue(101);
//     //
//     //   await productsController.addProductsToDB(1, product);
//     //
//     //   expect(ProductMock.save)
//     //     .toHaveBeenCalled();
//     // });
//
//     it('should not add the product if the restaurant is not found', async () => {
//       RestaurantMock.findById.mockReturnValueOnce(null);
//
//       await productsController.addProductsToDB(1, product);
//
//       expect(ProductMock.save).not.toHaveBeenCalled();
//     });
//   });
//
//   describe('getProductByName', () => {
//     it('should return a product if found by name', async () => {
//       ProductMock.findOne.mockReturnValueOnce({
//         name: 'Test Product', allergens: [], ingredients: [] });
//
//       const result = await productsController.getProductByName('Test Product');
//
//       expect(result)
//         .toEqual({ name: 'Test Product', allergens: [], ingredients: [] });
//     });
//
//     it('should return null if no product is found by name', async () => {
//       ProductMock.findOne.mockReturnValueOnce(null);
//
//       const result = await productsController
//         .getProductByName('NonExistent Product');
//
//       expect(result)
//         .toBeNull();
//     });
//   });
//
//   describe('getProductsByUser', () => {
//     it('should return products for a specific user', async () => {
//       ProductMock.find.mockReturnValueOnce([
//         { name: 'Test Product', userID: 1, allergens: [], ingredients: [] }]);
//
//       const result = await productsController.getProductsByUser(1);
//
//       expect(result)
//         .toEqual([{ name: 'Test Product',
//           userID: 1, allergens: [], ingredients: [] }]);
//     });
//   });
//
//   describe('getAllProducts', () => {
//     it('should return all products', async () => {
//       ProductMock.find.mockReturnValueOnce([
//         { name: 'Test Product', allergens: [], ingredients: [] }]);
//
//       const result = await productsController.getAllProducts();
//
//       expect(result)
//         .toEqual([{ name: 'Test Product', allergens: [], ingredients: [] }]);
//     });
//   });
//
//   describe('deleteProductByName', () => {
//     it('should delete a product if found', async () => {
//       ProductMock.findOne.mockReturnValueOnce({ name: 'Test Product' });
//
//       const result = await productsController
//         .deleteProductByName('Test Product');
//
//       expect(ProductMock.deleteOne)
//         .toHaveBeenCalledWith({ name: 'Test Product' });
//       expect(result)
//         .toBe(true);
//     });
//
//     it('should return false if the product is not found', async () => {
//       ProductMock.findOne.mockReturnValueOnce(null);
//
//       const result = await productsController
//         .deleteProductByName('NonExistent Product');
//
//       expect(result)
//         .toBe(false);
//     });
//   });
//
//   describe('updateProduct', () => {
//     it('should update a product by its old name', async () => {
//       const updatedProduct = {
//         name: 'Updated Product',
//         userID: 1,
//         id: 1,
//         allergens: ['milk'],
//         ingredients: ['joghurt'],
//         restaurantId: [1],
//       };
//       ProductMock.findOneAndUpdate.mockReturnValueOnce(updatedProduct);
//
//       const result = await productsController
//         .updateProduct(updatedProduct, 'Old Product');
//
//       expect(ProductMock.findOneAndUpdate)
//         .toHaveBeenCalledWith(
//           { name: 'Old Product' },
//           updatedProduct,
//           { new: true }
//         );
//       expect(result)
//         .toEqual(updatedProduct);
//     });
//   });
//
//   describe('changeProductByName', () => {
//     it('should update a product if the name is changed', async () => {
//       const updatedProduct = {
//         name: 'Updated Product',
//         userID: 1,
//         id: 1,
//         allergens: ['milk'],
//         ingredients: ['joghurt'],
//         restaurantId: [1],
//       };
//       ProductMock.findOne.mockReturnValueOnce(updatedProduct);
//       RestaurantMock.findOneAndUpdate.mockReturnValueOnce(updatedProduct);
//
//       const result = await productsController
//         .changeProductByName(updatedProduct, 'Old Product');
//
//       expect(result)
//         .toEqual(updatedProduct);
//     });
//   });
// });
