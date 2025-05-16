<template>
  <v-row
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-4 responsive-card position-relative rounded-lg">
        <v-row class="pb-4" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4 class="text-h4 font-weight-regular">User List</h4>
          </v-col>
        </v-row>
        <!-- <Admin


        <AdminDashboardUserInvite
          :activeTab="tab"
          title="USER LISTS"
          :for="'user-list'"
          @update:activeTab="tab = $event"
        />
        <!-- Search and Pagination -->
        <v-row no-gutters justify="space-between" align="center">
          <v-col>
            <v-text-field
              v-model="search"
              class="text-body-2"
              placeholder="Search here..."
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              variant="outlined"
              style="max-width: 400px"
              rounded="lg"
              @keydown.enter="_getUsers(search)"
            />
          </v-col>
          <v-col cols="auto" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getUsers(search)"
            />
          </v-col>
        </v-row>

        <!-- filter buttons -->
        <v-row
          class="font-weight-medium rounded-md"
          no-gutters
          align="center"
          justify="start"
        >
          <v-btn
            class="px-10 py-6 me-3 rounded-lg d-flex justify-center align-center"
            :color="activeFilter === 'userList' ? 'primary' : undefined"
            :to="{ name: 'settings-users-user-list' }"
            :variant="activeFilter === 'userList' ? 'flat' : 'text'"
            @click="updateFilter('userList')"
          >
            USER LIST
          </v-btn>

          <v-btn
            class="px-10 py-6 me-3 rounded-lg d-flex justify-center align-center"
            :color="activeFilter === 'inviteUser' ? 'primary' : undefined"
            :to="{ name: 'settings-users-invite-user' }"
            :variant="activeFilter === 'inviteUser' ? 'flat' : 'text'"
            @click="updateFilter('inviteUser')"
          >
            INVITE USER
          </v-btn>
        </v-row>

        <!-- user table -->
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="users"
            hide-default-footer
            item-value="id"
            :loading="loading"
            fixed-header
            style="max-height: calc(100vh - 64px - 250px); overflow-y: auto"
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                class="text-capitalize px-2"
                size="small"
              >
                <v-icon size="small" class="me-1">mdi-circle</v-icon>
                {{ item.status }}
              </v-chip>
            </template>

            <template v-slot:item.type="{ item }">
              <span class="text-capitalize">{{ item.type }}</span>
            </template>

            <template #item.actions="{ item }">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon size="large" v-bind="props"
                    >mdi-dots-horizontal</v-icon
                  >
                </template>
                <v-list>
                  <v-list-item @click="editItem(item)">
                    <v-list-item-title>
                      <v-icon size="small" class="me-2"
                        >mdi-pencil-outline</v-icon
                      >
                      Edit
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="
                      setDeleteOfficeDialog({ dialog: true, value: item })
                    "
                  >
                    <v-list-item-title>
                      <v-icon size="small" class="me-2"
                        >mdi-delete-outline</v-icon
                      >
                      Delete
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>

    <!-- Modal Components -->
    <!-- <ModalUserDelete
      v-model:is-dialog-open="showDeleteDialog"
      :user-to-delete="selectedUser"
      @delete-user="confirmDeleteUser"
    /> -->
    <!-- <DialogUserUpdated
      v-model:show-success-modal="showSuccessModal"
      :user-email="selectedUser?.email"
    /> -->
  </v-row>
  <v-dialog v-model="codeDialog" max-width="800px" persistent>
    <v-card class="py-3 px-3 rounded-lg" elevation="2">
      <v-card-title>
        <v-row align="center" justify="space-between" class="w-100">
          <v-col>
            <span class="text-h5 font-weight-regular text-primary-text">
              Member Permission
            </span>
          </v-col>
          <v-icon
            @click="cancelEdit"
            size="20"
            style="cursor: pointer; position: absolute; top: 16px; right: 16px"
          >
            mdi-close
          </v-icon>
        </v-row>
      </v-card-title>

      <v-card-text v-if="!isEditing">
        <v-row align="center" justify="space-between" class="mb-2">
          <v-col cols="3" md="2">
            <ProfileAvatar
              :firstName="currentUser?.firstName"
              :lastName="currentUser?.lastName"
              :img-src="`${getOrigin()}/api/public/${currentUser?.attachment}`"
              size="90"
            />
          </v-col>
          <v-col cols="9" md="10">
            <v-btn color="primary" variant="outlined" @click="enableEditing"
              >Edit Profile</v-btn
            >
          </v-col>
        </v-row>

        <v-row align="center" justify="space-between">
          <v-col cols="12" md="6">
            <h4 class="text-h6 font-weight-regular">
              {{ user.title }} {{ user.firstName }} {{ user.middleName }}
              {{ user.lastName }} {{ user.suffix }}
            </h4>
            <h6 class="text-subtitle-2 text-medium-emphasis">
              {{ user.email }}
            </h6>
            <h6 class="text-subtitle-2 text-medium-emphasis text-capitalize">
              Role: {{ user.type || "N/A" }}
            </h6>
          </v-col>

          <v-col cols="auto">
            <v-chip
              :color="getStatusColor(user.status)"
              text-color="white"
              class="ma-1 text-capitalize"
            >
              <v-icon
                size="12"
                class="me-2"
                :style="{ color: getStatusColor(user.status) }"
              >
                mdi-circle
              </v-icon>
              {{ user.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-if="isEditing">
        <v-form ref="editForm">
          <v-row>
            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Title
              </label>

              <v-text-field
                id="title"
                v-model="user.title"
                outlined
                placeholder="Title"
                class="mt-0"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                First Name
              </label>
              <v-text-field
                id="firstName"
                v-model="user.firstName"
                outlined
                placeholder="First Name"
                class="mt-0"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Middle Name
              </label>

              <v-text-field
                id="middleName"
                v-model="user.middleName"
                outlined
                placeholder="Middle Name"
                class="mt-0"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Last Name
              </label>
              <v-text-field
                id="lastName"
                v-model="user.lastName"
                outlined
                placeholder="Last Name"
                class="mt-0"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Suffix
              </label>
              <v-text-field
                id="suffix"
                v-model="user.suffix"
                outlined
                placeholder="Suffix"
                class="mt-0"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Email
              </label>
              <v-text-field
                id="email"
                v-model="user.email"
                outlined
                type="email"
                class="mt-0"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <!-- Status selection -->
            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Status
              </label>
              <v-select
                id="status"
                v-model="user.status"
                :items="statuses"
                outlined
                placeholder="Status"
                class="mt-0 text-capitalize"
                variant="outlined"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Designation
              </label>
              <v-text-field
                id="designation"
                v-model="user.designation"
                outlined
                class="mt-0"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <!-- Role selection -->
            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Role
              </label>
              <v-select
                v-model="user.type"
                :items="userTypes"
                outlined
                placeholder="Select Role"
                class="mt-0 text-capitalize"
                variant="outlined"
                item-text="title"
                item-value="value"
              />
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Division
              </label>
              <v-autocomplete
                v-model="user.divisionId"
                :items="divisions"
                :item-props="divisionItemProp"
                :loading="fetchingDivisions"
                :readonly="isAdmin"
                :rules="[requiredRule]"
                variant="outlined"
                placeholder="Select Division"
                class="my-2 text-capitalize"
                hide-no-data
                hide-selected
              />
            </v-col>

            <v-col cols="12">
              <label
                class="text-subtitle-2 font-weight-medium text-primary-text"
                for="title"
              >
                Office/Unit/Section
              </label>
              <v-autocomplete
                v-model="user.officeId"
                :items="offices"
                :item-props="officeItemProps"
                :loading="fetchingOffices"
                :disabled="isAdmin"
                variant="outlined"
                dense
                placeholder="Select Office"
                class="my-2 text-capitalize"
                hide-no-data
                hide-selected
              />
            </v-col>

            <v-col cols="12" class="d-flex justify-end">
              <v-btn color="primary" @click="saveChanges">Save Changes</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteUserDialog" max-width="500" persistent>
    <v-card class="pa-5 rounded-lg" elevation="2">
      <v-card-title class="text-center mb-2">
        <v-avatar size="50" class="mx-auto">
          <v-icon size="32" color="secondary" class="icon-background"
            >mdi-alert-outline</v-icon
          >
        </v-avatar>
      </v-card-title>
      <div class="text-center my-1">
        <h2 class="text-h5 font-weight-bold text-primary-text">
          Are you sure?
        </h2>
      </div>
      <v-card-text class="text-center">
        <p class="text-subtitle-2 text-gray font-weight-regular">
          This action cannot be undone. All files associated with this field
          will be lost.
        </p>
      </v-card-text>

      <v-row class="justify-center pa-4">
        <v-btn color="primary" @click="deleteUser(user._id)" class="mx-2">
          Delete
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          @click="cancelDelete"
          class="mx-2"
        >
          Cancel
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});
defineProps();

usePageTitle("Users");

const loading = ref(false);

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
  width?: string;
}[] = [
  { title: "Email", value: "email" },
  { title: "Name", value: "name" },
  { title: "Office", value: "officeName" },
  { title: "Division", value: "divisionName" },
  { title: "Designation", value: "designation" },
  { title: "Role", value: "type" },
  { title: "Status", value: "status" },
  { title: "Actions", value: "actions", align: "center", width: "140" },
];

const {
  getUsers,
  updateUserById,
  getUserById,
  deleteUserById,
  setUser,
  userTypes,
  statuses,
  users,
  user,
  search,
  page,
  pages,
  pageRange,
} = useUser();

async function _getUsers(search: string = "") {
  loading.value = true;
  try {
    const res = await getUsers({ search, page: page.value });
    pageRange.value = res.pageRange;
    pages.value = res.pages;

    users.value = res.items.map((i) => {
      return {
        ...i,
        data: {
          id: i._id || "",
          name: i.name || "",
          email: i.email || "",
          designation: i.designation || "",
          type: i.type || "",
          status: i.status || "",
          officeName: i.officeName || "",
          divisionName: i.divisionName || "",
        },
      };
    });
    pageRange.value = res.pageRange || "-- - -- of --";
    pages.value = res.pages || 1;
  } catch (error) {
    throw error;
  } finally {
    loading.value = false;
  }
}

_getUsers();

const isDialogOpen = ref(false);
const isEditing = ref(false);

const codeDialog = ref(false);
const errorMessage = ref("");

const editedUser = ref({ ...user.value });

function setDialog({
  dialog = false,
  value,
}: { dialog?: boolean; value?: TUser } = {}) {
  codeDialog.value = dialog;

  if (value) {
    const divisionId = value.divisionId;
    const officeId = value.officeId;

    user.value = {
      ...value,
      divisionId,
      officeId,
    };
  } else {
    user.value = {
      _id: "",
      name: "",
      email: "",
      type: "user",
      status: "active",
      fullName: "",
      title: "",
      officeName: "",
      divisionName: "",
      designation: "",
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      userType: "",
      divisionId: "",
      officeId: "",
    };
  }

  errorMessage.value = value ? "" : "";
}

function closeModal() {
  codeDialog.value = false;
  isDialogOpen.value = false;
}

function enableEditing() {
  isEditing.value = true;
  editedUser.value = { ...user.value };
}

function cancelEdit() {
  isEditing.value = false;
  closeModal();
}

function cancelDelete() {
  deleteUserDialog.value = false;
}

async function saveChanges() {
  try {
    await updateUserById();
    setUser(editedUser.value);

    isEditing.value = false;
    isDialogOpen.value = false;
    codeDialog.value = false;

    _getUsers();
  } catch (error) {
    console.error("Failed to update user:", error);
    errorMessage.value = "Failed to update the user, please try again.";
  }
}

async function editItem(item: TUser) {
  try {
    const userData = await getUserById(item._id || "");
    if (!userData) {
      throw new Error("User data is missing");
    }

    await _getDivisions();
    await _getOffices();

    setDialog({ dialog: true, value: userData });
    isDialogOpen.value = true;
    editedUser.value = { ...userData };

    if (userData.divisionId) {
      user.value.divisionId = userData.divisionId;
    }
    if (userData.officeId) {
      user.value.officeId = userData.officeId;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    errorMessage.value = "Failed to fetch user data, please try again.";
  }
}

const { currentUser } = useLocalAuth();

const { debounce, requiredRule, getOrigin, getStatusColor } = useUtils();

const adminTypes = ["admin", "admin-head"];
const isAdmin = computed(() => adminTypes.includes(user.value.userType));

const { getDivisions, divisions } = useDivision();

function divisionItemProp(i: TDivision) {
  return {
    title: i.name,
    value: i._id as string,
  };
}
const fetchingDivisions = ref(false);
const _getDivisions = debounce(async (search = "") => {
  fetchingDivisions.value = true;
  try {
    await getDivisions({ limit: 20, search });
  } catch (error) {
    console.log(error);
  }
  fetchingDivisions.value = false;
}, 500);

const { getOfficeTypes, offices } = useOfficeCodes();

function officeItemProps(i: TOffice) {
  return {
    title: i.name,
    value: i._id,
  };
}

const fetchingOffices = ref(false);

const division = computed(() => user.value.divisionId);
const _offices = computed(() =>
  offices.value.filter((i) => i.division === division.value)
);

async function _getOffices() {
  fetchingOffices.value = true;
  try {
    await getOfficeTypes({ type: user.value.type });
  } catch (error) {
    console.error("Error fetching offices:", error);
  }
  fetchingOffices.value = false;
}

const _type = computed(() => user.value.type);

watch(_type, async (newType, oldType) => {
  if (newType === oldType) return;

  if (adminTypes.includes(newType)) {
    const divisionName = "administrative";
    const officeName = "property";

    try {
      if (
        !divisions.value.find((i) =>
          i.name.toLowerCase().includes(divisionName)
        )
      ) {
        await _getDivisions(divisionName);
      }
      const _division = divisions.value.find((i) =>
        i.name.toLowerCase().includes(divisionName)
      );
      user.value.divisionId = _division?._id || "";

      if (
        !offices.value.find((i) => i.name.toLowerCase().includes(officeName))
      ) {
        await _getOffices();
      }
      const _office = offices.value.find((i) =>
        i.name.toLowerCase().includes(officeName)
      );
      user.value.officeId = _office?._id || "";
    } catch (error) {
      console.error("Error setting default division/office:", error);
    }
  } else {
    user.value.divisionId = "";
    user.value.officeId = "";
    await _getDivisions();
    await _getOffices();
  }
});

const deleteUserDialog = ref(false);

function setDeleteOfficeDialog(
  { dialog = false, value } = {} as { dialog: boolean; value: TUser }
) {
  deleteUserDialog.value = dialog;
  if (value) {
    user.value = value;
  }
}

async function deleteUser(id?: string) {
  if (!id) {
    return;
  }

  try {
    await deleteUserById(id);
    await setDeleteOfficeDialog();
    await setUser();
    _getUsers();
  } catch (error) {
    console.error("Failed to delete office:", error);
  }
}

const activeFilter = ref("userList");

function updateFilter(status: string) {
  activeFilter.value = status;
}
</script>
