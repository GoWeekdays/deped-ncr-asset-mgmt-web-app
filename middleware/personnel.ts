export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const accessToken = useCookie("accessToken").value;

  function redirectToAllowedPage() {
    return navigateTo({ name: "requisition-and-issue-slips" });
  }

  // Redirect to login if no access token is found
  if (!accessToken) {
    return navigateTo({ name: "index" });
  }

  const { getCurrentUser } = useLocalAuth();
  const { isPersonnel, isOfficeChief, isAdmin, isAdminHead } = useUtils();

  try {
    await getCurrentUser();

    // Redirect if the user doesn't meet required roles
    if (
      !isAdmin.value &&
      !!isPersonnel.value &&
      !!isOfficeChief.value &&
      !isAdminHead.value
    ) {
      return redirectToAllowedPage();
    }

    if (isPersonnel.value || isOfficeChief.value) {
      const accessibleRoutes = [
        "requisition-and-issue-slips",
        "requisition-and-issue-slips-add-request",
        "requisition-and-issue-slips-preview-id",
        "requisition-and-issue-slips-evaluating-id",
        "requisition-and-issue-slips-issued-id",
        "ics-par-issueslip-issueslip",
        "ics-par-issueslip-issueslip-view-card",
        "ics-par-issueslip-issueslip-issued-card",
        "waste-and-losses-losses",
        "waste-and-losses-losses-create",
        "waste-and-losses-losses-view-id",
        "maintenance",
        "maintenance-view-id",
        "maintenance-complete-id",
        "office-personnel-records-personnel-stock-card-view-id",
        "help",
        "profile",
      ];

      const lossesParam = Array.isArray(to.params.losses)
        ? to.params.losses[0]
        : to.params.losses;
      const pathParam = Array.isArray(to.params.path)
        ? to.params.path[0]
        : to.params.path;

      const isWasteAndLossesRoute =
        to.name === "waste-and-losses-losses" &&
        ["rlsddsp", "rlsddp"].includes(lossesParam) &&
        (!pathParam || pathParam === "create");

      if (
        !accessibleRoutes.includes(to.name as string) &&
        !isWasteAndLossesRoute
      ) {
        return redirectToAllowedPage();
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
    return redirectToAllowedPage();
  }
});
