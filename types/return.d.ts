declare type TReturn = {
  _id: string;
  entityName: string;
  fundCluster: string;
  createdAt: string;
  itemStocks: Array<{
    stockId: string;
    description: string;
    quantity: string;
    reference: string;
    endUser: string;
    remarks: string;
    stockRemarks: string;
  }>;

  returnNo: string;
  status: string;

  officeName: string;
  returnedByName: string;
  returnedBy: string;
  returnedByDesignation: string;
  receivedByName: string;
  receivedByDesignation: string;
  approvedBy: string;
  approveByName: string;
  approveByDesignation: string;
  approveAt: string;
  completedAt: string;
  approvedByName?: string;
  approvedByDesignation?: string;
  approvedAt?: string;
};

declare type TApproveReturn = {
  itemStocks: { stockId: string; stockRemarks: string }[];
  approvedBy: string;
};

declare type TCompleteReturn = {
  receivedBy: string;
};

declare type TReturnCreate = {
  type: string;
  itemStocks: { stockId: string }[];
  returnedBy: string;
};

declare type TStockReturnWithCond = {
  stockId: string;
  name: string;
  quantity: string;
  reference: string;
  endUser: string;
};

declare type TReturnInventory = {
  _id: string;
  name: string;
  stockNumber: string;
  cost: number;
  acquiredAt: string;
  quantity: number;
  totalCost: number;
  accumulatedDepreciation: number;
};
