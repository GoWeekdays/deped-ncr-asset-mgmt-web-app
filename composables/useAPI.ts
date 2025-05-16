import type { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";

export function useAPI<T>(url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig();
  const cookieOptions = config.app.cookieConfig || {};

  const defaults: UseFetchOptions<T> = {
    baseURL: "/",
    key: url,
    server: false,
    retry: 1,
    retryStatusCodes: [401],
    retryDelay: 500, // can safely delete this

    onRequest({ options }) {
      const accessToken = useCookie("accessToken", cookieOptions).value;
      options.headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        await useFetch("/api/auth/refresh", {
          baseURL: "/",
          method: "POST",
          server: false,
          credentials: "include",
          body: JSON.stringify({
            refreshToken: useCookie("refreshToken", cookieOptions).value,
          }),

          onResponse({ response }) {
            useCookie("accessToken", cookieOptions).value = response._data;
          },
        });
      }
    },
  };

  const params = defu(options, defaults);

  return useFetch(url, params);
}
