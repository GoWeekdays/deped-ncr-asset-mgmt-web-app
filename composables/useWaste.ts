export default function useWaste() {
  const { entityName, fundCluster } = useDefaults();
  const error: Ref<string | null> = useState("error", () => null);
  const loading = ref(false);
  const search = useState("search", () => "");
  const page = useState("page", () => 0);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const wastes = useState<Array<TWaste>>("wastes", () => []);
  const waste = useState<TWaste>("waste", () => ({
    _id: "",
    createdAt: new Date().toDateString().slice(4),
    entityName: entityName.value,
    fundCluster: fundCluster.value,
    placeOfStorage: "",
    status: "",
    certifiedCorrectName: "",
    disposalApprovedName: "",
    witnessToDisposalName: "",
    itemStocks: [
      {
        stockId: "",
        type: "",
        condition: "",
        assetId: "",
        name: "",
        stockNumber: "",
        quantity: 0,
        unitOfMeasurement: "",
        description: "",
      },
    ],
    certifiedByName: "",
    certifiedByDesignation: "",
    disposalApprovedByName: "",
    disposalApprovedByDesignation: "",
    witnessedBy: "",
    destroyedCount: 0,
    soldAtPrivateSaleCount: 0,
    soldAtPublicAuctionCount: 0,
    transferredWithoutCostCount: 0,
    acquisitionCost: "",
    witnessedByName: "",
    disposalApprovedBy: "",
  }));

  function setWaste(value?: TWaste) {
    if (!value) {
      value = {
        _id: "",
        createdAt: new Date().toDateString().slice(4),
        entityName: "",
        fundCluster: "",
        placeOfStorage: "",
        status: "",
        certifiedCorrectName: "",
        disposalApprovedName: "",
        witnessToDisposalName: "",
        itemStocks: [
          {
            stockId: "",
            type: "",
            condition: "",
            assetId: "",
            name: "",
            stockNumber: "",
            quantity: 0,
            unitOfMeasurement: "",
            description: "",
          },
        ],
        certifiedByName: "",
        certifiedByDesignation: "",
        disposalApprovedByName: "",
        disposalApprovedByDesignation: "",
        witnessedBy: "",
        destroyedCount: 0,
        soldAtPrivateSaleCount: 0,
        soldAtPublicAuctionCount: 0,
        transferredWithoutCostCount: 0,
        acquisitionCost: "",
        witnessedByName: "",
        disposalApprovedBy: "",
      };
    }

    waste.value = value;
  }

  async function getWastes({ page = 1, search = "", limit = 10 } = {}) {
    try {
      const response = await useNuxtApp().$api<TWastePaginatedResponse>(
        "/api/wastes",
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      wastes.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
    } catch (err) {
      error.value = "Failed to fetch waste and materials.";
      console.error(err);
    }
  }

  async function getWasteById(waste: string) {
    try {
      return useNuxtApp().$api<TWaste>(`/api/wastes/${waste}`, {
        method: "GET",
      });
    } catch (err) {
      throw err;
    }
  }

  function createWaste(payload: TWasteCreate) {
    return useNuxtApp().$api<TStandardResponse>("/api/wastes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  const updateWasteApproveStatus = async (
    _id: string,
    witnessedByName: string,
    disposalApprovedBy: string
  ): Promise<void> => {
    if (!_id) {
      console.error("Transfer ID is missing");
      return;
    }

    try {
      await useNuxtApp().$api<TStandardResponse>(`/api/wastes/${_id}`, {
        method: "PUT",
        body: {
          witnessedByName: witnessedByName,
          disposalApprovedBy: disposalApprovedBy,
        },
      });
    } catch (error) {
      console.error("Error updating transfer status:", error);
    }
  };

  return {
    loading,
    setWaste,
    createWaste,
    getWastes,
    getWasteById,
    updateWasteApproveStatus,
    search,
    page,
    pages,
    pageRange,
    waste,
    wastes,
  };
}
