import { 
    IRestaurantBackEnd, 
    IRestaurantFrontEnd 
} from "../../../shared/models/restaurantInterfaces";
import { ISearchCommunication } from "../models/communicationInterfaces";
import { readAndGetAllRestaurants }
  from '../controllers/connectDataBase';
import { IDishFE, IDishBE } from "../../../shared/models/dishInterfaces";
import { ICategories } from "../../../shared/models/categoryInterfaces";

export async function newfilterRestaurants
(searchParams: ISearchCommunication): Promise<IRestaurantFrontEnd[]> {
    
    let data: any = await readAndGetAllRestaurants(); 
    
    const restoData: IRestaurantBackEnd[] = transformToIRestaurantBackend(data);

    let filteredRestaurants: IRestaurantBackEnd[] = restoData;

    if (searchParams.name)
        filteredRestaurants = filteredRestaurants
            .filter(restaurant => restaurant.name?.toLowerCase()
                .includes(searchParams.name?.toLowerCase()));


    // do range here

    if (searchParams.rating && searchParams.rating.length === 2)
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const [minRating, maxRating] = searchParams.rating;
            return restaurant.rating >= minRating && restaurant.rating <= maxRating;
        });

    if (searchParams.location)
        filteredRestaurants = filteredRestaurants
            .filter(restaurant => restaurant.location?.city?.toLowerCase() 
            === searchParams.location?.toLowerCase());

    if (searchParams.categories && searchParams.categories.length > 0)
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const restaurantCategories = restaurant.dishes?.map
                (dish => dish.category.foodGroup?.toLowerCase()) ?? [];
            return searchParams.categories.every(category => 
                restaurantCategories.includes(category.toLowerCase()));
        });

    if (searchParams.allergenList && searchParams.allergenList.length > 0)
        filteredRestaurants = filteredRestaurants.filter(restaurant => {
            const hasAllergen = (dish: any) => 
                dish.allergens?.some((allergen: string) => 
                searchParams.allergenList?.includes(allergen.toLowerCase())) ?? 
                false;
            return !restaurant.dishes?.some(hasAllergen);
        });
    
    
    
    const result: IRestaurantFrontEnd[] = 
        transformToIRestaurantFrontend(filteredRestaurants);

    return result;
}

function transformToIRestaurantBackend(data: any): IRestaurantBackEnd[] {
    const results: IRestaurantBackEnd[] = [];

    for (const elem of data) {
        const obj = createBackEndObj(elem);
        results.push(obj);
    }
    
    for (const elem of results) {
        elem.mealType.sort((a, b) => (a.sortId > b.sortId) ? 1 : -1);
    }

    return results;
}

function createBackEndObj(restaurant: IRestaurantBackEnd): IRestaurantBackEnd {
    const restaurantBE: IRestaurantBackEnd = {
        uid: restaurant.uid,
        userID: restaurant.userID,
        name: restaurant.name,
        phoneNumber: restaurant.phoneNumber,
        website: restaurant.website,
        rating: restaurant.rating,
        ratingCount: restaurant.ratingCount,
        description: restaurant.description,
        pictures: restaurant.pictures,
        picturesId: restaurant.picturesId,
        openingHours: restaurant.openingHours,
        dishes: [],
        location: restaurant.location,
        mealType: restaurant.mealType,
        extras: [],
        products: restaurant.products
    };

    let dishId = 0;
    for (const dish of restaurant.dishes) {
        const dishObj: IDishBE = {
            uid: dishId,
            name: dish.name,
            description: dish.description,
            products: dish.products,
            pictures: dish.pictures,
            picturesId: dish.picturesId,
            price: dish.price,
            allergens: dish.allergens,
            category: dish.category,
        };
        restaurantBE.dishes.push(dishObj);
        dishId++;
    }

    let extraId = 0;
    for (const extra of restaurant.extras) {
        const extraObj: IDishBE = {
            uid: extraId,
            name: extra.name,
            description: extra.description,
            products: extra.products,
            price: extra.price,
            pictures: extra.pictures,
            allergens: extra.allergens,
            category: extra.category,
        };
        restaurantBE.extras.push(extraObj);
        extraId++;
    }
    
    return restaurantBE;
}

function createRestaurantObjFe(restaurant: IRestaurantBackEnd): IRestaurantFrontEnd {
    const obj: IRestaurantFrontEnd = {
        name: restaurant.name,
        website: restaurant.website,
        userID: restaurant.userID,
        description: restaurant.description,
        rating: restaurant.rating,
        ratingCount: restaurant.ratingCount,
        pictures: restaurant.pictures,
        picturesId: restaurant.picturesId,
        openingHours: restaurant.openingHours,
        products: restaurant.products,
        uid: restaurant.uid,
        phoneNumber: restaurant.phoneNumber,
        categories: [],
        location: restaurant.location,
        range: 0,
        dishes: []
    };
    for (const mealType of restaurant.mealType) {
        const category: ICategories = {
            name: mealType.name,
            hitRate: 100,
            dishes: []
        };
        for (const dish of restaurant.dishes) {
            if (dish.category.menuGroup === mealType.name) {
                const dishObj: IDishFE = {
                    uid: dish.uid,
                    name: dish.name,
                    description: dish.description,
                    price: dish.price,
                    pictures: dish.pictures,
                    picturesId: dish.picturesId,
                    allergens: dish.allergens,
                    category: dish.category,
                    resto: restaurant.name,
                    products: dish.products
                };
                obj.dishes.push(dishObj);
                category.dishes.push(dishObj);
            }
        }
        obj.categories.push(category);
    }
    
    return obj;
}

function transformToIRestaurantFrontend(data: IRestaurantBackEnd[]): IRestaurantFrontEnd[] {
    const results: IRestaurantFrontEnd[] = data.map(restaurant => createRestaurantObjFe(restaurant));
    return results;
}
