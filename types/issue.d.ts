declare type TIssue = {
  _id: string;
  type?: string;
  assetId: string;
  entityName: string;
  fundCluster: string;
  description: string;
  unitOfMeasurement: string;
  cost: number;
  itemNo: string;
  quantity: number;
  issueSlipNo: string;
  estimatedUsefulLife: number;
  issuedBy: string;
  issuedByName: string;
  issuedByDesignation: string;
  receivedBy: string;
  receivedByName: string;
  receivedByDesignation: string;
  receivedAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalCost?: string;
};

declare type TIssueByReceiver = {
  officerDate: string;
  officeName: string;
  officerDesignation: string;
};

declare type TIssueRead = Pick<
  TIssue,
  "_id" | "issueSlipNo" | "receivedByName" | "status" | "createdAt"
>;
