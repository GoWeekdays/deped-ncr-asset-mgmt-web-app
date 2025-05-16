export default function useLostMaterial() {
  const items: Ref<TIssue[]> = useState("items", () => []);
  const error: Ref<string | null> = useState("error", () => null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const losts = useState<TLost[]>("losts", () => []);

  const search = useState<string>("search", () => "");

  const { entityName, fundCluster } = useDefaults();
  const loading = ref<boolean>(false);

  const lostMaterial = useState(
    "lost",
    (): TLost => ({
      _id: "",
      createdAt: new Date().toDateString().slice(4),
      entityName: entityName.value || "",
      fundCluster: fundCluster.value || "",
      lossNo: "",
      officeId: "",
      officeName: "",
      officerName: "",
      officerDesignation: "",
      officerId: "",
      lossStatus: "lost" as StatusType,
      issueSlipNo: "",
      issueSlipDate: new Date().toDateString().slice(4),
      policeNotified: "no" as YesNo,
      policeStation: "",
      policeReportDate: "",
      circumstances: "",
      status: "pending",
      attachment: "",
      stockNumber: "",
      description: "",
      cost: 0,
      officerDate: "",
      supervisorId: "",
      supervisorName: "",
      supervisorDesignation: "",
      supervisorDate: "",
      governmentId: "",
      governmentIdNo: "",
      governmentIdDate: "",
      docNo: "",
      pageNo: "",
      bookNo: "",
      seriesOf: "",
      notaryPublic: "",
      issuedAt: "",
      itemStocks: [],
    })
  );

  function setLostMaterial(value?: TLost) {
    if (!value) {
      value = {
        _id: "",
        createdAt: new Date().toDateString().slice(4),
        entityName: entityName.value || "",
        fundCluster: fundCluster.value || "",
        lossNo: "",
        officeId: "",
        officeName: "",
        officerName: "",
        officerDesignation: "",
        officerId: "",
        lossStatus: "lost" as StatusType,
        issueSlipNo: "",
        issueSlipDate: new Date().toDateString().slice(4),
        policeNotified: "no" as YesNo,
        policeStation: "",
        policeReportDate: "",
        circumstances: "",
        status: "pending",
        attachment: "",
        stockNumber: "",
        description: "",
        cost: 0,
        officerDate: "",
        supervisorId: "",
        supervisorName: "",
        supervisorDesignation: "",
        supervisorDate: "",
        governmentId: "",
        governmentIdNo: "",
        governmentIdDate: "",
        docNo: "",
        pageNo: "",
        bookNo: "",
        seriesOf: "",
        notaryPublic: "",
        issuedAt: "",
        itemStocks: [],
      };
    }

    lostMaterial.value._id = value._id;
    lostMaterial.value.createdAt = value.createdAt;
    lostMaterial.value.entityName = value.entityName;
    lostMaterial.value.fundCluster = value.fundCluster;
    lostMaterial.value.lossNo = value.lossNo;
    lostMaterial.value.officeId = value.officeId;
    lostMaterial.value.officeName = value.officeName;
    lostMaterial.value.officerName = value.officerName;
    lostMaterial.value.officerDesignation = value.officerDesignation;
    lostMaterial.value.officerId = value.officerId;
    lostMaterial.value.lossStatus = value.lossStatus;
    lostMaterial.value.issueSlipNo = value.issueSlipNo;
    lostMaterial.value.issueSlipDate = value.issueSlipDate;
    lostMaterial.value.policeNotified = value.policeNotified;
    lostMaterial.value.policeStation = value.policeStation;
    lostMaterial.value.policeReportDate = value.policeReportDate;
    lostMaterial.value.circumstances = value.circumstances;
    lostMaterial.value.status = value.status;
    lostMaterial.value.attachment = value.attachment;
    lostMaterial.value.stockNumber = value.stockNumber;
    lostMaterial.value.description = value.description;
    lostMaterial.value.cost = value.cost;
    lostMaterial.value.officerDate = value.officerDate;
    lostMaterial.value.supervisorId = value.supervisorId;
    lostMaterial.value.supervisorName = value.supervisorName;
    lostMaterial.value.supervisorDesignation = value.supervisorDesignation;
    lostMaterial.value.supervisorDate = value.supervisorDate;
    lostMaterial.value.governmentId = value.governmentId;
    lostMaterial.value.governmentIdNo = value.governmentIdNo;
    lostMaterial.value.governmentIdDate = value.governmentIdDate;
    lostMaterial.value.docNo = value.docNo;
    lostMaterial.value.pageNo = value.pageNo;
    lostMaterial.value.bookNo = value.bookNo;
    lostMaterial.value.seriesOf = value.seriesOf;
    lostMaterial.value.notaryPublic = value.notaryPublic;
    lostMaterial.value.issuedAt = value.issuedAt;
    lostMaterial.value.itemStocks = value.itemStocks;
  }

  const losses = (useRoute().params.losses as string) ?? "";

  const isRLSDDSP = computed(() => losses === "rlsddsp");
  const isRLSDDP = computed(() => losses === "rlsddp");

  const type = computed(() =>
    isRLSDDSP.value ? "RLSDDSP" : isRLSDDP.value ? "RLSDDP" : ""
  );

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toDateString().slice(4);
  };

  const formattedDate = (dateInput?: string | Date) => {
    return formatDate(dateInput);
  };

  const lostMaterialPageTitle = computed(() => {
    if (isRLSDDSP.value) return "Lost, Stolen, Damaged, Destroyed SEP";
    if (isRLSDDP.value) return "Lost, Stolen, Damaged, Destroyed PPE";
    return "N/A";
  });

  const lostMaterialCreateTitle = computed(() => {
    if (isRLSDDSP.value)
      return "REPORT OF LOST, STOLEN, DAMAGED, OR DESTROYED PROPERTY";
    if (isRLSDDP.value)
      return "REPORT OF LOST, STOLEN, DAMAGED, OR DESTROYED PROPERTY";
    return "N/A";
  });

  const lostMaterialPrintTitle = computed(() => {
    if (isRLSDDSP.value)
      return "REPORT OF LOST, STOLEN, DAMAGED OR DESTROYED SEMI EXPENDABLE PROPERTY";
    if (isRLSDDP.value)
      return "REPORT OF LOST, STOLEN, DAMAGED OR DESTROYED PROPERTY";
    return "N/A";
  });

  const lostMaterialCreateSubtitle = computed(() => {
    if (isRLSDDSP.value)
      return "Report form for semi-expandable property, Please fill out all required fields to submit your request.";
    if (isRLSDDP.value)
      return "Report form for property, plant and equipment, Please fill out all required fields to submit your request.";
    return "N/A";
  });

  const issueType = computed(() =>
    isRLSDDSP.value ? "ICS" : isRLSDDP.value ? "PAR" : "ICS"
  );

  const { currentUser } = useLocalAuth();

  const receivedBy = computed(() => currentUser?.value?._id ?? null);

  const issueSlips = ref<TLost[]>([]);

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
    const issueId = issueType.value === "ICS" ? "rlsddsp" : "rlsddp";
    return await useNuxtApp().$api<TStockLossesPaginatedResponse>(
      `api/issue-slips/receiver/${issueId}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
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
    return await useNuxtApp().$api<TStockLossesPaginatedResponse>(
      `/api/stocks/loss/reissued/${assetId}`,
      {
        method: "GET",
        query: { page, search, limit },
      }
    );
  }

  async function getIssueSlipsByReceiver({
    page = 1,
    search = "",
    limit = 10,
  } = {}) {
    try {
      loading.value = true;
      const response = await useNuxtApp().$api<TStockLossesPaginatedResponse>(
        `/api/issue-slips/receiver/${issueType.value}`,
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      return response;
    } catch (err) {
      error.value = "Failed to fetch issue slips";
      console.error(err);
      return { items: [] };
    } finally {
      loading.value = false;
    }
  }

  async function getLostMaterials({
    page = 1,
    search = "",
    limit = 10,
    status = "all",
  } = {}) {
    try {
      const response = await useNuxtApp().$api<TLostMaterialPaginatedResponse>(
        `/api/losses/type/${type.value}/${status}`,
        {
          method: "GET",
          query: { page, search, limit },
        }
      );
      losts.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
    } catch (err) {
      error.value = "Failed to fetch lost materials";
      console.error(err);
    }
  }

  async function getLostMaterialById(lost: string) {
    try {
      const response = await useNuxtApp().$api<TLost>(
        `/api/losses/id/${lost}`,
        {
          method: "GET",
        }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  async function updateApproveStatus(lossMaterialId: string): Promise<void> {
    await useNuxtApp().$api<TStandardResponse>(
      `/api/losses/approved/${lossMaterialId}`,
      { method: "PUT" }
    );
  }

  async function updateCompleteStatus(lossMaterialId: string): Promise<void> {
    await useNuxtApp().$api<TStandardResponse>(
      `/api/losses/completed/${lossMaterialId}`,
      { method: "PUT" }
    );
  }

  function createLossMaterial(payload: TLostCreate) {
    const { isRLSDDSP, isRLSDDP } = useLostMaterial();

    const type = computed(() =>
      isRLSDDSP.value ? "RLSDDSP" : isRLSDDP.value ? "RLSDDP" : ""
    );

    payload.type = type.value;

    if (!payload.type) {
      throw new Error('Invalid type: "type" must be one of [RLSDDSP, RLSDDP]');
    }

    return useNuxtApp().$api<TStandardResponse>("/api/losses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  return {
    lostMaterial,
    lostMaterialPageTitle,
    isRLSDDP,
    isRLSDDSP,
    lostMaterialCreateTitle,
    lostMaterialCreateSubtitle,
    setLostMaterial,
    losts,

    lostMaterialPrintTitle,
    getIssueSlipsLosses,
    issueSlips,
    formattedDate,
    getIssueSlipsByReceiver,
    updateApproveStatus,
    updateCompleteStatus,
    getLostMaterials,
    getLostMaterialById,
    createLossMaterial,
    getAssetReturnedItemNo,
    page,
    pages,
    pageRange,

    search,
    items,

    loading,
  };
}
