import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

class APIClass {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL
        });

        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        })
    }

    async get(path: string, config?: AxiosRequestConfig) {
        return await this.client.get(path, config);
    }

    async delete(path: string, config?: AxiosRequestConfig) {
        return await this.client.delete(path, config);
    }

    async post(path: string, data?: unknown, config?: AxiosRequestConfig) {
        return await this.client.post(path, data, config);
    }

    async put(path: string, data?: unknown, config?: AxiosRequestConfig) {
        return await this.client.put(path, data, config);
    }

    async patch(path: string, data?: unknown, config?: AxiosRequestConfig) {
        return await this.client.patch(path, data, config);
    }
}

export const API = new APIClass(import.meta.env.VITE_API_URL);