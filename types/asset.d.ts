declare type TPropNumAttrib = {
  year: string;
  propertyCode: string;
  serialNumber: string;
  location: string;
  quantity: string;
  counter: string;
};

declare type TAsset = {
  _id: string;
  entityName?: string;
  fundCluster: string;
  stockNumber?: string;
  reorderPoint?: string;
  name: string; // Item name, SEP (Semi-expandable property), PPE (Plant, Property, Equipment)
  description: string;
  type?: string; // consumable, SEP, PPE
  unitOfMeasurement: string;
  article: string;
  propNumAttrib: TPropNumAttrib;
  isAvailable?: string;
  cost: number;

  type: string; // consumable, SEP, PPE
  quantity?: number;
  createdAt: string;
  stock?: string;
  numberOfDaysToConsume: TStock | number;
  condition?: string;
  modeOfAcquisition?: string;
  procurementType?: string;
  supplier?: string;
  officeId?: string;
  goodCondition: number;
  reissued: number;
  returned: number;
  transferred: number;
  forDisposal: number;
  lost?: number;
  stolen?: number;
  damaged?: number;
  destroyed?: number;

  itemNo?: string;
  assetId: string;
};

declare type TConsumableCreate = {
  createdAt?: string;
  reorderPoint?: string;
  name: string;
  description: string;
  unitOfMeasurement: string;
  article: string;
  cost?: number;
};

type TStockWithAsset = TStock & {
  asset: Array<{
    _id: string;
    name: string;
    description: string;
    unitOfMeasurement: string;
    stockNumber: string;
  }>;
};

declare type TBatchItem = {
  _id: string;
  quantity: number;
  numberOfDaysToConsume?: number;
};

interface StockResponse {
  message: string;
}

declare type TCodes = {
  _id: string;
  code: string;
  name: string;
  email: string;
};

declare type ApiResponse = {
  items: TCodes[] | TOffice[] | TSchool[];
  pages: number;
  pageRange: string;
  assetCode?: TCodes;
  offices?: TOffice[];
  schools?: TSchool[];
};

declare type TAssetCode = {
  _id?: string;
  code: string;
  value: string;
  year?: number;
  email?: string;
  type?: string;
};

declare type TDivision = {
  _id?: string;
  name: string;
  email?: string;
  createdAt?: string;
  updateAt?: string;
  deletedAt?: string;
};

declare type TOffice = {
  officeId?: string;
  _id?: string;
  supervisorId: string;
  supervisorName?: string;
  name: string;
  value?: string;
  email: string;
  divisionId: string;
  division?: string;
};

declare type TCondition =
  | "returned"
  | "reissued"
  | "transfer"
  | "for-disposal"
  | "for-repair";
