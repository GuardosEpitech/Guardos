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
        expect(response.body).to.have.length(1); 
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
        expect(response.body).to.have.length(7); 
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
        expect(response.body).to.have.length(3); 
        response.body.forEach(restaurant => {
          const saladDishes = restaurant.dishes.filter(dish => dish.category.foodGroup.toLowerCase() === 'salad');
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
          const hasMilkAllergen = restaurant.dishes.some(dish => dish.allergens.includes('milk'));
          expect(hasMilkAllergen).to.be.false; 
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
        expect(response.body).to.have.length(1);
        const result: IRestaurantFrontEnd  = response.body[0];
        expect(result.name).to.eq('burgerme');
        expect(result.location.city.toLowerCase()).to.eq('berlin');
        const saladDishes = result.dishes.filter(dish => dish.category.foodGroup.toLowerCase() === 'salad');
        expect(saladDishes.length).to.be.greaterThan(0);
      });
    });
  });
  