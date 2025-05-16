declare type TAssetOverviewDashboard = {
  totalAssets: number;
  totalAssetsInUse: number;
  totalAssetMaintenance: number;
  totalAssetsDisposed: number;
};

declare type TAssetChartDashboard = {
  totalConsumables: number;
  totalSEP: number;
  totalPPE: number;
};

declare type TPropertyDashboard = {
  sepConditions: {
    goodCondition: number;
    reissued: number;
    returned: number;
    forDisposal: number;
    transferred: number;
    lost: number;
    stolen: number;
    damaged: number;
    destroyed: number;
  };
  ppeConditions: {
    goodCondition: number;
    reissued: number;
    returned: number;
    forDisposal: number;
    transferred: number;
    lost: number;
    stolen: number;
    damaged: number;
    destroyed: number;
  };
};

declare type TRecentDashboard = {
  _id: string;
  condition: string;
  type?: string;
  status: string;
  name: string;
  createdAt: string;
};
