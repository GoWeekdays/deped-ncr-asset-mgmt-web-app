export default function useStock() {
  const modeOfAcquisition = ref([
    { title: "Procurement", value: "procurement" },
    { title: "Donation", value: "donation" },
    { title: "Transfer", value: "transfer" },
  ]);

  const procurementType = ref([
    { title: "PS-DBM", value: "ps-dbm" },
    { title: "Bidding", value: "bidding" },
    { title: "Quotation", value: "quotation" },
  ]);

  const { entityName, fundCluster } = useDefaults();

  const stock = useState(
    "Stock",
    (): TStock => ({
      _id: "",
      entityName: entityName.value,
      fundCluster: fundCluster.value,
      assetId: "",
      reference: "",
      attachment: "",
      ins: 0,
      outs: 0,
      office: "",
      balance: 0,
      qty: 0,
      itemNo: 0,
      unitOfMeasurement: [],
      numberOfDaysToConsume: 0,
      receivedBy: "",
      issuedBy: "",
      createdAt: "",
      cost: 0,
      modeOfAcquisition: "",
      procurementType: "",
      supplier: "",
      condition: "",
      receivedAt: "",
      officeId: "",
      issueSlipNo: "",
      remarks: "",
      serialNo: [],
    })
  );

  function setStock(value?: TStock) {
    if (!value) {
      value = {
        _id: "",
        entityName: entityName.value,
        fundCluster: fundCluster.value,
        assetId: "",
        reference: "",
        attachment: "",
        ins: 0,
        outs: 0,
        office: "",
        balance: 0,
        qty: 0,
        itemNo: 0,
        unitOfMeasurement: [],
        numberOfDaysToConsume: 0,
        receivedBy: "",
        issuedBy: "",
        createdAt: "",
        cost: 0,
        modeOfAcquisition: "",
        procurementType: "",
        supplier: "",
        condition: "",
        receivedAt: "",
        officeId: "",
        issueSlipNo: "",
        remarks: "",
        serialNo: [],
      };
    }

    stock.value._id = value._id;
    stock.value.entityName = value.entityName;
    stock.value.fundCluster = value.fundCluster;
    stock.value.assetId = value.assetId;
    stock.value.reference = value.reference;
    stock.value.attachment = value.attachment;
    stock.value.ins = value.ins;
    stock.value.outs = value.outs;
    stock.value.office = value.office;
    stock.value.balance = value.balance;
    stock.value.unitOfMeasurement = value.unitOfMeasurement;
    stock.value.numberOfDaysToConsume = value.numberOfDaysToConsume;
    stock.value.receivedBy = value.receivedBy;
    stock.value.issuedBy = value.issuedBy;
    stock.value.createdAt = value.createdAt;
    stock.value.cost = value.cost;
    stock.value.modeOfAcquisition = value.modeOfAcquisition;
    stock.value.procurementType = value.procurementType;
    stock.value.supplier = value.supplier;
    stock.value.condition = value.condition;
    stock.value.receivedAt = value.receivedAt;
    stock.value.itemNo = value.itemNo;
    stock.value.officeId = value.officeId;
    stock.value.issueSlipNo = value.issueSlipNo;
    stock.value.remarks = value.remarks;
    stock.value.serialNo = value.serialNo || [];
  }

  function createStock(stock: Partial<TStock>) {
    return useNuxtApp().$api<TKeyValuePair>("/api/stocks", {
      method: "POST",
      body: JSON.stringify(stock),
    });
  }

  function getStocksByAssetId({
    asset = "",
    page = 1,
    search = "",
    limit = 10,
  } = {}) {
    return useNuxtApp().$api<TKeyValuePair>(`/api/stocks/asset/${asset}`, {
      method: "GET",
      query: { page, search, limit },
    });
  }

  const page = useState("page", () => 0);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");

  const stocks = useState<Array<TStock>>("stocks", () => []);

  function createStockByBatch(
    { reference, attachment, officeId, items } = {} as {
      reference: string;
      attachment: string | null;
      officeId?: string;
      items: Array<TBatchItem>;
    }
  ) {
    const _items = items.map((i) => {
      return {
        id: i._id,
        qty: i.quantity,
        numberOfDaysToConsume: i.numberOfDaysToConsume ?? 0,
      };
    });

    const payload = {
      reference,
      attachment,
      officeId,
      items: _items,
    };

    return useNuxtApp().$api<TKeyValuePair>("/api/stocks/batch", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  function createIssueProperty(issue: {
    type: string;
    entityName: string;
    fundCluster: string;
    assetId: string;
    remarks: string;
    serialNo: string[];
    quantity: number;
    estimatedUsefulLife: number;
    receivedBy: string;
    issuedBy: string;
  }) {
    return useNuxtApp().$api<TStandardResponse>("/api/issue-slips", {
      method: "POST",
      body: JSON.stringify(issue),
    });
  }

  return {
    modeOfAcquisition,
    procurementType,
    createIssueProperty,
    stock,
    setStock,
    createStock,
    getStocksByAssetId,
    page,
    pages,
    pageRange,
    stocks,
    createStockByBatch,
  };
}
