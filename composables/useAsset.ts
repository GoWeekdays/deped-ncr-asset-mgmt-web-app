export default function useAsset() {
  const items: Ref<TAsset[]> = useState("items", () => []);
  const error: Ref<string | null> = useState("error", () => null);

  const asset = useState(
    "Asset",
    (): TAsset => ({
      _id: "",
      createdAt: "",
      assetId: "",
      name: "",
      description: "",
      unitOfMeasurement: "",
      article: "",
      stockNumber: "",
      reorderPoint: "",
      entityName: "",
      fundCluster: "",
      type: "",
      cost: 0,
      propNumAttrib: {
        year: "",
        propertyCode: "",
        serialNumber: "",
        location: "",
        quantity: "",
        counter: "",
      },
      numberOfDaysToConsume: 0,
      condition: "",
      modeOfAcquisition: "",
      procurementType: "",
      supplier: "",
      officeId: "",
      goodCondition: 0,
      reissued: 0,
      returned: 0,
      transferred: 0,
      forDisposal: 0,

      lost: 0,
      stolen: 0,
      damaged: 0,
      destroyed: 0,
    })
  );

  function setAsset(value?: TAsset) {
    if (!value) {
      value = {
        _id: "",
        createdAt: "",
        assetId: "",
        name: "",
        description: "",
        unitOfMeasurement: "",
        article: "",
        stockNumber: "",
        reorderPoint: "",
        entityName: "",
        fundCluster: "",
        type: "",
        cost: 0,
        propNumAttrib: {
          year: "",
          propertyCode: "",
          serialNumber: "",
          location: "",
          quantity: "",
          counter: "",
        },
        numberOfDaysToConsume: 0,
        condition: "",
        modeOfAcquisition: "",
        procurementType: "",
        supplier: "",
        officeId: "",
        goodCondition: 0,
        reissued: 0,
        returned: 0,
        transferred: 0,
        forDisposal: 0,

        lost: 0,
        stolen: 0,
        damaged: 0,
        destroyed: 0,
      };
    }

    asset.value.description = value.description;
    asset.value.createdAt = value.createdAt;
    asset.value.assetId = value.assetId;
    asset.value.fundCluster = value.fundCluster;
    asset.value._id = value._id;
    asset.value.name = value.name;
    asset.value.entityName = value.entityName;
    asset.value.reorderPoint = value.reorderPoint;
    asset.value.stockNumber = value.stockNumber;
    asset.value.type = value.type;
    asset.value.unitOfMeasurement = value.unitOfMeasurement;
    asset.value.article = value.article;
    asset.value.cost = value.cost;
    asset.value.propNumAttrib = value.propNumAttrib;
    asset.value.numberOfDaysToConsume = value.numberOfDaysToConsume;
    asset.value.condition = value.condition;
    asset.value.modeOfAcquisition = value.modeOfAcquisition;
    asset.value.procurementType = value.procurementType;
    asset.value.supplier = value.supplier;
    asset.value.officeId = value.officeId;
    asset.value.goodCondition = value.goodCondition;
    asset.value.reissued = value.reissued;
    asset.value.returned = value.returned;
    asset.value.transferred = value.transferred;
    asset.value.forDisposal = value.forDisposal;
  }

  function createConsumable(asset: TConsumableCreate) {
    return useNuxtApp().$api<TStandardResponse>("/api/assets/consumable", {
      method: "POST",
      body: JSON.stringify(asset),
    });
  }

  function createProperty({
    createdAt = "",
    article = "",
    name = "",
    description = "",
    year = "",
    propertyCode = "",
    serialCode = "",
    locationCode = "",
    reference = "",
    attachment = "",
    quantity = 0,
    cost = 0,
    type = "",
    modeOfAcquisition = "",
    procurementType = "",
    supplier = "",
    officeId = "",
    unitOfMeasurement = "",
  } = {}) {
    const payload = {
      createdAt,
      name,
      article,
      description,
      year,
      propertyCode,
      serialCode,
      locationCode,
      reference,
      attachment,
      quantity,
      cost,
      type,
      modeOfAcquisition,
      procurementType,
      supplier,
      officeId,
      unitOfMeasurement,
    };

    return useNuxtApp().$api<TStandardResponse>("/api/assets/properties", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async function getById(assetId: string): Promise<TAsset> {
    try {
      const response = await useNuxtApp().$api<TAsset>(
        `/api/assets/id/${assetId}`,
        { method: "GET" }
      );
      return response;
    } catch (err) {
      error.value = "Error fetching the asset by ID: Invalid ID format.";
      throw err;
    }
  }

  function getAssets({
    page = 1,
    search = "",
    limit = 10,
    type = "consumable",
  } = {}) {
    return useNuxtApp().$api<TStandardPaginatedResponse>(
      `/api/assets/${type}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  function getConsumablePrint() {
    return useNuxtApp().$api<TConsumablePrintPaginatedResponse>(
      `/api/assets/print/consumables`,
      {
        method: "GET",
      }
    );
  }

  function getPropertyPrint({ type = propertyType, params = {} } = {}) {
    return useNuxtApp().$api<TPropertyPrintPaginatedResponse>(
      `/api/assets/print/${type}`,
      {
        method: "GET",
        params: { ...params },
      }
    );
  }

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const assets = useState<Array<TAsset>>("assets", () => []);

  const search = useState("search", () => "");

  function updateAssetById(id: string, payload: TConsumableCreate) {
    return useNuxtApp().$api<TStandardPaginatedResponse>(
      `/api/assets/id/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  }

  function updatePropertyById({
    _id = "",
    name = "",
    description = "",

    propertyCode = "",
    year = "",
    serialCode = "",
    locationCode = "",
  } = {}) {
    return useNuxtApp().$api<TKeyValuePair>("/api/assets/properties", {
      method: "PUT",
      body: JSON.stringify({
        _id,
        name,
        description,
        year,
        propertyCode,
        serialCode,
        locationCode,
      }),
    });
  }

  const deleteAssetById = async (assetId: string): Promise<void> => {
    return useNuxtApp().$api(`/api/assets/id/${assetId}`, {
      method: "DELETE",
    });
  };

  const updateCondition = async (
    assetId: string,
    condition: TCondition
  ): Promise<void> => {
    return useNuxtApp().$api(`/api/assets/id/${assetId}/${condition}`, {
      method: "PUT",
    });
  };

  async function getAssetWasteByCondition({
    page = 1,
    search = "",
    limit = 20,
  }: {
    page?: number;
    search?: string;
    limit?: number;
  }) {
    return await useNuxtApp().$api<TStandardPaginatedResponse>(
      "/api/assets/wastes/asset-condition",
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  async function getAssetMaintenanceByCondition({
    page = 1,
    search = "",
    limit = 20,
  }: {
    page?: number;
    search?: string;
    limit?: number;
  }) {
    return await useNuxtApp().$api<TStandardPaginatedResponse>(
      "/api/assets/maintenances/asset-condition",
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  async function getWastetocksByCondition({
    condition,
    page = 1,
    search = "",
    limit = 10,
    assetId,
  }: {
    condition: string;
    page?: number;
    search?: string;
    limit?: number;
    assetId: string;
  }) {
    try {
      return await useNuxtApp().$api<TStockWastePaginatedResponse>(
        `/api/wastes/condition/${condition}/${assetId}`,
        {
          method: "GET",
          params: { page, search, limit },
        }
      );
    } catch (error) {
      console.error("Error fetching waste stocks by condition:", error);
      throw error;
    }
  }

  async function getAssetByCondition({
    page = 1,
    search = "",
    limit = 10,
    type = "",
  }: {
    page?: number;
    search?: string;
    limit?: number;
    type: string;
  }) {
    return await useNuxtApp().$api<TStandardPaginatedResponse>(
      `/api/assets/transfer/${type}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  async function getReturnAssetByCondition({
    page = 1,
    search = "",
    limit = 10,
    type = "",
  }: {
    page?: number;
    search?: string;
    limit?: number;
    type: string;
  }) {
    return await useNuxtApp().$api<TStandardPaginatedResponse>(
      `/api/assets/return/${type}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  async function getStocksByCondition({
    condition,
    page = 1,
    search = "",
    limit = 10,
    assetId,
  }: {
    condition: string;
    page?: number;
    search?: string;
    limit?: number;
    assetId: string;
  }) {
    return useNuxtApp().$api<TStockTransferPaginatedResponse>(
      `/api/stocks/condition/${condition}/${assetId}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  const selectedAssets = useState<Array<TAsset>>("selectedAssets", () => []);

  const params = useRoute().params;

  const type = (params.property as string) || "";

  const isSEP = type === "semi-expandable-property";
  const isPPE = type === "property-plant-and-equipment";

  const title = computed(() => {
    if (isSEP) {
      return "Semi-Expendable Property";
    }

    if (isPPE) {
      return "Property, Plant and Equipment";
    }

    return "N/A";
  });

  const name = computed(() => {
    if (isSEP) {
      return "Semi-Expendable Property";
    }

    if (isPPE) {
      return "Property, Plant, and Equipment";
    }

    return "N/A";
  });

  const assetCardPrint = computed(() => {
    if (isSEP) {
      return "SEMI-EXPENDABLE PROPERTY CARD";
    }

    if (isPPE) {
      return "PROPERTY CARD";
    }

    return "N/A";
  });

  const issueTitle = computed(() => {
    if (isSEP) {
      return "Inventory Custodian Slip";
    }

    if (isPPE) {
      return "Property Acknowledgement Receipt";
    }

    return "N/A";
  });

  const issueSubtitle = computed(() => {
    if (isSEP) {
      return "Issuance for Semi-Expendable Property. Please fill out all required fields to confirm receipt of the issuance.";
    }

    if (isPPE) {
      return "Issuance for Property, Plant, and Equipment. Please fill out all required fields to confirm receipt of the issuance.";
    }
  });

  const propertyPrintTitle = computed(() => {
    if (isSEP) {
      return "REPORT ON THE PHYSICAL COUNT OF SEMI-EXPENDABLE PROPERTY";
    }

    if (isPPE) {
      return "REPORT ON THE PHYSICAL COUNT OF PROPERTY, PLANT, AND EQUIPMENT";
    }
  });

  const propertyPrintType = computed(() => {
    if (isSEP) {
      return "Semi-Expendable Property";
    }

    if (isPPE) {
      return "Property, Plant, and Equipment";
    }
  });

  const propertyType = computed(() => {
    return isPPE ? "PPE" : isSEP ? "SEP" : "";
  });

  return {
    propertyType,
    title,
    type,
    name,
    issueTitle,
    propertyPrintTitle,
    propertyPrintType,
    issueSubtitle,
    isPPE,
    isSEP,
    createConsumable,
    assetCardPrint,
    createProperty,

    updatePropertyById,
    getById,
    getConsumablePrint,
    getPropertyPrint,
    asset,
    setAsset,
    page,
    pages,
    pageRange,
    assets,
    search,
    items,
    getAssets,
    updateAssetById,
    deleteAssetById,
    selectedAssets,
    updateCondition,
    getAssetWasteByCondition,
    getWastetocksByCondition,
    getReturnAssetByCondition,
    getAssetMaintenanceByCondition,
    getAssetByCondition,
    getStocksByCondition,
  };
}
