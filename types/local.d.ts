declare type TToken = {
  accessToken: string;
  refreshToken: string;
  id: string;
};

declare type TNavigationRoute = {
  name: string;
  params?: TKeyValuePair;
};

declare type TNavigationItem = {
  title: string;
  icon?: string;
  route?: TNavigationRoute;
  children?: TNavigationItem[];
  active?: boolean;
};

declare type TKeyValuePair<
  K extends string | number | symbol = string,
  V = any,
> = {
  [key in K]: V;
};

declare type TStandardResponse<
  K extends string | number | symbol = string,
  V = any,
> = {
  message?: string;
  data?: KeyValuePair<K, V>;
};

declare type TStandardPaginatedResponse = {
  items: TAsset[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TPropertyPrintPaginatedResponse = {
  items: TAsset[];
};

declare type TConsumablePrintPaginatedResponse = {
  items: TAsset[];
};

declare type TStockTransferPaginatedResponse = {
  items: TStockWithCond[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TStockWastePaginatedResponse = {
  items: TStockWaste[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TStockLossesPaginatedResponse = {
  items: TIssueLoss[];
};

declare type TIssueSlipsPaginatedResponse = {
  items: TIssue[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TDivisionPaginatedResponse = {
  items: TDivision[];
  type: string;
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TSchoolDivisionPaginatedResponse = {
  items: TSchoolDivision[];
  type: string;
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TOfficePaginatedResponse = {
  items: TOffice[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TOfficeResponse = {
  items: TOffice[];
};

declare type TTransferPaginatedResponse = {
  items: TTransfer[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TLostMaterialPaginatedResponse = {
  items: TLostBase[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TReturnPaginatedResponse = {
  items: TReturn[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TReturnInventoryPage = {
  items: TReturnInventory[];
};

declare type TWastePaginatedResponse = {
  items: TWaste[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TConfigurationPaginatedResponse = {
  items: TConfiguration[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TInvitePaginatedResponse = {
  items: TInvitation[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TUserPaginatedResponse = {
  items: TUser[];
  type: string;
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TRequisitionResponse = {
  items: TRequisition[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TRequisitionReportResponse = {
  items: TRequisition[];
};

declare type TMaintenanceResponse = {
  items: TMaintenance[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TRecentDashboardResponse = {
  recentActivities: TRecentDashboard[];
  totalItems: number;
  page: number;
  pages: number;
  pageRange: string;
};

declare type TFile = {
  name: string;
  data?: File;
};

declare type TSelectItem = {
  title: string;
  value: string;
};
