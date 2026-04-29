import { routes } from "@/constants/api-routes";
import { Filters } from "@/types/ApiTypes";
import axios from "axios";
import qs from "qs";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: "repeat" })
  },
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
  
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(routes.auth.refresh)
    ) {
      originalRequest._retry = true;

      try {
        await api.post(routes.auth.refresh);
        return api(originalRequest);
      } catch(error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

function buildParams(filters: Filters) {
  return {
    ...filters,
    sort: filters.sort?.map(s => `${s.field},${s.direction}`)
  };
}