import { IRestaurantFrontEnd } from '../../../shared/models/restaurantInterfaces';

const urlAPI = 'http://localhost:8081/api/filter/newFilter';


describe('newfilterRestaurants function', () => {
    it('returns correct objects when searchParams.name = burgerme', () => {
      cy.request({
        method: 'POST', 
        url: urlAPI, 
        body: { 
            name: 'burgerme' 
        }
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body[0].name).to.eq('burgerme'); 
      });
    });
  
    it('returns correct objects when searchParams.location = Berlin', () => {
      cy.request({
        method: 'POST', 
        url: urlAPI, 
        body: { 
            location: 'Berlin' 
        }
      }).then(response => {
        expect(response.status).to.eq(200);
        response.body.forEach(restaurant => {
          expect(restaurant.location.city.toLowerCase()).to.eq('berlin');
        });
      });
    });
  
    it('returns correct objects when searchParams.category = salad', () => {
      cy.request({
        method: 'POST', 
        url: urlAPI, 
        body: { 
            categories: ['salad'] 
        }
      }).then(response => {
        expect(response.status).to.eq(200);
        response.body.forEach(restaurant => {
          const saladDishes = restaurant.dishes.filter(dish => dish.category?.foodGroup?.toLowerCase() === 'salad');
          expect(saladDishes.length).to.be.greaterThan(0);
        });
      });
    });
  
    it('returns correct objects when searchParams.allergens = milk', () => {
      cy.request({
        method: 'POST', 
        url: urlAPI, 
        body: { 
            allergenList: ['milk'] 
        }
      }).then(response => {
        expect(response.status).to.eq(200);
        response.body.forEach(restaurant => {
          const totalDishes = restaurant.dishes?.length || 1;
          const dishesWithoutAllergen = restaurant.dishes?.filter(dish => 
            !dish.allergens?.some(allergen => ['milk'].includes(allergen.toLowerCase()))) || [];
            const percentageWithoutAllergen = (dishesWithoutAllergen.length / totalDishes) * 100;
          expect(percentageWithoutAllergen).to.be.greaterThan(49); 
        });
      });
    });
  
    it('returns correct objects when searchParams.name = burgerme, searchParams.location = Berlin, searchParams.category = salad', () => {
      cy.request({
        method: 'POST', 
        url: urlAPI, 
        body: { 
            name: 'burgerme', 
            location: 'Berlin', 
            categories: ['salad'] 
        }
      }).then(response => {
        expect(response.status).to.eq(200);
        response.body.forEach(restaurant => {
          expect(restaurant.name.toLowerCase()).to.eq('burgerme');
          expect(restaurant.location.city.toLowerCase()).to.eq('berlin');
          const saladDishes = restaurant.dishes.filter(dish => dish.category?.foodGroup?.toLowerCase() === 'salad');
          expect(saladDishes.length).to.be.greaterThan(0);
        });
      });
    });
  });
  