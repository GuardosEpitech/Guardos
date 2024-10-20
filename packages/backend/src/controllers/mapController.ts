import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function geocodeAddress(address: string) {
  try {
    const result = await axios({
      method: 'GET',
      url: 'https://geocode.search.hereapi.com/v1/geocode',
      params: {
        q: address,
        apiKey: process.env.MAP_API
      }
    });

    if (result.data.items) {
      return result.data.items[0].position;
    }
    return {
      lat: '0',
      lng: '0'
    };
  }
  catch (error) {
    return {
      lat: '0',
      lng: '0'
    };
  }
}
