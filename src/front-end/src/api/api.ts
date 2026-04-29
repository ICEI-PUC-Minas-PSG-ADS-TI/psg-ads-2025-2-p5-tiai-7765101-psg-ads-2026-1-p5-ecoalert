import { routes } from "@/constants/api-routes";
import { Filters } from "@/types/ApiTypes";
import { clearAuthSession, getAccessToken, persistAuthSession } from "@/utils/auth";
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
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  if (config.params) {
    config.params = buildParams(config.params);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    const status = error.response?.status;

    if (
      (status === 401 || status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(routes.auth.refresh)
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await api.post(routes.auth.refresh);
        const newToken = refreshResponse.data?.token;

        if (newToken) {
          persistAuthSession(newToken);
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
        }

        return api(originalRequest);
      } catch(error) {
        clearAuthSession();
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