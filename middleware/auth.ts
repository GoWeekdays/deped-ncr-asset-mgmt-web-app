export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return
  const accessToken = useCookie("accessToken").value;

  function returnToLogin() {
    useRouter().push({ name: "index" });
  }

  if (!accessToken) {
    returnToLogin();
    return;
  }
  const { getCurrentUser } = useLocalAuth();
  try {
    await getCurrentUser();
  } catch (error) {
    returnToLogin();
  }
})
