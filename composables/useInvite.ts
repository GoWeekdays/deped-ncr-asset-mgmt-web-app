export default function useInvite() {
  const items: Ref<TInvitation[]> = useState("items", () => []);
  const invitations = useState<Array<TInvitation>>("invitations", () => []);
  const error = ref<string | null>(null);
  const status: Ref<string | null> = useState("status", () => null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");
  const search = useState("search", () => "");

  const invitation = useState<TInvitation>("invitation", () => {
    return {
      otp: "",
      _id: "",
      email: "",
      createdAt: new Date().toDateString().slice(4),
      userType: "",
      officeId: "",
      designation: "",
      officeName: "",
      divisionName: "",
      divisionId: "",
      status: "pending" as TInvitationStatus,
      menuOpen: false,
    };
  });

  function setInvitation(value?: TInvitation) {
    if (!value) {
      value = {
        _id: "",
        email: "",
        createdAt: new Date().toDateString().slice(4),
        userType: "",
        officeId: "",
        designation: "",
        officeName: "",
        divisionName: "",
        divisionId: "",
        status: "pending",
        menuOpen: false,
      };
    }

    invitation.value._id = value?._id || "";
    invitation.value.email = value?.email || "";
    invitation.value.createdAt =
      value?.createdAt || new Date().toDateString().slice(4);
    invitation.value.userType = value?.userType || "";
    invitation.value.designation = value?.designation || "";
    invitation.value.officeName = value?.officeName || "";
    invitation.value.divisionName = value?.divisionName || "";
    invitation.value.status = value?.status || "pending";
    invitation.value.menuOpen = value?.menuOpen || false;
    invitation.value.officeId = value?.officeId;
    invitation.value.divisionId = value?.divisionId;
  }

  const getInvitations = async ({
    search = "",
    page = 1,
    limit = 10,
  } = {}): Promise<TInvitePaginatedResponse> => {
    try {
      const response = await useNuxtApp().$api<TInvitePaginatedResponse>(
        "/api/users/otp-type/user-invite",
        {
          method: "GET",
          params: { search, page, limit },
        }
      );
      invitations.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching office   ";
      throw err;
    }
  };

  // function getInvitations({
  //   page = 1,
  //   search = "",
  //   limit = 10,
  //   division = "",
  //   office = "",
  // } = {}) {
  //   return useNuxtApp().$api<TInvitePaginatedResponse>(
  //     "/api/users/otp-type/user-invite",
  //     {
  //       method: "GET",
  //       query: { page, search, limit, division, office },
  //     }
  //   );
  // }

  function createInvitation(invitation: TInvitation) {
    return useNuxtApp().$api<TStandardResponse>("/api/users/user-invite", {
      method: "POST",
      body: JSON.stringify(invitation),
    });
  }

  async function resendInvite(invitation: TInvitation): Promise<void> {
    try {
      await useNuxtApp().$api("/api/users/user-invite", {
        method: "POST",
        body: JSON.stringify(invitation),
      });
      console.log("Invitation resent successfully");
    } catch (error) {
      throw error;
    }
  }

  async function cancelInvitationById(invitationId: string): Promise<void> {
    if (!invitationId) {
      console.error("Invitation ID is missing");
      return;
    }

    try {
      const res = await useNuxtApp().$api<TStandardResponse>(
        `/api/users/user-invite/cancelled/${invitationId}`,
        { method: "PUT" }
      );
    } catch (error) {
      console.error("Error cancelling invitation:", error);
    }
  }

  const { getUsers } = useUser();

  async function acceptUserInvite(params: {
    otp: string;
    title?: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
    designation: string;
    password: string;
    passwordConfirmation: string;
  }): Promise<void> {
    try {
      await useNuxtApp().$api("/api/users/user-invite/accepted", {
        method: "POST",
        body: JSON.stringify(params),
      });

      console.log("User invite accepted successfully");
      await getInvitations();
      await getUsers();
    } catch (error) {
      console.error("Error accepting user invite:", error);
      throw error;
    }
  }

  return {
    page,
    pages,
    pageRange,
    search,

    invitation,
    invitations,
    setInvitation,

    items,
    getInvitations,
    createInvitation,
    cancelInvitationById,
    acceptUserInvite,

    status,

    resendInvite,
  };
}
