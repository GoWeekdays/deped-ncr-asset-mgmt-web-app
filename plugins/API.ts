export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const cookieOptions = config.public.cookieConfig;

  const api = $fetch.create({
    baseURL: "/",
    retry: 1,
    retryStatusCodes: [401],
    retryDelay: 500,
    onRequest({ options }) {
      const accessToken = useCookie("accessToken").value;
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
          body: JSON.stringify({ token: useCookie("refreshToken").value }),

          onResponse({ response }) {
            useCookie("accessToken", cookieOptions).value =
              response._data.token;
          },
        });
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
