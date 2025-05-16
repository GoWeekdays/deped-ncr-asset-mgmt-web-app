declare type TOfficeProperty = {
  _id: string;
  officeName: string;
  officerName: string;
  officerEmail: string;
  divisionName: string;
  items: TItemStock[];
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalItemsOwned: string;
  pageRange: string;
  pages: number;
};

declare type TItemStock = {
  assetId: string;
  assetName: string;
  assetQuantity: number;
  ICS: string;
  personnel: string;
  issuedAt: string;
  status: string;
};
