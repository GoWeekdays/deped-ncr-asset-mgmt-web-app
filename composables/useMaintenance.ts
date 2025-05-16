export default function useMaintenance() {
  const items: Ref<TMaintenance[]> = useState("items", () => []);
  const maintenances = useState<TMaintenance[]>("maintenances", () => []);
  const selectedMaintenances: Ref<TMaintenance[]> = useState(
    "selectedMaintenances",
    () => []
  );
  const error: Ref<string | null> = useState("error", () => null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const search = useState("search", () => "");

  const { entityName, fundCluster } = useDefaults();

  const maintenance = useState(
    "maintenance",
    (): TMaintenance => ({
      _id: "",
      code: "",

      type: "",
      assetId: "",
      officeId: "",
      officeName: "",
      issue: "",
      status: "",
      createdAt: new Date().toDateString().slice(4),
      scheduledAt: new Date().toDateString().slice(4),
      maintenanceCode: "",
      assetName: "",
      assetDescription: "",
      assigneeId: "",
      assigneeName: "",
      assignee: "",
      attachment: "",
      remarks: "",
      rescheduleReason: "",
      completedBy: "",
      completedByName: "",
    })
  );

  function setMaintenance(value?: TMaintenance) {
    if (!value) {
      value = {
        _id: "",
        code: "",
        type: "",
        assetId: "",
        officeId: "",
        officeName: "",
        issue: "",
        status: "",
        createdAt: new Date().toDateString().slice(4),
        scheduledAt: new Date().toDateString().slice(4),
        maintenanceCode: "",
        assetName: "",
        assetDescription: "",
        assigneeId: "",
        assigneeName: "",
        assignee: "",
        attachment: "",
        remarks: "",
        rescheduleReason: "",
        completedBy: "",
        completedByName: "",
      };
    }

    maintenance.value._id = value._id;
    maintenance.value.code = value.code;
    maintenance.value.type = value.type;
    maintenance.value.assetId = value.assetId;
    maintenance.value.officeId = value.officeId;
    maintenance.value.officeName = value.officeName;
    maintenance.value.issue = value.issue;
    maintenance.value.status = value.status;
    maintenance.value.createdAt = value.createdAt;
    maintenance.value.scheduledAt = value.scheduledAt;
    maintenance.value.maintenanceCode = value.maintenanceCode;
    maintenance.value.assetName = value.assetName;
    maintenance.value.assetDescription = value.assetDescription;
    maintenance.value.assigneeId = value.assigneeId;
    maintenance.value.assigneeName = value.assigneeName;
    maintenance.value.assignee = value.assignee;
    maintenance.value.attachment = value.attachment;
    maintenance.value.remarks = value.remarks;
    maintenance.value.rescheduleReason = value.rescheduleReason;
    maintenance.value.completedBy = value.completedBy;
    maintenance.value.completedByName = value.completedByName;
  }

  async function getMaintenances({ page = 1, search = "", limit = 10 } = {}) {
    try {
      const response = await useNuxtApp().$api<TMaintenanceResponse>(
        `/api/maintenances`,
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      maintenances.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
    } catch (err) {
      error.value = "Failed to fetch issue slips";
      console.error(err);
    }
  }

  async function getMaintenanceById(maintenanceId: string) {
    try {
      const response = await useNuxtApp().$api<TMaintenance>(
        `/api/maintenances/${maintenanceId}`,
        { method: "GET" }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  async function getAssetItemNo({
    page = 1,
    search = "",
    limit = 20,
    assetId = "",
  }: {
    page?: number;
    search?: string;
    limit?: number;
    assetId: string;
  }) {
    return await useNuxtApp().$api<TStandardPaginatedResponse>(
      `/api/maintenances/item-no/${assetId}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  function createMaintenance(payload: TMaintenanceCreate) {
    return useNuxtApp().$api<TStandardResponse>("/api/maintenances", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  function scheduleMaintenance(payload: TScheduleCreate, scheduleId: string) {
    return useNuxtApp().$api<TStandardResponse>(
      `/api/maintenances/scheduled/${scheduleId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  function completeMaintenance(payload: TCompleteCreate, scheduleId: string) {
    return useNuxtApp().$api<TStandardResponse>(
      `/api/maintenances/completed/${scheduleId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  function reScheduleMaintenance(
    payload: TReScheduleCreate,
    scheduleId: string
  ) {
    return useNuxtApp().$api<TStandardResponse>(
      `/api/maintenances/reScheduled/${scheduleId}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  async function cancelMaintenanceById(maintenanceId: string): Promise<void> {
    if (!maintenanceId) {
      console.error("No maintenance ID provided for cancellation.");
      return;
    }
    console.log("Cancelling maintenance with ID:", maintenanceId);
    await useNuxtApp().$api<TStandardResponse>(
      `/api/maintenances/cancelled/${maintenanceId}`,
      { method: "PUT" }
    );
  }

  return {
    items,
    error,
    maintenance,
    setMaintenance,
    selectedMaintenances,
    page,
    pages,
    search,
    pageRange,
    maintenances,
    getMaintenances,
    getMaintenanceById,
    createMaintenance,
    scheduleMaintenance,
    reScheduleMaintenance,
    cancelMaintenanceById,
    completeMaintenance,
    getAssetItemNo,
  };
}
