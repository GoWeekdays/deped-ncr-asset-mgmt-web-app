declare type TPersonnelCard = {
  _id: string;
  email: string;
  type: string;
  status: string;
  attachment: string;
  name: string;
  officeName?: string;
  items: TPersonnelStockCard[];
  sepCount: string;
  ppeCount: string;
  pageRange: string;
  pages: number;
};

declare type TPersonnelStockCard = {
  assetId: string;
  assetName: string;
  officeName: string;
  condition: string;
  type: string;
  date: string;
  quantity: number;
  ICS: string;
  status: string;
};
