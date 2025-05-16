export default function useTransfer() {
  const items: Ref<TTransfer[]> = useState("items", () => []);
  const error: Ref<string | null> = useState("error", () => null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const transfers = useState<Array<TTransfer>>("transfers", () => []);
  const search = useState("search", () => "");

  const { entityName, fundCluster } = useDefaults();
  const loading = ref(false);

  const transferProperty = useState(
    "transfer",
    (): TTransfer => ({
      _id: "",
      type: "inventory-transfer-report",
      entityName: entityName.value || "",
      fundCluster: fundCluster.value || "",
      transferNo: "",
      transferReason: "",
      completedAt: "",
      createdAt: new Date().toDateString().slice(4),
      transferType: new Date().toDateString().slice(4),
      itemStocks: [
        {
          _id: "",
          cost: 0,
          itemNo: "",
          condition: "reissued",
          type: "",
          reference: "",
          createdAt: new Date().toDateString().slice(4),
          stockNumber: "",
          description: "",
          amount: 0,
        },
      ],

      approvedBy: undefined,
      approvedByName: undefined,
      approvedByDesignation: undefined,
      approvedAt: undefined,

      issuedBy: "",
      issuedByName: undefined,
      issuedByDesignation: undefined,

      receivedBy: "",
      receivedByName: undefined,
      receivedByDesignation: undefined,

      status: "pending",

      updatedAt: new Date().toDateString().slice(4),

      from: "",
      divisionId: "",
      school: "",
      name: "",
    })
  );

  function setTransfer(value?: Partial<TTransfer>) {
    transferProperty.value = {
      ...transferProperty.value,
      ...(value || {}),
    };
  }

  const transfer = (useRoute().params.transfer as string) ?? "";

  const isInventory = computed(() => transfer === "inventory-transfer");
  const isProperty = computed(() => transfer === "property-transfer");

  const type = computed(() =>
    isInventory.value
      ? "inventory-transfer-report"
      : isProperty.value
        ? "property-transfer-report"
        : ""
  );

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toDateString().slice(4);
  };

  const formattedDate = (dateInput?: string | Date) => {
    return formatDate(dateInput);
  };

  const transferPageTitle = computed(() => {
    if (isInventory.value) return "Inventory Transfer";
    if (isProperty.value) return "Property Transfer";
    return "N/A";
  });

  const transferPrintTitle = computed(() => {
    if (isInventory.value) return "Inventory Transfer Report";
    if (isProperty.value) return "Property Transfer Report";
    return "N/A";
  });

  const transferCreateTitle = computed(() => {
    if (isInventory.value) return "Inventory Transfer Report";
    if (isProperty.value) return "Property Transfer Report";
    return "N/A";
  });

  async function getTransfers({ page = 1, search = "", limit = 10 } = {}) {
    try {
      const response = await useNuxtApp().$api<TTransferPaginatedResponse>(
        `/api/transfers/${type.value}`,
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      transfers.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
    } catch (err) {
      error.value = "Failed to fetch issue slips";
      console.error(err);
    }
  }

  function createTransfer(payload: TTransferCreate) {
    return useNuxtApp().$api<TStandardResponse>("/api/transfers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async function getTransferById(transferProperty: string) {
    try {
      const response = await useNuxtApp().$api<TTransfer>(
        `/api/transfers/id/${transferProperty}`,
        { method: "GET" }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  async function updateTransferApproveStatus(
    _id: string,
    approvedBy: string,
    status: TTransferStatus
  ): Promise<void> {
    if (!_id) {
      console.error("Transfer ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/transfers/id/${_id}/${status}`,
        {
          method: "PUT",
          body: { approvedBy: approvedBy },
        }
      );
    } catch (error) {
      console.error("Error updating transfer status:", error);
    }
  }

  async function updateTransferCompleteStatus(
    _id: string,
    status: TTransferStatus,
    issuedBy: string,
    receivedByName: string,
    receivedByDesignation: string
  ): Promise<void> {
    if (!_id) {
      console.error("Transfer ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/transfers/id/${_id}/${status}`,
        {
          method: "PUT",
          body: {
            issuedBy: issuedBy,
            receivedByName: receivedByName,
            receivedByDesignation: receivedByDesignation,
          },
        }
      );
    } catch (error) {
      console.error("Error updating transfer status:", error);
    }
  }

  return {
    transferProperty,
    isInventory,
    isProperty,
    transferPageTitle,
    transferPrintTitle,
    transferCreateTitle,
    transfers,
    transfer,
    setTransfer,
    formattedDate,

    getTransfers,
    createTransfer,
    getTransferById,
    updateTransferApproveStatus,
    updateTransferCompleteStatus,

    page,
    pages,
    pageRange,

    search,
    items,

    loading,
  };
}
