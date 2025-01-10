import axios from 'axios';

const baseUrl = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/filter/`;
const selectedURL = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/filter/filteredlist`;
const newURL = `${process.env.DB_HOST}${process.env.DB_HOST_PORT}/api/filter/newFilter`;

export const getFilteredRestos = async (body: any) => {
    try {
        const response = await axios({
            method: 'POST',
            url: baseUrl,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error in getFilteredRestos: ${error}`);
        return null;
    }
}

export const getSelectedFilteredRestos = async (body: any) => {
    try {
        const response = await axios({
            method: 'POST',
            url: selectedURL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error in getFilteredRestos: ${error}`);
        return null;
    }
}

export const getNewFilteredRestos = async (body: any) => {
    try {
        const response = await axios({
            method: 'POST',
            url: newURL,
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error in getnewFilteredRestos: ${error}`);
        return null;
    }
}
