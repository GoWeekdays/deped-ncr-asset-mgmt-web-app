declare type TWaste = {
  _id: string;
  createdAt: string;
  entityName: string;
  fundCluster: string;
  placeOfStorage: string;
  createdAt: string;
  status: string;
  certifiedCorrectName: string;
  disposalApprovedName: string;
  witnessToDisposalName: string;
  itemStocks: Array<{
    stockId: string;
    type: string;
    condition: string;
    assetId: string;
    name: string;
    stockNumber: string;
    quantity: number;
    unitOfMeasurement: string;
    description: string;
  }>;
  certifiedByName: string;
  certifiedByDesignation: string;
  disposalApprovedByName: string;
  disposalApprovedByDesignation: string;
  witnessedBy: string;
  destroyedCount: number;
  soldAtPrivateSaleCount: number;
  soldAtPublicAuctionCount: number;
  transferredWithoutCostCount: number;
  witnessedByName: string;
  disposalApprovedBy: string;
  acquisitionCost: string;
  transferredTo?: string;
  remarks?: string;
};

// declare type TNewWaste = {
//   placeOfStorage: string;
//   itemStocks: Array<{
//     stockId: string;
//     type?: TWasteType;
//   }>;
//   entityName?: string;
//   fundCluster?: string;
//   status?: string;
//   certifiedBy?: string;
//   transferredTo?: string;
// };

declare type TWasteType =
  | "destroyed"
  | "sold-at-private-sale"
  | "sold-at-public-auction"
  | "transferred-without-cost";

declare type TStockWasteWithCond = {
  name: string;
  condition?: string;
  stockNumber: string;
  description: string;

  type: string;
  quantity: string;
  unitOfMeasurement: string;
  remarks: string;
  _id: string;
  transferredTo?: string;
  assetId?: string;
};

declare type TWasteCreate = {
  entityName: string;
  fundCluster: string;
  placeOfStorage: string;
  entityName: string;
  fundCluster: string;
  itemStocks: [
    {
      stockId: string;
      type: string;
      remarks: string;
      transferredTo: string;
    },
  ];
  certifiedBy: string;
};
