export default function useUser() {
  const items: Ref<TUser[]> = useState("items", () => []);
  const users = useState<Array<TUser>>("users", () => []);
  const tab = ref(0);
  const error = ref<string | null>(null);
  const status: Ref<string | null> = useState("status", () => null);

  const page = useState("page", () => 1);
  const pages = useState("pages", () => 0);
  const pageRange = useState("pageRange", () => "-- - -- of --");
  const search = useState("search", () => "");

  const userTypes = ref([
    { title: "Admin Head", value: "admin-head" },
    { title: "Admin", value: "admin" },
    { title: "Office Chief", value: "office-chief" },
    { title: "Personnel", value: "personnel" },
  ]);

  const statuses = ["active", "suspended"];
  const user = useState<TUser>("user", () => ({
    _id: "",
    name: "",
    email: "",
    type: "",
    status: "active",
    fullName: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    userType: "",
    divisionId: "",
    divisionName: "",
    officeName: "",
    designation: "",
    officeId: "",
    attachment: "",
    oldPassword: "",
    newPassword: "",
    passwordConfirmation: "",
  }));

  function setUser(value?: TUser) {
    if (!value) {
      value = {
        _id: "",
        name: "",
        email: "",
        type: "",
        status: "pending",
        fullName: "",
        title: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        userType: "",
        divisionId: "",
        divisionName: "",
        officeName: "",
        designation: "",
        officeId: "",
        attachment: "",
        oldPassword: "",
        newPassword: "",
        passwordConfirmation: "",
      };
    }

    user.value._id = value?._id || "";
    user.value.email = value?.email || "";
    user.value.type = value?.type || "";
    user.value.status = value?.status || "pending";
    user.value.fullName = value?.fullName || "";
    user.value.title = value?.title || "";
    user.value.firstName = value?.firstName || "";
    user.value.middleName = value?.middleName || "";
    user.value.lastName = value?.lastName || "";
    user.value.suffix = value?.suffix || "";
    user.value.userType = value?.userType || "";
    user.value.designation = value?.designation || "";
    user.value.divisionName = value?.divisionName || "";
    user.value.officeName = value?.officeName || "";
    user.value.divisionId = value?.divisionId || "";
    user.value.officeId = value?.officeId || "";
    user.value.attachment = value?.attachment || "";
    user.value.oldPassword = value?.oldPassword || "";
    user.value.newPassword = value?.newPassword || "";
    user.value.passwordConfirmation = value?.passwordConfirmation || "";
  }

  const getUsers = async ({
    search = "",
    page = 1,
    limit = 10,
    division = "",
  } = {}): Promise<TUserPaginatedResponse> => {
    try {
      const response = await useNuxtApp().$api<TUserPaginatedResponse>(
        "/api/users",
        {
          method: "GET",
          params: { search, page, limit, division },
        }
      );
      users.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching office   ";
      throw err;
    }
  };

  async function getUserById(userId: string): Promise<TUser> {
    try {
      const response = await useNuxtApp().$api<TUser>(`/api/users/${userId}`, {
        method: "GET",
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  const getUserOfficeChiefById = async ({
    search = "",
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      const response = await useNuxtApp().$api<TUserPaginatedResponse>(
        `/api/users/role/office-chief`,
        {
          method: "GET",
          params: { search, page, limit },
        }
      );
      users.value = response.items;
      pages.value = response.pages;
      pageRange.value = response.pageRange;
      return response;
    } catch (err) {
      error.value = "Error fetching divisions";
      throw err;
    }
  };

  function updateUserById(userToUpdate?: TUser) {
    const userData = userToUpdate || user.value;
    return useNuxtApp().$api<TUser>(`/api/users/${userData._id}`, {
      method: "PUT",
      body: JSON.stringify({
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        type: userData.type,
        status: userData.status,
        fullName: userData.fullName,
        title: userData.title,
        firstName: userData.firstName,
        middleName: userData.middleName,
        lastName: userData.lastName,
        suffix: userData.suffix,
        designation: userData.designation,
        userType: userData.userType,
        divisionId: userData.divisionId,
        officeId: userData.officeId,
        attachment: userData.attachment,
      }),
    });
  }

  function deleteUserById(id: string) {
    return useNuxtApp().$api(`/api/users/${id}`, {
      method: "DELETE",
    });
  }

  return {
    items,
    tab,
    page,
    pages,
    pageRange,
    search,

    userTypes,
    statuses,

    user,
    setUser,
    getUsers,
    getUserById,
    getUserOfficeChiefById,
    updateUserById,
    deleteUserById,

    users,
    status,
  };
}
