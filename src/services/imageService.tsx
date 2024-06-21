import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const fetchImages = async () => {
    const response = await axios.get(`${BASE_URL}/overview`);
    return response.data.images;
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const loadImageData = async (imageName: string) => {
    const response = await axios.get(`${BASE_URL}/load?imageName=${imageName}`);
    return {
        imageUrl: `${BASE_URL}/images/${imageName}`,
        boundingBoxes: response.data.boundingBoxes,
    };
};
