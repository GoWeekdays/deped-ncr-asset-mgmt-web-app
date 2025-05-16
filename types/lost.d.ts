declare type DateString = string;
declare type StatusType = "lost" | "stolen" | "damaged" | "destroyed";
declare type YesNo = "yes" | "no";

declare type TLost = {
  _id: string;
  createdAt: string;
  entityName: string;
  fundCluster: string;
  officeId: string;
  officeName: string;
  officerName: string;
  officerDesignation: string;
  lossNo: string;

  officerId: string;
  lossStatus: StatusType;
  status: string;
  issueSlipNo: string;
  issueSlipDate: DateString;
  policeNotified: YesNo;
  policeStation: string;
  policeReportDate: DateString;
  circumstances: string;
  attachment: string;
  stockNumber: string;
  description: string;
  cost: number;
  officerDate: DateString;
  supervisorId: string;
  supervisorName: string;
  supervisorDesignation: string;
  supervisorDate: DateString;
  governmentId: string;
  governmentIdNo: string;
  governmentIdDate: DateString;
  docNo: string;
  pageNo: string;
  bookNo: string;
  seriesOf: string;
  issuedAt: string;
  notaryPublic: string;
  itemStocks: Array<{
    itemNo: string;
    stockId: string;
  }>;
};

declare type TLostViewAll = Pick<TLostBase, "officeId"> & {
  _id: string;
  createdAt: string;
  lossNo: string;
  description: string;
  officeName: string;
};

declare type TLostViewSpecific = TLostBase & {
  officeName: string;
  officerName: string;
  officerDesignation: string;
  rlsddpNo: string;
  rlsddpDate: DateString;
  supervisorName: string;
  supervisorDesignation: string;
  supervisorDate: DateString;
  governmentIdDate: DateString;
};

declare type TLostCreate = {
  type: string;
  entityName: string;
  fundCluster: string;
  lossStatus: string;
  itemStocks: { stockId: string }[];
  policeNotified: string;
  policeStation: string;
  policeReportDate: string;
  attachment?: string;
  circumstances: string;
  governmentId: string;
  a;
  governmentIdNo: string;
  governmentIdDate: string;
};
