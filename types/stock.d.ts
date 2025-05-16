declare type TStock = {
  _id?: string;
  entityName: string;
  fundCluster: string;
  assetId: string;
  reference: string;
  attachment?: string;
  asset?: TAsset[];
  ins?: number;
  outs?: number;
  office?: string;
  balance?: number;
  qty?: number;
  unitOfMeasurement?: string[];
  receivedBy?: string;
  issuedBy?: string;
  numberOfDaysToConsume?: number;
  createdAt?: string;
  cost?: number;
  modeOfAcquisition?: string;
  procurementType?: string;
  totalCost?: string;
  supplier?: string;
  condition?: string;
  receivedAt: string;
  itemNo?: number;
  officeId?: string;
  issueSlipNo: string;
  remarks?: string;
  serialNo?: string[];
  description?: string;
  unitOfMeasurement?: string;
  isAvailable?: string;
  unitCost?: string;
};

declare type TIssueProperty = {
  assetId: string;
  qty: number;
  unitOfMeasurement: string;
  numberOfDaysToConsume?: number;
  receivedAt: string;
  reference?: string;
  receivedBy?: string;
  issuedBy: string;
  cost?: number;
  totalCost?: number;
};

declare type TStockWithCond = {
  condition?: string;
  cost: number;
  createdAt?: string;
  description: string;
  itemNo: string;
  name: string;
  _id: string;
  assetId?: string;
};

declare type TStockWaste = {
  name: string;
  stockNumber: string;
  unitOfMeasurement: string;
  description: string;
  type: string;
  itemNo: string;
  remarks: string;
  transferredTo: string;
};

declare type TIssueLoss = {
  issueSlipNo: string;
  issueSlipId: string;
  issuedAt: string;
  itemNo: string;
  stockId: string;
  stockNumber: string;
  description: string;
  cost: number;
  issuedAt: string;
};
