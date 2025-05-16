<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row class="pb-2" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4 class="font-bold text-h4 font-weight-regular">
              Maintenance Management
            </h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              v-if="isPersonnel || isOfficeChief"
              @click="openMaintenanceDialog"
              color="primary"
              class="mr-2 text-button"
              prepend-icon="mdi-note-plus-outline"
            >
              REQUEST MAINTENANCE
            </v-btn>
          </v-col>
        </v-row>

        <v-row no-gutters justify="space-between" align="center">
          <v-col cols="6">
            <v-text-field
              v-model="search"
              placeholder="Search here..."
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              variant="outlined"
              style="max-width: 400px"
              rounded="lg"
              @keydown.enter="_getMaintenances(search)"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getMaintenances(search)"
            />
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-col cols="12">
          <v-data-table
            :items="maintenances"
            :headers="headers"
            hide-default-footer
            item-value="_id"
            fixed-header
            :loading="loading"
            class="text-capitalize table-container overflow-y"
          >
            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                class="text-capitalize px-2"
                size="small"
              >
                <v-icon size="small" class="me-1">mdi-circle</v-icon>
                {{ item.status }}
              </v-chip>
            </template>

            <template #item.action="{ item }">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon size="large" class="text-primary-text" v-bind="props">
                    mdi-dots-horizontal
                  </v-icon>
                </template>
                <v-list>
                  <!-- :to="{ name: 'maintenance-card-id', params: { id: item._id
                    }, }" -->
                  <v-list-item v-if="canView(item)" :to="getViewLink(item)">
                    <v-icon size="medium" class="me-2">mdi-eye-outline</v-icon>
                    View
                  </v-list-item>
                  <v-list-item v-if="canSchedule(item)" :to="getSchedule(item)">
                    <v-icon size="medium" class="me-2"
                      >mdi-bookmark-check-outline</v-icon
                    >
                    Schedule
                  </v-list-item>
                  <v-list-item
                    v-if="canReschedule(item)"
                    @click="openreScheduleMaintenanceDialog(item)"
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-bookmark-check-outline</v-icon
                    >
                    Reschedule
                  </v-list-item>
                  <v-list-item v-if="canComplete(item)" :to="getComplete(item)">
                    <v-icon size="medium" class="me-2"
                      >mdi-bookmark-check-outline</v-icon
                    >
                    Complete
                  </v-list-item>
                  <v-list-item
                    v-if="canCancel(item)"
                    @click="
                      setCancelMaintenanceDialog({ value: item, dialog: true })
                    "
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-close-circle-outline</v-icon
                    >
                    Cancel
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>

    <!-- create maintenance dialog -->
    <v-dialog v-model="maintenanceDialog" width="400">
      <v-card class="pa-8 rounded-lg">
        <v-form v-model="valid" @submit.prevent="submit">
          <v-row no-gutters>
            <v-col cols="12" class="pb-5">
              <v-row justify="start">
                <span class="font-weight-regular text-h5">
                  Request Maintenance
                </span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-5">
              <InputLabel for="item" title="Item / Property No." />
              <v-autocomplete
                v-model="selectedItemNo"
                :items="assets"
                variant="outlined"
                density="compact"
                placeholder="Select an Item"
                item-value="value._id"
                item-title="title"
                :rules="[requiredRule]"
                @update:model-value="onItemSelect"
              />
            </v-col>

            <v-col cols="12" class="mt-2">
              <InputLabel for="itemNo" title="Item No." />
              <v-autocomplete
                v-model="selectedStock"
                :items="items"
                variant="outlined"
                density="compact"
                placeholder="Select an Item No."
                item-title="itemNo"
                item-value="_id"
                :rules="[requiredRule]"
                :disabled="!selectedItemNo"
              />
            </v-col>

            <v-col cols="12" class="mt-2">
              <InputLabel for="issue" title="Issue" />
              <v-textarea
                v-model="maintenance.issue"
                density="compact"
                variant="outlined"
                :rules="[requiredRule]"
                placeholder="Enter issue description"
              />
            </v-col>

            <v-col v-if="errorMessage" cols="12">
              <span class="text-error">{{ errorMessage }}</span>
            </v-col>

            <v-col cols="12" class="mt-6">
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn type="submit" color="primary" block :disabled="!valid">
                    Submit
                  </v-btn>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn block @click="closeMaintenanceDialog">Cancel</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- cancel maintenance dialog -->
    <v-dialog :model-value="cancelMaintenanceDialog" max-width="500" persistent>
      <v-card class="pa-8 rounded-lg" elevation="2">
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
            This action cannot be undone. The maintenance status will be changed
            to "Cancelled."
          </p>
        </v-card-text>
        <v-row class="justify-center pa-4">
          <v-btn
            color="primary"
            @click="cancelMaintenance(maintenance._id)"
            class="mx-2"
            >Cancel</v-btn
          >
          <v-btn
            color="primary"
            variant="outlined"
            @click="setCancelMaintenanceDialog()"
            class="mx-2"
          >
            Close
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>

    <!-- reschedule maintenance dialog -->
    <v-dialog v-model="reScheduleMaintenanceDialog" width="600">
      <v-card class="pa-2 rounded-lg">
        <v-form v-model="valid" @submit.prevent="submitReschedule">
          <v-row no-gutters class="pa-8">
            <v-col cols="12" class="pb-5">
              <v-row justify="start">
                <span class="font-weight-regular text-h5">
                  Reschedule Maintenance
                </span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-5">
              <InputLabel for="type" title="Maintenance Date" />
              <v-text-field
                v-model="maintenance.scheduledAt"
                type="date"
                density="compact"
                variant="outlined"
                :rules="[requiredRule]"
                placeholder="Enter issue description"
              />
            </v-col>

            <v-col cols="12" class="mt-1">
              <InputLabel for="remarks" title="Reason for Rescheduling" />
              <v-text-field
                v-model="maintenance.rescheduleReason"
                density="compact"
                variant="outlined"
                :rules="[requiredRule]"
                placeholder="Enter remarks"
              />
            </v-col>

            <v-col v-if="errorMessage" cols="12">
              <span class="text-error">{{ errorMessage }}</span>
            </v-col>

            <v-col cols="12" class="mt-5">
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn type="submit" color="primary" block :disabled="!valid">
                    Submit
                  </v-btn>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn block @click="closereScheduleMaintenanceDialog"
                    >Cancel</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Maintenances");

const {
  getMaintenances,
  pageRange,
  maintenances,
  getAssetItemNo,
  pages,
  page,
  search,
  maintenance,
  cancelMaintenanceById,
  createMaintenance,
  reScheduleMaintenance,
} = useMaintenance();

const {
  isPersonnel,
  isOfficeChief,
  isAdmin,
  requiredRule,
  debounce,
  getStatusColor,
} = useUtils();
const { currentUser } = useLocalAuth();
const { getAssetMaintenanceByCondition } = useAsset();

interface ItemNo {
  _id: string;
  itemNo: string;
}

// State refs
const loading = ref(false);
const cancelMaintenanceDialog = ref(false);
const maintenanceDialog = ref(false);
const valid = ref(false);
const errorMessage = ref("");
const selectedItemNo = ref<string | null>(null);
const selectedStock = ref<string | null>(null);
const items = ref<ItemNo[]>([]);
const assets = ref<(TAsset | TSearchItem)[]>([]);

// Constants
const headers = [
  { title: "Item", value: "name" },
  { title: "Office", value: "officeName" },
  { title: "Issue", value: "issue" },
  { title: "Maintenance Date", value: "scheduledAt" },
  { title: "Maintenance Type", value: "type" },
  { title: "Status", value: "status" },
  { title: "Action", value: "action" },
];

type TSearchItem = {
  title: string;
  value: TKeyValuePair;
};

// Main functions
async function _getMaintenances(search = "") {
  loading.value = true;
  try {
    await getMaintenances({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching maintenances:", error);
  } finally {
    loading.value = false;
  }
}

const _getAssetTransfer = debounce(async ({ search = "" }) => {
  try {
    const res = await getAssetMaintenanceByCondition({
      page: 1,
      search,
      limit: 20,
    });
    assets.value = res.items.map((item) => ({
      title: item.name,
      value: item,
    }));
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
}, 300);

async function _getAssetByItemNo(assetId: string) {
  try {
    const response = await getAssetItemNo({
      assetId,
      page: 1,
      limit: 20,
      search: "",
    });
    return response.items;
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return [];
  }
}

// Dialog functions
function setCancelMaintenanceDialog({ value = null, dialog = false } = {}) {
  maintenance.value = value || ({ _id: "" } as TMaintenance);
  cancelMaintenanceDialog.value = dialog;
}

function openMaintenanceDialog() {
  maintenanceDialog.value = true;
}

function closeMaintenanceDialog() {
  maintenanceDialog.value = false;
}

// Action handlers
async function cancelMaintenance(id: string) {
  if (!id) {
    console.error("Maintenance ID is missing.");
    return;
  }
  try {
    await cancelMaintenanceById(id);
    setCancelMaintenanceDialog();
    _getMaintenances();
  } catch (error) {
    console.error("Error cancelling maintenance:", error);
  }
}

const onItemSelect = async (selectedId: string | null) => {
  if (!selectedId) {
    items.value = [];
    return;
  }

  loading.value = true;
  try {
    const response = await _getAssetByItemNo(selectedId);
    items.value = response;
  } catch (error) {
    console.error("Error fetching stock items:", error);
    items.value = [];
  } finally {
    loading.value = false;
  }
};

const submit = async () => {
  if (!valid.value || !selectedStock.value || !maintenance.value.issue) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  try {
    await createMaintenance({
      stockId: selectedStock.value,
      issue: maintenance.value.issue,
      assigneeId: currentUser.value?._id || "",
    });

    maintenance.value = { issue: "" } as TMaintenance;
    selectedItemNo.value = null;
    selectedStock.value = null;
    errorMessage.value = "";

    closeMaintenanceDialog();
    _getMaintenances();
  } catch (error) {
    console.error("Error creating maintenance:", error);
    errorMessage.value = "An error occurred while submitting the request.";
  }
};

watch([selectedItemNo], async ([assetId]) => {
  if (assetId) {
    await onItemSelect(assetId);
  } else {
    items.value = [];
  }
});

_getMaintenances();
_getAssetTransfer({});

const selectedMaintenanceId = ref<string>("");

const reScheduleMaintenanceDialog = ref(false);

function openreScheduleMaintenanceDialog(item: TMaintenance) {
  selectedMaintenanceId.value = item._id;
  maintenance.value = { ...item };
  reScheduleMaintenanceDialog.value = true;
}

function closereScheduleMaintenanceDialog() {
  selectedMaintenanceId.value = "";
  maintenance.value = {} as TMaintenance;
  reScheduleMaintenanceDialog.value = false;
}

const getViewLink = (item: TMaintenance) => ({
  name: "maintenance-view-id",
  params: { id: item._id },
});

const getSchedule = (item: TMaintenance) => ({
  name: "maintenance-schedule-id",
  params: { id: item._id },
});

const getComplete = (item: TMaintenance) => ({
  name: "maintenance-complete-id",
  params: { id: item._id },
});

const canView = (item: TMaintenance) => true;

const canSchedule = (item: TMaintenance) =>
  isAdmin.value &&
  item.status !== "scheduled" &&
  item.status !== "rescheduled" &&
  item.status !== "cancelled";

const canReschedule = (item: TMaintenance) =>
  isAdmin.value &&
  item.status !== "completed" &&
  item.status !== "pending" &&
  item.status !== "cancelled";

const canCancel = (item: TMaintenance) =>
  isAdmin.value && item.status == "pending";

const canComplete = (item: TMaintenance) =>
  (isPersonnel.value || isOfficeChief.value) &&
  item.status !== "pending" &&
  item.status !== "completed";

async function submitReschedule() {
  if (
    !selectedMaintenanceId.value ||
    !maintenance.value.scheduledAt ||
    !maintenance.value.rescheduleReason
  ) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  try {
    await reScheduleMaintenance(
      {
        scheduledAt: maintenance.value.scheduledAt,
        rescheduleReason: maintenance.value.rescheduleReason,
      },
      selectedMaintenanceId.value
    );

    // Reset form and close dialog
    maintenance.value = {} as TMaintenance;
    errorMessage.value = "";
    closereScheduleMaintenanceDialog();
    _getMaintenances();
  } catch (error) {
    console.error("Error rescheduling maintenance:", error);
    errorMessage.value =
      "An error occurred while rescheduling the maintenance.";
  }
}
</script>
