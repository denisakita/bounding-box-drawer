import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const fetchBoundingBoxes = async (imageName: string) => {
    const response = await axios.get(`${BASE_URL}/load`, {params: {imageName}});
    return response.data.boundingBoxes;
};

export const saveBoundingBoxes = async (imageName: string, boundingBoxes: {
    id: number,
    x: number,
    y: number,
    width: number,
    height: number
}[]) => {
    await axios.post(`${BASE_URL}/save`, {imageName, boundingBoxes});
};
