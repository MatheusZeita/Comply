import axios, { AxiosError } from "axios";
import { store } from "@/store/store";
import { setToken, logout } from "@/store/features/authSlice";

export const setApiToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const reduxToken = store.getState().auth.token;

    if (reduxToken) {
      config.headers.Authorization = `Bearer ${reduxToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");

        const newToken = data.token;

        if (!newToken) {
          throw new Error("Novo token JWT não recebido do refresh");
        }

        store.dispatch(setToken(newToken));
        setApiToken(newToken);

        processQueue(null, newToken);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        store.dispatch(logout());
        setApiToken(null);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (isRefreshEndpoint && error.response?.status === 401) {
      store.dispatch(logout());
      setApiToken(null);
    }

    return Promise.reject(error);
  }
);

export default api;
