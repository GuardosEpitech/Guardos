import axios from 'axios';
import geocodeAddress from '../../src/controllers/mapController';

jest.mock('axios');

describe('geocodeAddress', () => {
  const mockAddress = '1600 Amphitheatre Parkway, Mountain View, CA';
  const mockResponse = {
    data: {
      items: [
        {
          position: {
            lat: 37.4221,
            lng: -122.0841
          }
        }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the position when a valid address is provided', async () => {
    // Mock the axios response for a successful geocoding request
    (axios as jest.MockedFunction<typeof axios>)
      .mockResolvedValueOnce(mockResponse);

    const position = await geocodeAddress(mockAddress);
    expect(position)
      .toEqual({
        lat: 37.4221,
        lng: -122.0841
      });

    expect(axios)
      .toHaveBeenCalledTimes(1);
    expect(axios)
      .toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://geocode.search.hereapi.com/v1/geocode',
        params: {
          q: mockAddress,
          apiKey: process.env.MAP_API
        }
      });
  });

  it('should throw an error if the address is invalid or API fails', async () => {
    // Mock the axios response for a failed geocoding request
    (axios as jest.MockedFunction<typeof axios>)
      .mockRejectedValueOnce(new Error('Geocoding failed'));

    await expect(geocodeAddress('Invalid Address'))
      .rejects.toThrow('Geocoding failed');
    expect(axios)
      .toHaveBeenCalledTimes(1);
    expect(axios)
      .toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://geocode.search.hereapi.com/v1/geocode',
        params: {
          q: 'Invalid Address',
          apiKey: process.env.MAP_API
        }
      });
  });
});
