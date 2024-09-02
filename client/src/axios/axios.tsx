
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create an Axios instance with a specified base URL
export const client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
});


export const config: AxiosRequestConfig = {
    headers: {
        'Accept': 'application/json',
    },
};
