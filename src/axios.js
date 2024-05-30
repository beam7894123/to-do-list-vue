import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,  // This should read the VITE_API_BASE_URL from the .env file
});

export const setBaseURL = (url) => {
    apiClient.defaults.baseURL = url;
};

// console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);  // Debug: Check if the URL is loaded

export default apiClient;
