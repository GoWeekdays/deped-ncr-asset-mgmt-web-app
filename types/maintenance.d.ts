declare type TMaintenance = {
  _id: string;
  code: string;
  type: string;
  assetId: string;
  officeId: string;
  officeName: string;
  issue: string;
  status: string;
  createdAt: string;
  scheduledAt: string;
  maintenanceCode: string;
  assetName: string;
  assetDescription: string;
  assigneeId: string;
  assigneeName: string;
  assignee: string;
  attachment: string;
  rescheduleReason: string;
  remarks: string;
  completedBy: string;
  completedByName: string;
  name?: string;
};

declare type TMaintenanceCreate = {
  stockId: string;
  issue: string;
  assigneeId: string;
};

declare type TScheduleCreate = {
  type: string;
  scheduledAt: string;
  attachment: string;
};

declare type TReScheduleCreate = {
  scheduledAt: string;
  rescheduleReason: string;
};

declare type TCompleteCreate = {
  remarks: string;
  completedBy: string;
};
