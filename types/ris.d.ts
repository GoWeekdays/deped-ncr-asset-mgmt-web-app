declare type TRequisition = {
  _id?: string;
  entityName?: string;
  fundCluster?: string;
  divisionId?: string;
  officeId?: string;
  office?: string;
  rcc?: string;
  purpose?: string;
  risNo?: {
    year?: string;
    month?: string;
    day?: string;
    counter?: string;
  };
  risId?: string;
  remarks?: string;
  itemStocks: Array<{
    assetId: string;
    issueQty?: number;
    quantity?: number;
    requestQty?: number;
    unitOfMeasurement?: string;
    isAvailable?: string;
    remarks?: string;
    stockNumber?: string;
    description?: string;
  }>;
  requestedBy?: string;
  requestedByName?: string;
  requestedByDesignation?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedByDesignation?: string;
  issuedBy?: string;
  issuedByName?: string;
  issuedByDesignation?: string;
  receivedBy?: string;
  receivedByName?: string;
  receivedByDesignation?: string;
  status?: TRequisitionStatus;
  createdAt?: string;
  approvedAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  value?: string;
  completedAt?: string;
};

declare type TAssetWithRequest = TAsset & {
  requestQty?: number;
  issueQty?: number;
  remarks?: string;
};

declare type THeader = {
  title: string;
  value: string;
  width?: string;
  align?: string;
  key?: string;
};

declare type TRequisitionStatus =
  | "for-evaluation"
  | "evaluating"
  | "for-review"
  | "pending"
  | "issued"
  | "cancelled";

declare type TRequisitionReport = {
  _id: string;
  entityName: string;
  fundCluster: string;
  serialNo: string;
  itemStocks: {
    risNo: string;
    rcc: string;
    name: string;
    unitOfMeasurement: string;
    cost: number;
    stockNumber: string;
    assetId: string;
    issueQty: number;
  }[];
  createdAt: string;
};
