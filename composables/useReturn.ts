export default function useLostMaterial() {
  const items: Ref<TIssue[]> = useState("items", () => []);
  const error: Ref<string | null> = useState("error", () => null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const returns = useState<TReturn[]>("returns", () => []);

  const search = useState<string>("search", () => "");

  const loading = ref<boolean>(false);

  const returned = useState(
    "returned",
    (): TReturn => ({
      _id: "",
      entityName: "",
      fundCluster: "",
      createdAt: "",
      itemStocks: [],
      returnNo: "",
      status: "",
      officeName: "",
      returnedByName: "",
      returnedBy: "",
      returnedByDesignation: "",
      receivedByName: "",
      receivedByDesignation: "",
      approvedBy: "",
      approveByName: "",
      approveByDesignation: "",
      approveAt: "",
      completedAt: "",
    })
  );

  function setReturn(value?: TReturn) {
    if (!value) {
      value = {
        _id: "",
        entityName: "",
        fundCluster: "",
        createdAt: "",
        itemStocks: [],
        returnNo: "",
        status: "",
        officeName: "",
        returnedByName: "",
        returnedBy: "",
        returnedByDesignation: "",
        receivedByName: "",
        receivedByDesignation: "",
        approvedBy: "",
        approveByName: "",
        approveByDesignation: "",
        approveAt: "",
        completedAt: "",
      };
    }

    returned.value._id = value._id;
    returned.value.entityName = value.entityName;
    returned.value.fundCluster = value.fundCluster;
    returned.value.createdAt = value.createdAt;
    returned.value.itemStocks = value.itemStocks;
    returned.value.returnNo = value.returnNo;
    returned.value.status = value.status;
    returned.value.officeName = value.officeName;
    returned.value.returnedByName = value.returnedByName;
    returned.value.returnedBy = value.returnedBy;
    returned.value.returnedByDesignation = value.returnedByDesignation;
    returned.value.receivedByName = value.receivedByName;
    returned.value.receivedByDesignation = value.receivedByDesignation;
    returned.value.approvedBy = value.approvedBy;
    returned.value.approveByName = value.approveByName;
    returned.value.approveByDesignation = value.approveByDesignation;
    returned.value.approveAt = value.approveAt;

    returned.value.completedAt = value.completedAt;
  }

  const returnedType = (useRoute().params.returnedType as string) ?? "";

  const isReturnSEP = computed(() => returnedType === "SEP");
  const isReturnPPE = computed(() => returnedType === "PPE");
  const type = computed(() =>
    isReturnSEP.value ? "SEP" : isReturnPPE.value ? "PPE" : ""
  );

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toDateString().slice(4);
  };

  const formattedDate = (dateInput?: string | Date) => {
    return formatDate(dateInput);
  };

  const returnPageTitle = computed(() => {
    if (isReturnSEP.value) return "Returned Semi-Expendable Property";
    if (isReturnPPE.value) return "Returned Property, Plant and Equipment";
    return "N/A";
  });

  const returnPrintTitle = computed(() => {
    if (isReturnSEP.value)
      return "RECEIPT OF RETURNED SEMI-EXPENDABLE PROPERTY";
    if (isReturnPPE.value) return "RECEIPT OF PROPERTY, PLANT AND EQUIPMENT";
    return "N/A";
  });

  const returnReadPageTitle = computed(() => {
    if (isReturnSEP.value)
      return " RECEIPT OF RETURNED SEMI-EXPENDABLE PROPERTY";
    if (isReturnPPE.value)
      return " RECEIPT OF RETURNED PROPERTY, PLANT AND EQUIPMENT";
    return "N/A";
  });

  const returnCreateTitle = computed(() => {
    if (isReturnSEP.value)
      return "RECEIPT OF RETURNED SEMI-EXPENDABLE PROPERTY";
    if (isReturnPPE.value)
      return "RECEIPT OF RETURNED PROPERTY, PLANT AND EQUIPMENT";
    return "N/A";
  });

  const returnCreateSubtitle = computed(() => {
    if (isReturnSEP.value)
      return "Return form for semi-expandable property, Please fill out all required fields to submit your request.";
    if (isReturnPPE.value)
      return "Return form for property, plant and equipment, Please fill out all required fields to submit your request.";
    return "N/A";
  });

  const returnInventoryTitle = computed(() => {
    if (isReturnSEP.value)
      return "INVENTORY AND INSPECTION REPORT OF UNSERVICEABLE SEMI-EXPENDABLE PROPERTY";
    if (isReturnPPE.value)
      return "INVENTORY AND INSPECTION REPORT OF UNSERVICEABLE PROPERTY";
    return "N/A";
  });

  const issueType = ref<"ICS" | "PAR">("ICS");

  const { currentUser } = useLocalAuth();

  const receivedBy = computed(() => currentUser?.value?._id ?? null);

  const issueSlips = ref<TLost[]>([]);

  async function getReturns({ page = 1, search = "", limit = 10 } = {}) {
    try {
      const response = await useNuxtApp().$api<TReturnPaginatedResponse>(
        `/api/returns/type/${type.value}`,
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      returns.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
    } catch (err) {
      error.value = "Failed to fetch lost materials";
      console.error(err);
    }
  }

  async function getReturnById(returned: string) {
    try {
      const response = await useNuxtApp().$api<TLost>(
        `/api/returns/id/${returned}`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  async function getAssetReturnedItemNo({
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
    return await useNuxtApp().$api<TReturnPaginatedResponse>(
      `/api/stocks/return/reissued/${assetId}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  function approveReturn(payload: TApproveReturn, returnId: string) {
    return useNuxtApp().$api<TStandardResponse>(
      `/api/returns/id/${returnId}/approved`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  function completeReturn(payload: TCompleteReturn, returnId: string) {
    return useNuxtApp().$api<TStandardResponse>(
      `/api/returns/id/${returnId}/completed`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  function createReturn(payload: TReturnCreate) {
    return useNuxtApp().$api<TStandardResponse>("/api/returns", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async function getInventoryReport() {
    try {
      const response = await useNuxtApp().$api<TReturnInventoryPage>(
        `/api/returns/report/for-disposal/${type.value}`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (err) {
      error.value = "Failed to fetch lost materials";
      console.error(err);
      return null;
    }
  }

  return {
    returned,
    returnPageTitle,
    returnInventoryTitle,
    returnReadPageTitle,
    isReturnPPE,
    isReturnSEP,
    returnCreateTitle,
    returnPrintTitle,
    returnCreateSubtitle,
    setReturn,
    returns,

    issueSlips,
    formattedDate,
    getReturns,
    getReturnById,
    getAssetReturnedItemNo,
    completeReturn,
    approveReturn,
    createReturn,
    getInventoryReport,

    page,
    pages,
    pageRange,

    search,
    items,
    type,
    loading,
  };
}
