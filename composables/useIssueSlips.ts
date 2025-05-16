export default function useAsset() {
  const items: Ref<TIssue[]> = useState("items", () => []);
  const error: Ref<string | null> = useState("error", () => null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const issueSlips = useState<Array<TIssue>>("issueSlips", () => []);
  const search = useState("search", () => "");

  // const { entityName, fundCluster } = useDefaults();

  const issueSlip = useState(
    "issueSlip",
    (): TIssue => ({
      _id: "",
      assetId: "",
      entityName: "",
      fundCluster: "",
      description: "",
      unitOfMeasurement: "",
      cost: 0,
      itemNo: "",
      quantity: 0,
      issueSlipNo: "",
      estimatedUsefulLife: 0,
      issuedBy: "",
      issuedByName: "",
      issuedByDesignation: "",
      receivedBy: "",
      receivedByName: "",
      receivedByDesignation: "",
      receivedAt: "",
      status: "",
      createdAt: "",
      updatedAt: "",
    })
  );

  function setIssueSlip(value?: Partial<TIssue>) {
    if (!value) {
      value = {
        _id: "",
        assetId: "",
        entityName: "",
        fundCluster: "",
        description: "",
        unitOfMeasurement: "",
        cost: 0,
        itemNo: "",
        quantity: 0,
        issueSlipNo: "",
        estimatedUsefulLife: 0,
        issuedBy: "",
        issuedByName: "",
        issuedByDesignation: "",
        receivedBy: "",
        receivedByName: "",
        receivedByDesignation: "",
        receivedAt: "",
        status: "",
        createdAt: "",
        updatedAt: "",
      };
    }

    issueSlip.value = {
      ...issueSlip.value,
      ...value,
    };
  }

  const issueslip = (useRoute().params.issueslip as string) ?? "";

  const isICS = computed(() => issueslip === "inventory-custodian-slip");
  const isPAR = computed(
    () => issueslip === "property-acknowledgement-receipts"
  );

  const type = computed(() => (isICS.value ? "ICS" : isPAR.value ? "PAR" : ""));

  const issuePageTitle = computed(() => {
    if (isICS.value) return "Inventory Custodian Slip";
    if (isPAR.value) return "Property Acknowledgement Receipt";
    return "N/A";
  });

  const issueTypeNo = computed(() => {
    if (isICS.value) return "ICS No";
    if (isPAR.value) return "PAR No";
    return "N/A";
  });

  const loading = ref(false);

  const formattedIssueSlips = computed(() =>
    issueSlips.value.map((issueSlip) => ({
      ...issueSlip,
      createdAt: new Date(issueSlip.createdAt).toDateString().slice(4),
    }))
  );

  async function getIssueSlips({ page = 1, search = "", limit = 10 } = {}) {
    try {
      const response = await useNuxtApp().$api<TIssueSlipsPaginatedResponse>(
        `/api/issue-slips/${type.value}`,
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      issueSlips.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
    } catch (err) {
      error.value = "Failed to fetch issue slips";
      console.error(err);
    }
  }

  async function getIssueSlipsById(id: string) {
    if (!id) throw new Error("ID is required to fetch issue slips.");
    try {
      const response = await useNuxtApp().$api<TIssue>(
        `/api/issue-slips/id/${id}`,
        { method: "GET" }
      );
      return response;
    } catch (err) {
      console.error("Error fetching issue slip by ID:", err);
      throw err;
    }
  }

  async function updateIssueStatus(id: string): Promise<void> {
    if (!id) {
      console.error("Property ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/issue-slips/id/${id}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  async function getIssueSlipsLosses({
    page = 1,
    search = "",
    limit = 20,
    id = "",
  }: {
    page?: number;
    search?: string;
    limit?: number;
    id: string;
  }) {
    return await useNuxtApp().$api<TStockLossesPaginatedResponse>(
      `api/issue-slips/receiver/${id}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  return {
    isICS,
    isPAR,
    issuePageTitle,
    issueSlip,
    issueTypeNo,

    setIssueSlip,
    getIssueSlips,
    getIssueSlipsById,
    updateIssueStatus,
    getIssueSlipsLosses,
    page,
    pages,
    pageRange,
    issueSlips,
    search,
    items,

    loading,
    formattedIssueSlips,
  };
}
