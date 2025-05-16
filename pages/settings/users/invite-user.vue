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
            <h4 class="text-h4 font-weight-regular">Invite User</h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              @click="setInviteDialog({ dialog: true })"
              color="primary"
              class="mr-2 text-button"
              prepend-icon="mdi-account-plus-outline"
            >
              Invite User
            </v-btn>
          </v-col>
        </v-row>

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
              @keydown.enter="_getInvitations(search)"
            />
          </v-col>
          <v-col cols="auto" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption">{{ pageRange }}</span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getInvitations(search)"
            />
          </v-col>
        </v-row>

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
        <v-dialog v-model="inviteDialog" max-width="500px">
          <v-card class="py-5 px-6 rounded-lg" elevation="2">
            <v-form v-model="isFormValid" @submit.prevent="submit">
              <v-row no-gutters align="center" justify="center">
                <v-col cols="12">
                  <span class="font-weight-regular text-h5"
                    >Invite a New User</span
                  >
                  <v-row class="mt-4">
                    <v-col>
                      <input-label for="forEmail" title="Email" />
                      <v-text-field
                        v-model="invitation.email"
                        type="email"
                        :rules="[requiredRule, emailRule]"
                        placeholder="johndoe@gmail.com"
                        variant="outlined"
                        dense
                        class="my-2" />

                      <input-label for="forUserType" title="Type" />
                      <v-select
                        v-model="invitation.userType"
                        :items="userTypes"
                        :rules="[requiredRule]"
                        variant="outlined"
                        dense
                        class="my-2 text-capitalize"
                        item-text="title"
                        item-value="value" />

                      <input-label for="userDivision" title="Division" />
                      <v-autocomplete
                        v-model="invitation.divisionId"
                        :item-props="divisionItemProp"
                        :items="divisions"
                        :loading="fetchingDivisions"
                        :disabled="isAdmin"
                        :rules="[requiredRule]"
                        variant="outlined"
                        placeholder="Select Division"
                        class="my-2 text-capitalize"
                        hide-no-data
                        hide-selected />

                      <label
                        for="userType"
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                      >
                        Office/Unit/Section
                      </label>

                      <v-autocomplete
                        v-model="invitation.officeId"
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
                    /></v-col>
                  </v-row>

                  <v-row class="justify-end pa-3">
                    <v-btn
                      color="primary"
                      type="submit"
                      :disabled="!isFormValid"
                      :loading="loading"
                    >
                      Send Invite
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      class="ml-3"
                      color="primary"
                      @click="setInviteDialog()"
                    >
                      Cancel
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-dialog>

        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="invitations"
            hide-default-footer
            :loading="loading"
            fixed-header
            style="max-height: calc(100vh - 64px - 250px); overflow-y: auto"
          >
            <template #item.createdAt="{ item }">
              {{ new Date(item.createdAt).toDateString().slice(4) }}
            </template>
            <template v-slot:item.email="{ item }">
              <span>{{ item.email }}</span>
            </template>

            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status || 'pending')"
                class="text-capitalize px-2"
                size="small"
              >
                <v-icon class="mr-2" size="12">{{
                  statusIcon(item.status || "pending")
                }}</v-icon>
                {{ item.status || "pending" }}
              </v-chip>
            </template>

            <template #item.createdAtS="{ item }">
              {{
                item.createdAt
                  ? new Date(item.createdAt).toDateString().slice(4)
                  : "N/A"
              }}
            </template>

            <template #item.userType="{ item }">
              <span class="text-capitalize">{{ item.userType }}</span>
            </template>

            <template #item.actions="{ item }">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon size="large" class="text-primary-text" v-bind="props">
                    mdi-dots-horizontal
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item
                    @click="
                      setResendInvitationDialog({ dialog: true, value: item })
                    "
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-pencil-outline</v-icon
                    >
                    Resend Invitation
                  </v-list-item>

                  <v-list-item
                    v-if="
                      String(item.status).trim().toLowerCase() !== 'cancelled'
                    "
                    @click="
                      setCancelInvitationDialog({ dialog: true, value: item })
                    "
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-trash-can-outline</v-icon
                    >
                    Cancel Invitation
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>

    <v-dialog v-model="resendInvitationDialog" max-width="400px">
      <v-card class="pa-8 rounded-lg" elevation="2">
        <v-card-title class="text-center mb-2">
          <v-avatar size="50" class="mx-auto">
            <v-icon size="32" color="secondary" class="icon-background">
              mdi-alert-outline
            </v-icon>
          </v-avatar>
        </v-card-title>

        <div class="text-center mb-7">
          <h2 class="text-h4 text-primary-text">Resend Invitation</h2>
        </div>

        <v-row class="text-center mb-2">
          <p class="text-subtitle-2 text-gray font-weight-regular">
            Are you sure you want to resend the invitation to
            <span class="font-weight-bold text-primary-text">{{
              selectedUserEmail
            }}</span>
            as a
            <span class="font-weight-bold text-primary-text">{{
              userType
            }}</span
            >?
          </p>
        </v-row>

        <v-row class="justify-center pa-4">
          <v-btn
            :disabled="isResending"
            color="primary"
            @click="confirmResend"
            class="mx-2"
          >
            {{ isResending ? "Resending..." : "Yes" }}
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            @click="closeResendDialog"
            class="mx-2"
          >
            Cancel
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- Cancel Dialog -->
    <v-dialog v-model="cancelInvitationDialog" max-width="400px">
      <v-card class="pa-8 rounded-lg" elevation="2">
        <!-- Icon with Circular Background -->
        <v-card-title class="text-center mb-2">
          <v-avatar size="50" class="mx-auto">
            <v-icon size="32" color="secondary" class="icon-background">
              mdi-alert-outline
            </v-icon>
          </v-avatar>
        </v-card-title>

        <div class="text-center my-1">
          <h2 class="text-h5 font-weight-bold text-primary-text">
            Cancel Invitation
          </h2>
        </div>

        <v-card-text class="text-center">
          <p class="text-subtitle-2 text-gray font-weight-regular">
            Are you sure you want to cancel the invitation to
            <span class="font-weight-bold text-primary-text">{{
              invitation?.email
            }}</span>
            ? This action cannot be undone.
          </p>
        </v-card-text>

        <!-- Action Buttons -->
        <v-row class="justify-center pa-4">
          <v-btn color="primary" @click="cancelInvitation()" class="mx-2">
            Confirm
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            @click="setCancelInvitationDialog({ dialog: false })"
            class="mx-2"
          >
            Cancel
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" });
defineProps();

usePageTitle("Invite Users");

const { getStatusColor, emailRule, requiredRule } = useUtils();
const adminTypes = ["admin", "admin-head"];

const isAdmin = computed(() => {
  return adminTypes.includes(invitation.value.userType);
});

const loading = ref(false);
const isFormValid = ref(true);
const inviteDialog = ref(false);

const {
  getInvitations,
  createInvitation,
  cancelInvitationById,
  resendInvite,
  invitations,
  invitation,
  setInvitation,
  search,
  page,
  pages,
  pageRange,
} = useInvite();

async function _getInvitations(search = "") {
  loading.value = true;

  const currentPage = page.value;

  try {
    const res = await getInvitations({ search, page: currentPage });
    invitations.value = res.items;
    pages.value = res.pages;
    pageRange.value = res.pageRange;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

_getInvitations();

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [
  { title: "Date Sent", value: "createdAt" },
  { title: "Email Address", value: "email" },
  { title: "Office", value: "officeName" },
  {
    title: "Division",
    value: "divisionName",
  },

  { title: "Status", value: "status", align: "center" },
  { title: "Role", value: "userType", align: "center" },
  { title: "Actions", value: "actions", align: "center" },
];

async function submit() {
  loading.value = true;
  const errorMessage = ref("");
  const errorDialog = ref(false);

  loading.value = true;
  try {
    delete invitation.value._id;
    delete invitation.value.createdAt;
    delete invitation.value.status;

    await createInvitation(invitation.value);
    setInviteDialog();
    closeDialog();
    _getInvitations(search.value);
  } catch (error: any) {
    errorMessage.value = error.data.message;
    errorDialog.value = true;
    console.error(error);
  } finally {
    loading.value = false;
  }
}

const { userTypes } = useUser();

const isResending = ref(false);
const resendInvitationDialog = ref(false);
const selectedUserEmail = ref("");
const userType = ref("");

function setResendInvitationDialog(
  {
    dialog = false,
    value,
  }: {
    dialog: boolean;
    value?: TInvitation;
  } = { dialog: false }
) {
  if (value) {
    invitation.value = {
      ...value,
      officeId: value.officeId,
      divisionId: value.divisionId,
    };

    selectedUserEmail.value = value.email;
    userType.value = value.userType;
  }

  resendInvitationDialog.value = dialog;
}

const confirmResend = async () => {
  isResending.value = true;
  try {
    await resendInvite(invitation.value);
    _getInvitations(search.value);
  } catch (error) {
    console.error("Error resending invitation:", error);
  } finally {
    isResending.value = false;
    closeResendDialog();
    _getInvitations();
  }
};

const closeResendDialog = () => {
  resendInvitationDialog.value = false;
};

const cancelInvitationDialog = ref(false);

function setCancelInvitationDialog(
  {
    dialog = false,
    value,
  }: {
    dialog: boolean;
    value?: TInvitation;
  } = { dialog: false }
) {
  if (value) {
    invitation.value = value;
  }
  cancelInvitationDialog.value = dialog;
}

const cancelInvitation = async () => {
  if (!invitation.value._id) {
    console.error("Cannot cancel invitation: ID is required");
    return;
  }

  try {
    await cancelInvitationById(invitation.value._id);
    _getInvitations(search.value);
  } catch (error) {
    console.error("Error canceling invitation:", error);
  } finally {
    setCancelInvitationDialog({ dialog: false });
  }
};

const statusIcon = (status: TInvitationStatus) => {
  switch (status) {
    case "pending":
      return "mdi-clock";
    case "accepted":
      return "mdi-check-circle";
    case "cancelled":
      return "mdi-cancel";
    default:
      return "mdi-help-circle";
  }
};

const { getOfficeTypes, offices } = useOfficeCodes();

function officeItemProps(i: TOffice) {
  return {
    title: i.name,
    value: i._id,
  };
}

const fetchingOffices = ref(false);

const division = computed(() => invitation.value.divisionId);

const _offices = computed(() =>
  offices.value.filter((i) => i.division === division.value)
);

async function _getOffices() {
  fetchingOffices.value = true;
  try {
    await getOfficeTypes({ type: invitation.value.userType });
  } catch (error) {
    console.error("Error fetching offices:", error);
  }
  fetchingOffices.value = false;
}

const { getDepedDivision, divisions } = useDivision();

function divisionItemProp(i: TDivision) {
  return {
    title: i.name,
    value: i._id as string,
  };
}
const fetchingDivisions = ref(false);

async function _getDepedDivision(search = "") {
  fetchingDivisions.value = true;
  try {
    await getDepedDivision({ limit: 20, search });
  } catch (error) {
    console.log(error);
  }
  fetchingDivisions.value = false;
}

const _userType = computed(() => invitation.value.userType);

watch(_userType, async (newType, oldType) => {
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
        await _getDepedDivision(divisionName);
      }
      const _division = divisions.value.find((i) =>
        i.name.toLowerCase().includes(divisionName)
      );
      invitation.value.divisionId = _division?._id || "";

      if (
        !offices.value.find((i) => i.name.toLowerCase().includes(officeName))
      ) {
        await _getOffices();
      }
      const _office = offices.value.find((i) =>
        i.name.toLowerCase().includes(officeName)
      );
      invitation.value.officeId = _office?._id || "";
    } catch (error) {
      console.error("Error setting default division/office:", error);
    }
  } else {
    invitation.value.divisionId = "";
    invitation.value.officeId = "";
    await _getDepedDivision();
    await _getOffices();
  }
});

function setInviteDialog(
  { dialog = false, value } = {} as { dialog: boolean; value: TInvitation }
) {
  inviteDialog.value = dialog;
  setInvitation(value);
  _getOffices();
  _getDepedDivision();
}

const closeDialog = () => {
  inviteDialog.value = false;
};

const activeFilter = ref("inviteUser");

async function updateFilter(status: string) {
  activeFilter.value = status;
}
</script>
