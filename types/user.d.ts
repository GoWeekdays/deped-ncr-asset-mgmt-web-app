declare type TUser = {
  _id: string;
  name: string;
  email: string;
  type?: string;
  status: TUserStatus;
  fullName: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  userType: string;
  divisionId: string;
  designation: string;
  officeId: string;
  attachment?: string;
  divisionName: string;
  officeName: string;
  oldPassword?: string;
  newPassword?: string;
  passwordConfirmation?: string;
  type?: string;
};

declare type UserApiResponse = {
  items: TUser[];
  page: number;
  pages: number;
  pageRange: string;
};

declare type InvitationApiResponse = {
  items: TInvitation[];
  page: number;
  pages: number;
  pageRange: string;
};

declare type TInvitation = {
  _id?: string;
  otp?: string;
  email: string;
  createdAt: string;
  userType: string;
  designation: string;
  officeName: string;
  divisionName: string;
  divisionId: string;
  officeId: string;
  status?: TInvitationStatus;
  menuOpen?: boolean;
};

declare type TInvitationStatus = "pending" | "accepted" | "cancelled";
declare type TUserStatus = "active" | "suspended" | "pending";
declare type ResendCompletePayload = {
  success: boolean;
  email: string;
  error?: string;
};

declare type TResendUser = {
  user: string;
  userType: string;
};
