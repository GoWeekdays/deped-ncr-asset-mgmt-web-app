declare type TTransfer = {
  _id: string;
  type: string;
  entityName: string;
  fundCluster: string;
  transferNo: string;
  transferReason: string;
  transferType: string;
  completedAt: string;
  createdAt: string;
  itemStocks: Array<{
    _id: string;
    cost: number;
    itemNo: string;
    condition: string;
    type: string;
    createdAt: string;
    stockNumber: string;
    description: string;
    reference: string;
    amount: number;
    name?: string;
    divisionId?: string;
  }>;
  to?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedByDesignation?: string;
  approvedAt?: string;

  issuedBy?: string;
  issuedByName?: string;
  issuedByDesignation?: string;
  receivedBy?: string;
  receivedByName?: string;
  receivedByDesignation?: string;
  completedAt?;

  status?: TTransferStatus;
  createdAt?: string;
  updatedAt?: string;
  from: string;
  divisionId?: string;
  school: string;
  name?: string;
};

declare type TTransferRead = Pick<
  TTransfer,
  | "_id"
  | "entityName"
  | "fundCluster"
  | "transferReason"
  | "to"
  | "type"
  | "transferNo"
  | "transferType"
  | "status"
  | "createdAt"
  | "from"
  | "status"
  | "name"
>;

declare type TTransferStatus = "pending" | "approved" | "completed";

declare type TTransferCondition = "reissued" | "good-condition" | "returned";
declare type TAssetType = "SEP" | "PPE";

declare type TTransferPropertyType =
  | "inventory-transfer-report"
  | "property-transfer-report";

declare type TTransferCreate = {
  type: TTransferPropertyType;
  // entityName: string;
  // fundCluster: string;
  transferReason: string;
  transferType: string;
  itemStocks: { stockId: string }[];
  from: string;
  divisionId?: string;
  school?: string;
};
