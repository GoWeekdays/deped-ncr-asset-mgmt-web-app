export default function useDashboard() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const assetOverviews = useState<TAssetOverviewDashboard[]>(
    "assetOverviews",
    () => []
  );

  const assetOverview = useState<TAssetOverviewDashboard>(
    "assetOverview",
    () => {
      return {
        totalAssets: 0,
        totalAssetsInUse: 0,
        totalAssetMaintenance: 0,
        totalAssetsDisposed: 0,
      } as TAssetOverviewDashboard;
    }
  );

  async function getAssetOverview() {
    try {
      loading.value = true;
      const response = await useNuxtApp().$api<TAssetOverviewDashboard>(
        "/api/dashboard/assets-overview",
        {
          method: "GET",
        }
      );

      assetOverview.value = response;
    } catch (err) {
      error.value = "Failed to fetch asset overview";
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  const assetCharts = useState<TAssetChartDashboard[]>("assetCharts", () => []);

  const assetChart = useState<TAssetChartDashboard>("assetChart", () => {
    return {
      totalConsumables: 0,
      totalSEP: 0,
      totalPPE: 0,
    } as TAssetChartDashboard;
  });

  async function getAssetChart() {
    try {
      loading.value = true;
      const response = await useNuxtApp().$api<TAssetChartDashboard>(
        "/api/dashboard/asset-types",
        {
          method: "GET",
        }
      );

      assetChart.value = response;
    } catch (err) {
      error.value = "Failed to fetch asset chart data";
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  const assetProperties = useState<TPropertyDashboard[]>(
    "assetProperties",
    () => []
  );

  const assetProperty = useState<TPropertyDashboard>("assetProperty", () => {
    return {
      sepConditions: {
        goodCondition: 0,
        reissued: 0,
        returned: 0,
        forDisposal: 0,
        transferred: 0,
        lost: 0,
        stolen: 0,
        damaged: 0,
        destroyed: 0,
      },
      ppeConditions: {
        goodCondition: 0,
        reissued: 0,
        returned: 0,
        forDisposal: 0,
        transferred: 0,
        lost: 0,
        stolen: 0,
        damaged: 0,
        destroyed: 0,
      },
    } as TPropertyDashboard;
  });

  async function getAssetProperties(): Promise<TPropertyDashboard[]> {
    const response = await useNuxtApp().$api<TPropertyDashboard[]>(
      "/api/dashboard/property-conditions",
      {
        method: "GET",
      }
    );
    return response;
  }

  const recentActivities = useState<TRecentDashboard[]>(
    "recentActivities",
    () => []
  );

  const recentActivity = useState<TRecentDashboard>("recentActivity", () => {
    return {
      _id: "",
      condition: "",
      type: "",
      name: "",
      status: "",
      createdAt: "",
    } as TRecentDashboard;
  });

  async function getRecentDashboard({ page = 1, search = "", limit = 5 } = {}) {
    try {
      const response = await useNuxtApp().$api<TRecentDashboardResponse>(
        `/api/dashboard/recent-activities`,
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      recentActivities.value = response.recentActivities;
    } catch (err) {
      error.value = "Failed to fetch issue slips";
      console.error(err);
    }
  }

  return {
    assetOverview,
    assetOverviews,
    assetChart,
    assetCharts,
    assetProperties,
    recentActivities,
    recentActivity,
    assetProperty,
    getAssetProperties,
    getRecentDashboard,
    error,
    loading,
    getAssetOverview,
    getAssetChart,
  };
}
