<template>
  <v-row
    v-if="!isCreate"
    class=""
    justify="center"
    align="start"
    color="page-background-color  header-row"
  >
    <v-col cols="12" sm="10" md="12" lg="12">
      <v-card class="pa-6 position-relative rounded-lg">
        <!-- Header with Title and Buttons -->
        <v-row no-gutters>
          <v-row no-gutters>
            <!-- Back button -->
            <v-col cols="12" class="align-items-center mb-3 ml-5">
              <BackButton />
            </v-col>
          </v-row>

          <v-row no-gutters align="center" justify="space-between">
            <v-col cols="auto">
              <h4
                class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
              >
                {{ transferCreateTitle }}
              </h4>
            </v-col>

            <v-col cols="auto" v-if="isAdminHead && isApproving">
              <v-btn
                color="primary"
                class="text-button px-5"
                size="large"
                @click="updateApprovedStatus"
                min-width="200px"
                large
              >
                Approve
              </v-btn>
            </v-col>

            <v-col cols="auto" v-if="isAdmin && isCompleted">
              <v-btn
                color="primary"
                class="text-button px-5"
                size="large"
                @click="openTransferDialog"
                min-width="200px"
                large
              >
                Mark as Complete
              </v-btn>
            </v-col>
            <v-col
              cols="auto"
              v-if="isAdmin && transferProperty.status === 'completed'"
            >
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon size="large" class="text-primary-text" v-bind="props">
                    mdi-dots-horizontal
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item
                    :to="{
                      name: 'transfer-transfer-print-id',
                    }"
                    link
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-printer-outline</v-icon
                    >Print
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-row>

        <v-divider></v-divider>

        <v-row class="py-4">
          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Entity Name</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ transferProperty?.entityName }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Fund Cluster</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ transferProperty?.fundCluster }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              From Accountable Officer/Agency/Fund Cluster:
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ transferProperty?.from }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >PTR No.</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ transferProperty?.transferNo }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              To Accountable Officer/Agency/Fund Cluster:
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ transferProperty?.to }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Date</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{
                transferProperty?.createdAt
                  ? new Date(transferProperty.createdAt).toDateString().slice(4)
                  : ""
              }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Transfer Type</label
            >
            <div
              class="text-subtitle-1 text-primary-text text-capitalize font-weight-regular mt-1"
            >
              {{ transferProperty?.transferType }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <span class="text-fontgray font-weight-regular text-body-2"
              >Status</span
            >
            <div>
              <v-chip
                v-if="transferProperty?.status"
                :color="getStatusColor(transferProperty.status)"
                density="compact"
                class="text-capitalize text-caption font-weight-regular"
                small
              >
                <v-icon size="small" class="me-1">mdi-circle</v-icon>
                {{ transferProperty?.status }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-data-table
              :items="transferProperty?.itemStocks || []"
              :headers="headers"
              density="compact"
              hide-default-footer
              class="border-thin"
            >
              <template v-slot:item.cost="{ item }">
                ₱&nbsp;{{ formatNumber(item.cost) }}
              </template>
              <template #item.createdAt="{ item }">
                {{ new Date(item.createdAt).toDateString().slice(4) }}
              </template>

              <template #item.condition="{ item }">
                <v-chip
                  :color="getStatusColor(item.condition)"
                  density="compact"
                  class="text-capitalize text-caption font-weight-medium"
                  small
                >
                  {{ item?.condition }}
                </v-chip>
              </template>
            </v-data-table>
          </v-col>
          <v-divider class="pt-2"></v-divider>
        </v-row>

        <v-row
          class="my-5 text-primary-text"
          align="start"
          justify="space-between"
        >
          <!-- Approved By Section -->
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Approved By</label>
              </v-col>

              <template v-if="transferProperty?.approvedBy">
                <v-col cols="12" class="py-0">
                  <!-- Display Name -->
                  <div>
                    {{ transferProperty?.approvedByName || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <!-- Display Designation -->
                  <div class="text-caption text-capitalize">
                    {{ transferProperty?.approvedByDesignation || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <!-- Display Date -->
                  <div class="text-caption text-capitalize">
                    {{
                      transferProperty?.approvedAt
                        ? new Date(transferProperty.approvedAt)
                            .toDateString()
                            .slice(4)
                        : ""
                    }}
                  </div>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    Request is pending approval from the Admin Head. Please
                    wait.
                  </div>
                </v-col>
              </template>
            </v-row>
          </v-col>

          <!-- Released/Issued by Section -->
          <v-col cols="12" md="4" v-if="shouldShowIssuedSection">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Released/Issued by</label>
              </v-col>

              <template v-if="getDisplayContent('completed').showInfo">
                <v-col cols="12" class="py-0">
                  <div>{{ transferProperty?.issuedByName || "N/A" }}</div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption">Admin</div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    {{
                      transferProperty?.completedAt
                        ? new Date(transferProperty.completedAt)
                            .toDateString()
                            .slice(4)
                        : ""
                    }}
                  </div>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    {{ getDisplayContent("completed").message }}
                  </div>
                </v-col>
              </template>
            </v-row>
          </v-col>

          <!-- Received by Section -->
          <v-col cols="12" md="4" v-if="shouldShowReceivedSection">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Received by</label>
              </v-col>

              <template v-if="getDisplayContent('completed').showInfo">
                <v-col cols="12" class="py-0">
                  <div>{{ transferProperty?.receivedByName || "N/A" }}</div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    {{ transferProperty?.receivedByDesignation || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    {{
                      transferProperty?.completedAt
                        ? new Date(transferProperty.completedAt)
                            .toDateString()
                            .slice(4)
                        : ""
                    }}
                  </div>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    {{ getDisplayContent("completed").message }}
                  </div>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <v-row
    v-if="isCreate"
    class="py-5 fill-height"
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="11" md="12" lg="12">
      <v-row justify="center" align="start">
        <v-col cols="12">
          <v-card class="border-b-sm rounded-lg" elevation="1">
            <v-row class="py-5 px-5" align="center" justify="space-between">
              <v-col cols="auto" class="text-start text-primary-text">
                <h4
                  class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
                >
                  {{ transferCreateTitle }}
                </h4>
              </v-col>

              <v-col cols="auto" class="d-flex justify-end">
                <v-btn
                  color="primary"
                  class="me-2 text-button"
                  @click="submit()"
                  :loading="loading"
                  :disabled="!isFormValid"
                >
                  Submit
                </v-btn>

                <v-btn color="fontgray" variant="outlined" @click="goBack">
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card></v-col
        >
      </v-row>

      <v-form
        v-model="isValid"
        class="text-primary-text font-weight-medium text-subtitle-2"
        ref="generalInfoForm"
      >
        <v-row class="py-2" fill-height justify="center" align="start">
          <v-col cols="12" lg="12" md="12">
            <v-row dense>
              <v-col cols="12" lg="9" md="7" class="mb-4">
                <v-card class="pa-5 rounded-lg mb-4" elevation="3">
                  <v-row dense class="mt-2"> </v-row>
                  <v-row dense class="mt-2">
                    <label class="mb-1"
                      >To Accountable Office/Agency/Fund Cluster</label
                    >
                    <v-col cols="12">
                      <label
                        class="text-fontgray text-subtitle-2 font-weight-medium"
                        >School Division</label
                      >
                      <v-autocomplete
                        v-model="transferProperty.divisionId"
                        :items="_divisions"
                        variant="outlined"
                        density="compact"
                        :rules="[requiredRule]"
                        persistent-hint
                        :loading="loading"
                      />
                    </v-col>
                    <v-col cols="12">
                      <label
                        class="text-fontgray text-subtitle-2 font-weight-medium"
                        >School Name</label
                      >
                      <v-combobox
                        v-model="selectedSchool"
                        :items="_school"
                        v-model:search="search"
                        :hide-no-data="false"
                        :rules="[requiredRule]"
                        variant="outlined"
                        density="compact"
                        hide-selected
                        persistent-hint
                        small-chips
                        item-title="title"
                        item-value="value"
                        @update:model-value="handleSchoolSelection"
                      >
                        <template v-slot:no-data>
                          <v-list-item>
                            <v-list-item-title>
                              No results matching "<strong>{{ search }}</strong
                              >". Press <kbd>enter</kbd> to create a new one.
                            </v-list-item-title>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </v-col>
                  </v-row>
                  <v-row dense class="mt-2">
                    <v-col cols="12">
                      <label class="mb-1">Reason for Transfer</label>
                      <v-textarea
                        v-model="transferProperty.transferReason"
                        variant="outlined"
                        :rules="[requiredRule]"
                        density="compact"
                        class="mt-0"
                        s
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="pa-5 rounded-lg" elevation="3">
                  <label
                    for="itemInfo"
                    class="text-capitalize text-fontgray text-subtitle-2"
                  >
                    Manage Stock
                  </label>
                  <v-row class="mt-1" justify="center" align="start">
                    <v-col cols="12">
                      <v-form
                        v-model="isItemValid"
                        class="text-primary-text font-weight-medium text-subtitle-2"
                        ref="stockManagementForm"
                      >
                        <v-row dense align="center" justify="center">
                          <v-col cols="4">
                            <InputLabel
                              for="item"
                              title="Item / Property No."
                            />
                            <v-autocomplete
                              v-model="selectedItemNo"
                              :items="itemOptions"
                              item-value="value._id"
                              item-title="title"
                              item-disabled="disabled"
                              variant="outlined"
                              density="compact"
                              class="mt-0"
                              placeholder="Select an Item"
                              hide-no-data
                              hide-selected
                              :search="search"
                              @keydown.enter="_getAssetTransfer(search)"
                              @update:search="setSearch"
                              @update:modelValue="
                                setSelectedItem(selectedItemNo.value)
                              "
                              @change="onItemSelect"
                            />
                          </v-col>

                          <v-col cols="3">
                            <InputLabel for="condition" title="Condition" />
                            <v-select
                              v-model="selectedCondition"
                              :items="conditionOptions"
                              :loading="loading"
                              variant="outlined"
                              density="compact"
                              placeholder="Select Condition"
                              :disabled="itemOptions.length === 0"
                            />
                          </v-col>

                          <v-col cols="3">
                            <InputLabel for="itemNo" title="Item No." />
                            <v-autocomplete
                              v-model="itemNo"
                              :items="stockItemOptions"
                              variant="outlined"
                              density="compact"
                              class="mt-0"
                              placeholder="Select an Item"
                              hide-no-data
                              hide-selected
                              :search="search"
                              @change="onItemSelect"
                              item-value="_id"
                              item-title="itemNo"
                            />
                          </v-col>

                          <v-col cols="2">
                            <v-btn
                              block
                              class="py-5 mb-2"
                              color="primary"
                              @click="addItem"
                              :disabled="isAddButtonDisabled"
                              :class="{
                                'cursor-not-allowed': isAddButtonDisabled,
                              }"
                            >
                              Add To List
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-col>
                  </v-row>

                  <v-row dense class="mt-2">
                    <v-col cols="12">
                      <div
                        style="
                          max-height: calc(100vh - 320px);
                          overflow-y: auto;
                        "
                      >
                        <v-data-table
                          :headers="headers"
                          :items="items"
                          item-value="stockNumber"
                          class="text-primary-text border-thin text-capitalize"
                          density="compact"
                          fixed-header
                          hide-default-footer
                          dense
                        >
                          <template #item.createdAt="{ item }">
                            {{
                              item.createdAt
                                ? new Date(item.createdAt)
                                    .toDateString()
                                    .slice(4)
                                : "N/A"
                            }}
                          </template>

                          <template v-slot:item.cost="{ item }">
                            ₱&nbsp;{{ formatNumber(item.cost) }}
                          </template>

                          <template #item.condition="{ item }">
                            <v-chip
                              :color="
                                getStatusColor(item.condition || 'default')
                              "
                              size="small"
                              class="font-weight-medium"
                            >
                              {{ item.condition || "N/A" }}
                            </v-chip>
                          </template>

                          <!-- Actions Slot -->
                          <template #item.actions="{ item, index }">
                            <v-row
                              align="center"
                              justify="center"
                              class="pa-0 ma-0"
                            >
                              <v-col>
                                <v-icon
                                  @click="removeItem(index)"
                                  color="text-primary-text"
                                  style="cursor: pointer"
                                >
                                  mdi-minus-box-outline
                                </v-icon>
                              </v-col>
                            </v-row>
                          </template>

                          <!-- Custom No Data Slot -->
                          <template #no-data>
                            <div
                              class="text-center py-3 text-primary-text text-subtitle-2"
                            >
                              There are no items in the stock list. Click 'Add
                              to List' to get started.
                            </div>
                          </template>
                        </v-data-table>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12" lg="3" md="5" class="mb-4">
                <v-card class="pa-5 rounded-lg" elevation="3">
                  <v-row dense class="mt-2">
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col cols="12">
                          <InputLabel for="selectType" title="Select Type" />
                        </v-col>
                        <v-col cols="12">
                          <v-radio-group
                            v-model="selectedType"
                            column
                            :rules="[requiredRule]"
                          >
                            <v-radio
                              label="Donation"
                              value="donation"
                            ></v-radio>
                            <v-radio
                              label="Relocate"
                              value="relocate"
                            ></v-radio>
                            <v-radio
                              label="Reassignment"
                              value="reassignment"
                            ></v-radio>
                            <v-radio label="Others" value="others"></v-radio>
                          </v-radio-group>

                          <v-text-field
                            v-if="selectedType === 'others'"
                            label="Please specify"
                            v-model="otherDetails"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>

  <v-dialog v-model="transferDialog" width="500">
    <v-card class="rounded-lg pa-4">
      <v-col cols="12" class="pb-5">
        <v-row justify="start">
          <span class="font-weight-regular text-h5">Receive By</span>
        </v-row>
      </v-col>

      <v-form v-model="valid" @submit.prevent="updateCompleteStatus">
        <v-row no-gutters>
          <!-- Name Field -->
          <v-col cols="12" class="mt-2">
            <InputLabel for="schoolName" title="Name" />
            <v-text-field
              v-model="transferProperty.receivedByName"
              variant="outlined"
              density="compact"
              :rules="[requiredRule]"
              persistent-hint
            />
          </v-col>

          <!-- Designation Field -->
          <v-col cols="12" class="mt-2">
            <InputLabel for="schoolDivision" title="Designation" />
            <v-text-field
              v-model="transferProperty.receivedByDesignation"
              variant="outlined"
              density="compact"
              :rules="[requiredRule]"
              persistent-hint
            />
          </v-col>

          <!-- Error Message -->
          <v-col v-if="errorMessage" cols="12" class="pl-2">
            <span class="text-error">* {{ errorMessage }}</span>
          </v-col>

          <!-- Submit/Cancel Buttons -->
          <v-col cols="12" class="mt-2">
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn color="primary" block type="submit" :disabled="!valid">
                  Submit
                </v-btn>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn block @click="setTransferDialog()">Cancel</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  _id: { type: String, default: "" },
  mode: { type: String, default: "view" },
  id: { type: String },
});
const errorMessage = ref("");
const { getStatusColor, isAdminHead, isAdmin, goBack, requiredRule } =
  useUtils();

const isRead = computed(() => props.mode === "view");
const isApproving = computed(() => props.mode === "approving");
const isCompleted = computed(() => props.mode === "complete");
const isCreate = computed(() => props.mode === "create");

const id = computed(() => {
  return !isCreate.value ? (useRoute().params.id as string) || "" : "";
});

const {
  transferProperty,
  isProperty,
  isInventory,
  getTransferById,
  transferCreateTitle,
  updateTransferApproveStatus,
  updateTransferCompleteStatus,
  createTransfer,
} = useTransfer();

const headers = computed(() => {
  const items: Array<{
    title: string;
    value: string;
    align?: string;
    width?: string;
  }> = [];

  if (isInventory.value && !isCreate.value) {
    items.push(
      { title: "Date Acquired", value: "createdAt", align: "center" },
      { title: "Item No", value: "itemNo", align: "center" },
      { title: "ICS No", value: "reference", align: "center" },
      { title: "Description", value: "description", align: "start" },
      { title: "Amount", value: "cost", align: "center" },
      { title: "Condition of Inventory", value: "condition", align: "center" }
    );
  }

  if (isProperty.value && !isCreate.value) {
    items.push(
      { title: "Date Acquired", value: "createdAt", align: "center" },
      { title: "Property No", value: "stockNumber", align: "center" },
      { title: "Description", value: "description", align: "start" },
      {
        title: "Unit of Measurement",
        value: "unitOfMeasurement",
        align: "center",
      },
      { title: "Amount", value: "cost", align: "center" }
    );
  }

  if (isCreate.value) {
    items.push(
      { title: "Date Acquired", value: "createdAt", align: "start" },
      {
        value: "reference",
        title: isInventory.value
          ? "ICS No"
          : isProperty.value
            ? "PAR No"
            : "Reference No.",
        align: "center",
      },

      {
        value: "itemNo",
        title: isInventory.value
          ? "Item No"
          : isProperty.value
            ? "Item No"
            : "Reference No.",
        align: "center",
      },
      { title: "Description", value: "description" },
      { title: "Amount", value: "cost", width: "140px" },
      {
        value: "condition",
        title: isInventory.value
          ? "Condition of Inventory"
          : isProperty.value
            ? "Condition of PPE"
            : "N/A",
        align: "center",
      },
      { title: "Actions", value: "actions", align: "center", width: "100px" }
    );
  }

  return items;
});

const _getTransferById = async () => {
  if (isCreate.value) {
    return;
  }

  try {
    const result = await getTransferById(id.value);
    transferProperty.value = {
      ...transferProperty.value,
      ...result,
      itemStocks:
        result.itemStocks?.map((item) => ({
          ...item,
          createdAt: item.createdAt
            ? new Date(item.createdAt).toDateString().slice(4)
            : "N/A",
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching transfer details:", error);
    transferProperty.value.itemStocks = [];
  }
};

_getTransferById();

const getDisplayContent = (type: string) => {
  switch (type) {
    case "received":
      return {
        showInfo: !!transferProperty?.value?.receivedBy,
        message: "Request is pending approval from the admin. Please wait.",
      };
    case "approved":
      return {
        showInfo: !!transferProperty?.value?.approvedBy,
        message: "Request is pending approval from the admin. Please wait.",
      };
    case "completed":
      return {
        showInfo: !!transferProperty?.value?.issuedBy,
        message: "Request is pending approval from the admin. Please wait.",
      };
    default:
      return { showInfo: false, message: "Unknown status" };
  }
};

const shouldShowIssuedSection = computed(() => {
  const status = transferProperty.value?.status;
  return status ? ["completed"].includes(status) : false;
});

const shouldShowReceivedSection = computed(() => {
  const status = transferProperty.value?.status;
  return status ? ["completed"].includes(status) : false;
});

const { currentUser } = useLocalAuth();

const updateApprovedStatus = async () => {
  if (!id || !currentUser.value?._id) {
    console.error("Missing transfer ID or current user information.");
    return;
  }

  const status: TTransferStatus = "approved";

  try {
    await updateTransferApproveStatus(id.value, currentUser.value._id, status);
    await goBack();
  } catch (error) {
    console.error("Failed to update transfer status:", error);
  }
};

const transferDialog = ref(false);

const openTransferDialog = () => {
  transferDialog.value = true;
};

const setTransferDialog = (value = false) => {
  transferDialog.value = value;
};

const valid = ref(false);

const updateCompleteStatus = async () => {
  if (!id || !currentUser.value?._id) {
    console.error("Missing transfer ID or current user information.");
    return;
  }

  const status: TTransferStatus = "completed";
  const { receivedByName, receivedByDesignation } = transferProperty.value;

  const issuedBy = currentUser.value._id;

  try {
    await updateTransferCompleteStatus(
      id.value,
      status,
      issuedBy,
      receivedByName || "",
      receivedByDesignation || ""
    );
    await goBack();
  } catch (error) {
    console.error("Failed to update transfer status:", error);
  }
};

const { search, getAssetByCondition, getStocksByCondition } = useAsset();

const { debounce, formatNumber } = useUtils();
const loading = ref(false);

const selectedType = ref("");
const otherDetails = ref("");

const selectedCondition = ref();
const isValid = ref(false);
const items = ref<Array<TStockWithCond>>([]);
const itemNo = ref();

const route = useRoute();
const assetId = route.params.id as string;

type TSearchItem = {
  title: string;
  value: TKeyValuePair;
};

const isItemValid = ref(false);

const selectedItemNo = ref();

const itemOptions = ref<Array<TSearchItem>>([]);
const stockItemOptions = ref<Array<TStockWithCond>>([]);
const conditionOptions = [
  { title: "Reissued", value: "reissued" },
  { title: "Good Condition", value: "good-condition" },
  { title: "Returned", value: "returned" },
];

function setSearch(value: string) {
  search.value = value;
}

const _getAssetTransfer = debounce(async (_search = "") => {
  if (!isCreate.value) return;

  try {
    const res = await getAssetByCondition({
      search: _search,
      limit: 20,
      type: isInventory.value ? "SEP" : isProperty.value ? "PPE" : "",
    });
    const _items = res.items;
    itemOptions.value = _items.map((i) => ({
      title: `${i.name}`,
      value: {
        _id: i._id,
        stockNumber: i.stockNumber,
        description: i.description,
        quantity: i.quantity,
        unitOfMeasurement: i.unitOfMeasurement,
      },
    }));
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
}, 300);

if (isCreate.value) {
  _getAssetTransfer();
}

const item = reactive<Partial<TAsset>>({
  _id: "",
  name: "",
  stockNumber: "",
  description: "",
  quantity: 0,
  unitOfMeasurement: "",
  article: "",
});

function setSelectedItem(value = {} as TAsset) {
  item._id = value._id ?? "";
  item.name = value.name ?? "";
  item.description = value.description ?? "";
  item.unitOfMeasurement = value.unitOfMeasurement ?? "";
  item.article = value.article ?? "";
  item.stockNumber = value.stockNumber ?? "";
  item.quantity = 1;
  item.numberOfDaysToConsume = value.numberOfDaysToConsume ?? 0;
}

const _getStocksByCondition = async (condition: "", assetId: "") => {
  if (!isCreate.value) return { items: [] };

  try {
    const res = await getStocksByCondition({ condition, assetId });
    return res;
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return { items: [] };
  }
};

const onItemSelect = (selectedItem: any) => {
  if (selectedItem) {
    selectedItemNo.value = selectedItem._id;
  } else {
    selectedItemNo.value = null;
  }
};

watch([selectedCondition, selectedItemNo], async ([condition, itemId]) => {
  if (!isCreate.value) return;

  if (condition && itemId) {
    loading.value = true;
    try {
      const res = await _getStocksByCondition(condition, itemId);
      stockItemOptions.value = res.items;
      itemNo.value = null;
    } catch (error) {
      console.error("Error fetching stock items:", error);
      stockItemOptions.value = [];
    } finally {
      loading.value = false;
    }
  } else {
    stockItemOptions.value = [];
  }
});

const addItem = () => {
  errorMessage.value = "";

  if (!selectedItemNo.value || !selectedCondition.value || !itemNo.value) {
    errorMessage.value = "Please select an item, condition, and item number";
    return;
  }

  const selectedStockItem = stockItemOptions.value.find(
    (stock) => stock._id === itemNo.value
  );

  if (!selectedStockItem) {
    errorMessage.value = "Selected item not found";
    return;
  }

  const itemExists = items.value.some(
    (item) => item._id === selectedStockItem._id
  );

  if (itemExists) {
    errorMessage.value = "This item has already been added";
    return;
  }

  items.value.push({
    ...selectedStockItem,
    condition: selectedCondition.value,
    createdAt: new Date().toISOString(),
    _id: selectedStockItem._id,
    reference: selectedStockItem.reference,
    description: selectedStockItem.description,
    cost: selectedStockItem.cost,
  });

  selectedItemNo.value = null;
  selectedCondition.value = null;
  itemNo.value = null;
  isItemValid.value = false;
};

const isAddButtonDisabled = computed(() => {
  return !selectedItemNo.value || !selectedCondition.value || !itemNo.value;
});

const removeItem = (index: number) => {
  items.value = items.value.filter((_, i) => i !== index);
};
const errorDialog = ref(false);

const selectedDivision = ref<{ value: string; title: string } | null>(null);

const { getSchoolDivisions } = useSchoolDivisions();

type TDivisionOptions = {
  title: string;
  value: string;
};

const _divisions = ref<Array<TDivisionOptions>>([]);

async function _getDivisions(search = "") {
  if (!isCreate.value) return;

  try {
    const res = await getSchoolDivisions({ limit: 20, search });
    _divisions.value = res.items.map((i) => ({
      title: i.name,
      value: i._id || "",
    }));
  } catch (error) {
    console.log(error);
  }
}

if (isCreate.value) {
  _getDivisions();
}

const { getSchools } = useSchool();

type TSchoolOptions = {
  title: string;
  value: string;
};

const selectedSchool = ref();

const _school = ref<Array<TSchoolOptions>>([]);

async function _getSchools(divisionId = "", search = "") {
  if (!isCreate.value) return;

  try {
    const res = await getSchools({ divisionId, limit: 20, search });
    _school.value = res.items.map((i) => ({
      title: i.name,
      value: i._id || "",
    }));
  } catch (error) {
    console.log(error);
  }
}

if (isCreate.value) {
  _getSchools();
}

const handleSchoolSelection = (newValue: any) => {
  if (typeof newValue === "string") {
    transferProperty.value.school = newValue;
  } else if (newValue && typeof newValue === "object") {
    transferProperty.value.school = newValue.value;
  } else {
    transferProperty.value.school = "";
  }
};

const isFormValid = computed(() => {
  if (!transferProperty.value.divisionId) return false;

  if (!transferProperty.value.school) return false;

  if (!transferProperty.value.transferReason?.trim()) return false;

  if (!selectedType.value) return false;

  if (selectedType.value === "others" && !otherDetails.value?.trim())
    return false;

  if (items.value.length === 0) return false;

  return true;
});

async function submit() {
  const transferType =
    selectedType.value === "others" ? otherDetails.value : selectedType.value;

  loading.value = true;

  try {
    const payload: TTransferCreate = {
      type: isInventory.value
        ? "inventory-transfer-report"
        : isProperty.value
          ? "property-transfer-report"
          : (() => {
              throw new Error("Invalid transfer type");
            })(),
      transferReason: transferProperty.value.transferReason,
      transferType,
      itemStocks: items.value.map((item) => ({ stockId: item._id! })),
      from: transferProperty.value.entityName,
      divisionId: String(transferProperty.value.divisionId),
      school: String(transferProperty.value.school),
    };

    await createTransfer(payload);
    goBack();
  } catch (error) {
    errorDialog.value = true;
    errorMessage.value = "Failed to submit. Please try again.";
    console.error("Error in submission:", error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => transferProperty.value.divisionId,
  (newDivisionId) => {
    if (newDivisionId) {
      _getSchools(newDivisionId);
    } else {
      _school.value = [];
    }
  }
);

// const valid = computed(() => {
//   return (
//     selectedDivision.value !== null &&
//     selectedType.value &&
//     items.value.length > 0 &&
//     transferProperty.value.transferReason.trim() !== ""
//   );
// });
</script>
