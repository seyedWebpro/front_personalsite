import axios from "axios";

import { resolveClientLocale } from "@/i18n/translate";
import { siteConfig } from "@/config/site";

/** Absolute API origin for SSR / public media. Browser client uses same-origin `/api`. */
export const BASE_URL = siteConfig.apiOrigin;

const apiClient = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function clearJsonContentTypeForFormData(
  config: { data?: unknown; headers?: Record<string, unknown> },
): void {
  if (typeof FormData === "undefined" || !(config.data instanceof FormData) || !config.headers) {
    return;
  }
  delete config.headers["Content-Type"];
  delete config.headers["content-type"];
}

apiClient.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers["Accept-Language"] = resolveClientLocale();
  }
  clearJsonContentTypeForFormData(config);
  return config;
});

export default apiClient;

export const http = {
  get: <T>(url: string, config = {}) => apiClient.get<T>(url, config),
  post: <T>(url: string, data: unknown, config = {}) =>
    apiClient.post<T>(url, data, config),
  put: <T>(url: string, data: unknown, config = {}) =>
    apiClient.put<T>(url, data, config),
  patch: <T>(url: string, data: unknown, config = {}) =>
    apiClient.patch<T>(url, data, config),
  delete: <T>(url: string, config = {}) => apiClient.delete<T>(url, config),
};
