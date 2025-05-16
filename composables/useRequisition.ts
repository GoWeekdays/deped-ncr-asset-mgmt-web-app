export default function useRequisition() {
  const items: Ref<TRequisition[]> = useState("items", () => []);
  const requisitions: Ref<TRequisition[]> = useState("requisitions", () => []);
  const selectedRequisitions: Ref<TRequisition[]> = useState(
    "selectedRequisitions",
    () => []
  );
  const error: Ref<string | null> = useState("error", () => null);

  // Pagination state
  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");
  const search = useState("search", () => "");

  const { entityName, fundCluster } = useDefaults();

  const requisition = useState<TRequisition>("requisition", () => {
    return {
      _id: "",
      entityName: entityName.value,
      fundCluster: fundCluster.value,
      divisionId: "",
      officeId: "",
      office: "",
      rcc: "",
      purpose: "",
      risNo: {
        year: "",
        month: "",
        day: "",
        counter: "",
      },
      risId: "",
      remarks: "",
      itemStocks: [],
      requestedBy: "",
      requestedByName: "",
      requestedByDesignation: "",
      approvedBy: "",
      approvedByName: "",
      approvedByDesignation: "",
      issuedBy: "",
      issuedByName: "",
      issuedByDesignation: "",
      receivedBy: "",
      receivedByName: "",
      receivedByDesignation: "",
      status: "for-evaluation",
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
    } as TRequisition;
  });

  function setRequisition(value?: TRequisition) {
    if (!value) {
      value = {
        _id: "",
        entityName: entityName.value,
        fundCluster: fundCluster.value,
        divisionId: "",
        officeId: "",
        office: "",
        rcc: "",
        purpose: "",
        risNo: {
          year: "",
          month: "",
          day: "",
          counter: "",
        },
        risId: "",
        remarks: "",
        itemStocks: [],
        requestedBy: "",
        requestedByName: "",
        requestedByDesignation: "",
        approvedBy: "",
        approvedByName: "",
        approvedByDesignation: "",
        issuedBy: "",
        issuedByName: "",
        issuedByDesignation: "",
        receivedBy: "",
        receivedByName: "",
        receivedByDesignation: "",
        status: "for-evaluation",
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };
    }

    requisition.value.entityName = value.entityName;
    requisition.value.fundCluster = value.fundCluster;
    requisition.value.divisionId = value.divisionId;
    requisition.value.officeId = value.officeId;
    requisition.value.office = value.office;
    requisition.value.rcc = value.rcc;
    requisition.value.purpose = value.purpose;
    requisition.value.risId = value.risId;
    requisition.value.remarks = value.remarks;
    requisition.value.itemStocks = value.itemStocks || [];
    requisition.value.requestedBy = value.requestedBy;
    requisition.value.requestedByName = value.requestedByName;
    requisition.value.requestedByDesignation = value.requestedByDesignation;
    requisition.value.approvedBy = value.approvedBy;
    requisition.value.approvedByName = value.approvedByName;
    requisition.value.approvedByDesignation = value.approvedByDesignation;
    requisition.value.issuedBy = value.issuedBy;
    requisition.value.issuedByName = value.issuedByName;
    requisition.value.issuedByDesignation = value.issuedByDesignation;
    requisition.value.receivedBy = value.receivedBy;
    requisition.value.receivedByName = value.receivedByName;
    requisition.value.receivedByDesignation = value.receivedByDesignation;
    requisition.value.status = value.status || "pending";
    requisition.value.createdAt = value.createdAt || new Date().toISOString();
    requisition.value.updatedAt = value.updatedAt || new Date().toISOString();
    requisition.value.deletedAt = value.deletedAt || new Date().toISOString();
    requisition.value.approvedAt = value.approvedAt || new Date().toISOString();
  }

  function getRequisitions({ page = 1, search = "", limit = 10 } = {}) {
    return useNuxtApp().$api<TRequisitionResponse>("/api/ris", {
      method: "GET",
      query: { page, search, limit },
    });
  }

  function getRequisitionReport() {
    return useNuxtApp().$api<TRequisitionReportResponse>("/api/ris/report", {
      method: "GET",
    });
  }

  function getRequisitionReportData(risId: string) {
    return useNuxtApp().$api<TRequisitionReport>(`/api/ris/report/${risId}`, {
      method: "GET",
    });
  }

  function updateGenerateSerialNo(risId: string) {
    return useNuxtApp().$api<TRequisitionReport>(
      `/api/ris/report/serial-no/${risId}`,
      {
        method: "PUT",
      }
    );
  }

  async function getRequisitionById(requisitionId: string) {
    try {
      const response = await useNuxtApp().$api<TRequisition>(
        `/api/ris/id/${requisitionId}`,
        { method: "GET" }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  function createRequistion(requisition: TRequisition) {
    return useNuxtApp().$api<TStandardResponse>("/api/ris", {
      method: "POST",
      body: JSON.stringify(requisition),
    });
  }

  async function cancelRequisitionStatus(
    requisitionId: string,
    status: TRequisitionStatus,
    remarks: string
  ): Promise<void> {
    if (!requisitionId) {
      console.error("Requisition ID is missing");
      return;
    }

    try {
      await useNuxtApp().$api<TStandardResponse>(
        `/api/ris/${status}/${requisitionId}`,
        {
          method: "PUT",
          body: { remarks },
        }
      );
    } catch (error) {
      console.error("Error cancelling requisition:", error);
    }
  }

  async function updateRequisitionStatus(
    requisitionId: string,
    status: TRequisitionStatus
  ): Promise<void> {
    if (!requisitionId) {
      console.error("Invitation ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/ris/id/${requisitionId}/${status}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error cancelling invitation:", error);
    }
  }

  async function updateForReviewStatus(
    requisitionId: string,
    itemStocks?: { itemStocks: any[] }
  ): Promise<void> {
    if (!requisitionId) {
      console.error("Requisition ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/ris/evaluating/${requisitionId}`,
        {
          method: "PUT",
          body: itemStocks,
        }
      );
    } catch (error) {
      console.error("Error updating requisition status:", error);
    }
  }

  async function updatePendingStatus(
    requisitionId: string,
    status: TRequisitionStatus,
    approvedBy: string
  ): Promise<void> {
    if (!requisitionId) {
      console.error("Requisition ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/ris/${status}/${requisitionId}`,
        {
          method: "PUT",
          body: {
            approvedBy: approvedBy,
          },
        }
      );
      console.log("Requisition status updated successfully:", res);
    } catch (error) {
      console.error("Error updating requisition status:", error);
    }
  }

  async function updateIssuedStatus(
    requisitionId: string,
    status: TRequisitionStatus,
    issuedBy: string,
    receivedBy: string
  ): Promise<void> {
    if (!requisitionId) {
      console.error("Requisition ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/ris/${status}/${requisitionId}`,
        {
          method: "PUT",
          body: {
            issuedBy: issuedBy,
            receivedBy: receivedBy,
          },
        }
      );
      console.log("Requisition status updated successfully:", res);
    } catch (error) {
      console.error("Error updating requisition status:", error);
    }
  }

  return {
    entityName,
    fundCluster,

    items,
    error,
    requisition,

    setRequisition,
    selectedRequisitions,

    page,
    pages,
    search,
    pageRange,
    requisitions,

    getRequisitions,
    getRequisitionReport,
    getRequisitionReportData,
    getRequisitionById,
    createRequistion,
    updateGenerateSerialNo,
    updateRequisitionStatus,
    updateForReviewStatus,
    updatePendingStatus,
    updateIssuedStatus,
    cancelRequisitionStatus,
  };
}
