<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text mb-5">
            <h4 class="font-bold text-h4 font-weight-regular">
              Requisition and Issue Slip
            </h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              :to="{ name: 'requisition-and-issue-slips-add-request' }"
              color="primary"
              class="pa-4 px-6 rounded-lg mr-2 d-flex text-capitalize align-center text-button font-weight-medium"
              prepend-icon="mdi-note-plus-outline"
              >Request
            </v-btn>
          </v-col>
        </v-row>

        <!-- Search and Pagination -->
        <v-row no-gutters justify="space-between" align="center">
          <v-col>
            <v-text-field
              v-model="search"
              placeholder="Search here..."
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              variant="outlined"
              class="text-body-2"
              style="max-width: 400px"
              rounded="lg"
              @keydown.enter="_getRequisitions(search)"
            />
          </v-col>
          <v-col cols="auto" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">{{ pageRange }}</span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getRequisitions(search)"
            />
          </v-col>
        </v-row>

        <v-col cols="12">
          <v-data-table
            v-model="selectedItems"
            :items="requisitions"
            :headers="headers"
            hide-default-footer
            item-value="_id"
            fixed-header
            :loading="loading"
            class="text-capitalize table-container overflow-y"
          >
            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status || '')"
                class="text-capitalize px-2 font-weight-regular"
                size="small"
              >
                <v-icon size="small" class="me-1">mdi-circle</v-icon>
                {{ item.status || "" }}
              </v-chip>
            </template>
            <template #item.action="{ item }">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon size="large" class="text-primary-text" v-bind="props"
                    >mdi-dots-horizontal</v-icon
                  >
                </template>
                <v-list>
                  <v-list-item
                    :to="{
                      name: 'requisition-and-issue-slips-preview-id',
                      params: { id: item._id },
                    }"
                  >
                    <v-list-item-title
                      ><v-icon size="medium" class="me-2"
                        >mdi-eye-outline</v-icon
                      >View</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    @click="evaluate(item)"
                    v-if="canEvaluate(item.status, item.requestedBy)"
                  >
                    <v-list-item-title
                      ><v-icon size="medium" class="me-2"
                        >mdi-bookmark-check-outline</v-icon
                      >Evaluate</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    @click="review(item)"
                    v-if="canReview(item.status)"
                  >
                    <v-list-item-title
                      ><v-icon size="medium" class="me-2"
                        >mdi-bookmark-check-outline</v-icon
                      >Review</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    @click="issued(item)"
                    v-if="canIssue(item.status, item.requestedBy)"
                  >
                    <v-list-item-title
                      ><v-icon size="medium" class="me-2"
                        >mdi-bookmark-check-outline</v-icon
                      >Issue</v-list-item-title
                    >
                  </v-list-item>
                  <v-list-item
                    v-if="isStatusAllowed(item)"
                    @click="
                      setCancelRequisitionDialog({
                        dialog: true,
                        value: item,
                      })
                    "
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-close-circle-outline</v-icon
                    >Cancel
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>

    <!-- Confirmation Dialogs -->
    <v-dialog :model-value="cancelRequisitionDialog" max-width="500" persistent>
      <v-card class="pa-8 rounded-lg" elevation="2">
        <v-row class="text-center my-1" align="center" justify="center">
          <h4 class="text-h4 text-primary-text">Confirm Cancel</h4>
        </v-row>
        <v-row class="text-center">
          <p class="text-subtitle-2 text-gray font-weight-regular">
            Are you sure you want to cancel the issuance request? Please provide
            a reason for canceling this request in the field below. No items
            will be issued if you confirm this action.
          </p>
        </v-row>

        <v-row class="pt-4">
          <v-textarea
            v-model="requisition.remarks"
            variant="outlined"
            density="compact"
            placeholder="Enter the reason for canceling this request (e.g., incorrect details, no longer needed)."
          ></v-textarea>
        </v-row>

        <v-row justify="center" align="center">
          <v-col cols="6">
            <v-btn
              block
              color="primary"
              @click="cancelRequisition()"
              class="mx-2"
              >Confirm</v-btn
            ></v-col
          >

          <v-col cols="6">
            <v-btn
              block
              color="primary"
              variant="outlined"
              @click="setCancelRequisitionDialog()"
              class="mx-2"
              >Close</v-btn
            ></v-col
          >
        </v-row>
      </v-card>
    </v-dialog>

    <!-- Evaluate Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="pa-9 rounded-lg" elevation="2">
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <h4 class="text-h4 text-primary-text">Evaluate Request</h4>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="auto">
            <p class="text-subtitle-2 text-center text-primary-text">
              Are you sure you want to start evaluating this request? Once
              confirmed, only you will have access to manage this request until
              completion.
            </p>
          </v-col>
        </v-row>
        <v-row justify="center" align="center">
          <v-col cols="6">
            <v-btn
              color="primary"
              class="py-5"
              @click="confirmSubmit"
              block
              :loading="isConfirming"
            >
              Confirm
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="fontgray"
              class="py-5"
              variant="outlined"
              @click="closeEvaluateDialog"
              block
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Requisition");

const { isAdmin, isPersonnel, isAdminHead, isOfficeChief, getStatusColor } =
  useUtils();

const {
  getRequisitions,
  pageRange,
  requisitions,
  pages,
  page,
  search,
  requisition,
  updateRequisitionStatus,
  cancelRequisitionStatus,
} = useRequisition();

const loading = ref(false);
const selectedItems = ref<Array<string>>([]);

const dialogItem = ref<any>(null);
const dialog = ref(false);

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [
  { title: "Date", value: "createdAt", align: "start" },
  { title: "Requested By", value: "requestedByName", align: "center" },
  { title: "RIS No.", value: "risNo", align: "center" },
  { title: "Status", value: "status", align: "center" },
  { title: "Action", value: "action", align: "center" },
];

async function _getRequisitions(search = "") {
  loading.value = true;

  try {
    const res = await getRequisitions({ search, page: page.value });
    pageRange.value = res.pageRange;
    pages.value = res.pages;

    requisitions.value = res.items.map((i) => {
      return {
        ...i,
        createdAt: i.createdAt
          ? new Date(i.createdAt).toDateString().slice(4)
          : "",
        data: {
          _id: i._id || "",
          status: i.status || "",
        },
      };
    });
  } catch (error) {
    console.error("Error fetching requisitions:", error);
  } finally {
    loading.value = false;
  }
}

const cancelRequisitionDialog = ref(false);

function setCancelRequisitionDialog(
  { dialog = false, value }: { dialog: boolean; value?: TRequisition } = {
    dialog: false,
  }
) {
  cancelRequisitionDialog.value = dialog;
  if (value) {
    requisition.value = value;
  }
}

const cancelRequisition = async () => {
  if (!requisition.value?._id) {
    console.error("Cannot cancel requisition: ID is required");
    return;
  }

  const status: TRequisitionStatus = "cancelled";
  const remarks = requisition.value.remarks || "";

  try {
    await cancelRequisitionStatus(requisition.value._id, status, remarks);
    _getRequisitions();
  } catch (error) {
    console.error("Error canceling requisition:", error);
  } finally {
    setCancelRequisitionDialog({ dialog: false });
  }
};

const openEvaluateDialog = (item: any) => {
  dialogItem.value = item;
  dialog.value = true;
};

const closeEvaluateDialog = () => {
  dialog.value = false;
};

// Confirm evaluation update status
const isConfirming = ref(false);
const { currentUser } = useLocalAuth();

function canEvaluate(value: string | undefined, requestee: string | undefined) {
  if (
    isAdmin.value &&
    currentUser.value &&
    requestee === currentUser.value._id
  ) {
    return false;
  }

  if (isPersonnel.value || isAdminHead.value || isOfficeChief.value) {
    return false;
  }
  return ["for-evaluation", "evaluating"].includes(String(value));
}

const confirmSubmit = async () => {
  const status: TRequisitionStatus = "evaluating";
  isConfirming.value = true;

  try {
    await updateRequisitionStatus(dialogItem.value._id, status);
    await useRouter().push({
      name: "requisition-and-issue-slips-evaluating-id",
      params: { id: dialogItem.value._id },
    });
  } catch (error) {
    console.error("Error updating requisition status:", error);
    isConfirming.value = true;
  }
};

function isStatusAllowed(item: TRequisition) {
  const excludedStatuses = ["cancelled", "issued"];
  const status = item?.status ?? "";
  return !excludedStatuses.includes(status);
}

function evaluate(value: TRequisition) {
  if (value.status === "for-evaluation") {
    openEvaluateDialog(value);
  } else {
    useRouter().push({
      name: "requisition-and-issue-slips-evaluating-id",
      params: { id: value._id },
    });
  }
}

// review function
function canReview(value: string | undefined) {
  return isAdminHead.value && value === "for-review";
}

function review(item: TRequisition) {
  if (item.status === "for-review") {
    useRouter().push({
      name: "requisition-and-issue-slips-review-id",
      params: { id: item._id },
    });
  } else if (item.status === "pending") {
    useRouter().push({
      name: "requisition-and-issue-slips-review-id",
      params: { id: item._id },
    });
  } else {
    useRouter().push({
      name: "requisition-and-issue-slips-review-id",
      params: { id: item._id },
    });
  }
}
// issued function

function canIssue(value: string | undefined, requestee: string | undefined) {
  if (
    isAdmin.value &&
    currentUser.value &&
    requestee === currentUser.value._id
  ) {
    return false;
  }

  return isAdmin.value && value === "pending";
}

function issued(item: TRequisition) {
  if (item.status === "for-evaluation") {
    useRouter().push({
      name: "requisition-and-issue-slips-evaluating-id",
      params: { id: item._id },
    });
  } else if (item.status === "pending") {
    useRouter().push({
      name: "requisition-and-issue-slips-issued-id",
      params: { id: item._id },
    });
  } else {
    useRouter().push({
      name: "requisition-and-issue-slips-review-id",
      params: { id: item._id },
    });
  }
}

_getRequisitions();
</script>

<style scoped>
.icon-background {
  background-color: rgba(63, 81, 181, 0.12);
}
</style>
