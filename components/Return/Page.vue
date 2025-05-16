<template>
  <v-row
    v-if="!isCreate"
    class="py-5 fill-height"
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-card class="pa-6 rounded-lg">
        <v-row no-gutters>
          <v-row no-gutters>
            <v-col cols="12" class="align-items-center mb-3 ml-5">
              <BackButton />
            </v-col>
          </v-row>

          <v-row no-gutters align="center" justify="space-between">
            <v-col cols="auto">
              <h4
                class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
              >
                {{ returnReadPageTitle }}
              </h4>
            </v-col>

            <v-col
              cols="auto"
              v-if="
                isAdminHead && isApproving && returned?.status !== 'approved'
              "
            >
              <v-btn
                color="primary"
                class="text-button px-5"
                size="large"
                @click="submitApprove()"
                min-width="200px"
                large
                :disabled="!hasValidRemarks"
              >
                Approve
              </v-btn>
            </v-col>

            <v-col
              cols="auto"
              v-if="isAdmin && isCompleted && returned?.status !== 'completed'"
            >
              <v-btn
                color="primary"
                class="text-button px-5"
                size="large"
                @click="submit()"
                min-width="200px"
                large
              >
                RECEIVED
              </v-btn>
            </v-col>

            <v-col
              cols="auto"
              v-if="isAdmin && returned.status === 'completed'"
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
                      name: 'return-returnedType-print-id',
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
          <v-col cols="12" md="4">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Entity Name</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ returned?.entityName }}
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Date</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ formattedDate(returned?.createdAt) }}
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <label class="text-fontgray text-body-2 font-weight-regular">
              RSSP No.
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ returned?.returnNo }}
            </div>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col cols="12">
            <v-data-table
              v-if="returned?.itemStocks?.length"
              :items="returned.itemStocks"
              :headers="headers"
              density="compact"
              hide-default-footer
              class="border-thin"
            >
              <template
                #item.stockRemarks="{ item }"
                v-if="isApproving && returned.status === 'pending'"
              >
                <v-col cols="12">
                  <v-select
                    v-model="stockRemarks[item.stockId]"
                    :items="remarkOptions"
                    variant="outlined"
                    density="compact"
                    placeholder="Select a remark"
                    :rules="[requiredRule]"
                  />
                </v-col>
              </template>

              <template #item.quantity="{ item }">
                <div class="text-caption text-capitalize">1</div>
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
          <v-col cols="12" lg="4">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Returned By</label>
              </v-col>

              <template v-if="returned?.returnedByName">
                <v-col cols="12" class="py-0">
                  <div>
                    {{ returned?.returnedByName || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption text-capitalize">
                    {{ returned?.returnedByDesignation || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <!-- Display Date -->
                  <div class="text-caption text-capitalize">
                    {{
                      returned?.createdAt
                        ? new Date(returned.createdAt).toDateString().slice(4)
                        : ""
                    }}
                  </div>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    Request is pending approval from the admin. Please wait.
                  </div>
                </v-col>
              </template>
            </v-row>
          </v-col>
          <v-col cols="12" lg="4">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Approved By</label>
              </v-col>

              <template v-if="returned?.approvedByName">
                <v-col cols="12" class="py-0">
                  <div>
                    {{ returned?.approvedByName || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption text-capitalize">
                    {{ returned?.approvedByDesignation || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <!-- Display Date -->
                  <div class="text-caption text-capitalize">
                    {{
                      returned?.approvedAt
                        ? new Date(returned.approvedAt).toDateString().slice(4)
                        : ""
                    }}
                  </div>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    Request is pending approval from the admin. Please wait.
                  </div>
                </v-col>
              </template>
            </v-row>
          </v-col>
          <v-col cols="12" lg="4">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Received By</label>
              </v-col>

              <template v-if="returned?.receivedByName">
                <v-col cols="12" class="py-0">
                  <div>
                    {{ returned?.receivedByName || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption text-capitalize">
                    {{ returned?.receivedByDesignation || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <!-- Display Date -->
                  <div class="text-caption text-capitalize">
                    {{
                      returned?.completedAt
                        ? new Date(returned.completedAt).toDateString().slice(4)
                        : ""
                    }}
                  </div>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    Request is pending approval from the admin. Please wait.
                  </div>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <v-row v-if="isCreate" class="fill-height" justify="center" align="center">
    <v-col cols="12" sm="12" md="11" lg="12">
      <v-row justify="center" align="start">
        <v-col cols="12">
          <v-card class="border-b-sm rounded-lg" elevation="1">
            <v-row class="pa-5" align="center" justify="space-between">
              <v-col cols="auto" class="text-start text-primary-text">
                <h4
                  class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
                >
                  {{ returnCreateTitle }}
                </h4>
              </v-col>

              <v-col cols="auto" class="d-flex justify-end">
                <v-btn
                  :loading="isLoading"
                  :disabled="isLoading"
                  color="primary"
                  class="me-2 text-button"
                  @click="submitCreateForm"
                >
                  <template #loader>
                    <v-progress-circular
                      indeterminate
                      color="white"
                      size="20"
                    />
                  </template>
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
        <v-row dense class="py-2" fill-height justify="center" align="start">
          <v-col cols="12" lg="12" md="12">
            <v-row dense>
              <v-col cols="12" lg="12" md="12" class="mb-4">
                <v-card class="pa-5 rounded-lg mb-4" elevation="3">
                  <v-row dense>
                    <v-col class="mb-4">
                      <p class="text-fontgray text-caption font-weight-regular">
                        {{ returnCreateSubtitle }}
                      </p>
                    </v-col>
                    <v-col cols="12">
                      <v-form
                        v-model="isItemValid"
                        class="text-primary-text font-weight-medium text-subtitle-2"
                        ref="stockManagementForm"
                      >
                        <v-row dense align="center" justify="center">
                          <v-col cols="6">
                            <InputLabel for="item" title="Property Name" />
                            <v-autocomplete
                              v-model="selectedItemNo"
                              :items="assets"
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

                          <v-col cols="4">
                            <InputLabel for="itemNo" title="Item No." />
                            <v-autocomplete
                              v-model="selectedStock"
                              :items="itemOptions"
                              variant="outlined"
                              density="compact"
                              placeholder="Select an Item No."
                              item-title="itemNo"
                              item-value="stockId"
                              :rules="[requiredRule]"
                              :disabled="!selectedItemNo"
                            />
                          </v-col>

                          <v-col cols="2">
                            <v-btn
                              block
                              class="py-5 mb-1"
                              color="primary"
                              @click="addItem()"
                              :disabled="!isItemValid"
                            >
                              Add To List
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-col>

                    <v-col cols="12" class="mt-2">
                      <v-data-table
                        :headers="headers"
                        :items="tableItems"
                        class="text-primary-text table-container border-thin text-capitalize"
                        density="compact"
                        fixed-header
                        hide-default-footer
                      >
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
                      </v-data-table>
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

  <DialogReturnSuccess
    :modelValue="showUpdateDialog"
    updateType="submission"
    @update:modelValue="showUpdateDialog = $event"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  _id: { type: String, default: "" },
  mode: { type: String, default: "view" },
  id: { type: String },
});

const errorMessage = ref("");
const { getStatusColor, isAdminHead, debounce, isAdmin, goBack, requiredRule } =
  useUtils();

const {
  returned,
  getReturnById,
  completeReturn,
  createReturn,
  getAssetReturnedItemNo,
  returnReadPageTitle,
  returnCreateTitle,
  returnCreateSubtitle,
  isReturnPPE,
  isReturnSEP,
  formattedDate,
  approveReturn,
} = useReturn();

const isRead = computed(() => props.mode === "view");
const isApproving = computed(() => props.mode === "approve");
const isCompleted = computed(() => props.mode === "complete");
const isCreate = computed(() => props.mode === "create");

const id = computed(() => {
  return !isCreate.value ? (useRoute().params.id as string) || "" : "";
});

const _getReturnById = async () => {
  try {
    const result = await getReturnById(id.value);
    const formattedItemStocks = result.itemStocks.map((item: any) => ({
      stockId: item.stockId || "",
      description: item.description || "",
      quantity: item.quantity || "",
      reference: item.reference || "",
      endUser: item.endUser || "",
      remarks: item.remarks || "",
      stockRemarks: item.stockRemarks || "",
    }));

    returned.value = {
      ...returned.value,
      ...result,
      itemStocks: formattedItemStocks,
    };
  } catch (error) {
    console.error("Error fetching return details:", error);
  }
};

_getReturnById();

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [];

if (isCreate.value) {
  headers.push(
    { title: "Item Description", value: "name" },
    { title: "Quantity", value: "quantity", align: "center" },
    {
      title: isReturnSEP.value
        ? "ICS No"
        : isReturnPPE.value
          ? "PAR No"
          : "Reference No.",
      value: "reference",
      align: "center",
    },
    { title: "End User", value: "endUser", align: "center" },
    { title: "Actions", value: "actions", align: "center" }
  );
}

if (isRead.value || isCompleted.value || isApproving.value) {
  headers.push(
    { title: "Item Description", value: "description" },
    { title: "Quantity", value: "quantity", align: "center" },
    {
      title: isReturnSEP.value
        ? "ICS No"
        : isReturnPPE.value
          ? "PAR No"
          : "Reference No.",
      value: "reference",
      align: "center",
    },
    { title: "End User", value: "endUser", align: "center" },
    { title: "Remarks", value: "stockRemarks", align: "center" }
  );
}

const { currentUser } = useLocalAuth();

const hasValidRemarks = computed(() => {
  if (!returned.value?.itemStocks?.length) return false;

  const allItemsHaveRemarks = returned.value.itemStocks.every(
    (item) => stockRemarks.value[item.stockId]
  );

  return allItemsHaveRemarks;
});

const submitApprove = async () => {
  try {
    if (!returned.value || !id.value || !currentUser.value) return;

    const itemStocksWithRemarks = returned.value.itemStocks
      .filter((item) => stockRemarks.value[item.stockId])
      .map((item) => ({
        stockId: item.stockId,
        stockRemarks: stockRemarks.value[item.stockId],
      }));

    if (itemStocksWithRemarks.length === 0) {
      errorMessage.value = "Please add remarks for at least one item";
      return;
    }

    const payload: TApproveReturn = {
      itemStocks: itemStocksWithRemarks,
      approvedBy: currentUser.value._id,
    };

    await approveReturn(payload, id.value);

    returned.value = {
      ...returned.value,
    };

    errorMessage.value = "";

    await goBack();
  } catch (error: any) {
    console.error("Error approving return:", error);
    errorMessage.value =
      error?.response?.data?.message || "Error approving return";
  }
};
const submit = async () => {
  try {
    if (!returned.value || !id.value || !currentUser.value) return;

    const payload: TCompleteReturn = {
      receivedBy: currentUser.value._id,
    };

    await completeReturn(payload, id.value);

    returned.value = {
      ...returned.value,
    };

    errorMessage.value = "";

    await goBack();
  } catch (error) {
    console.error("Error scheduling maintenance:", error);
  }
};

const { getReturnAssetByCondition, search } = useAsset();

const loading = ref(false);
const cancelMaintenanceDialog = ref(false);
const maintenanceDialog = ref(false);
const isValid = ref(false);

const removeItem = (index: number) => {
  tableItems.value.splice(index, 1);
};
const isItemValid = ref(false);
const selectedItemNo = ref();
const selectedStock = ref<string | null>(null);
const stockRemarks = ref<{ [key: string]: string }>({});
const items = ref<TStockReturnWithCond[]>([]);
const itemOptions = ref<TStockReturnWithCond[]>([]);
const tableItems = ref<TStockReturnWithCond[]>([]);
const assets = ref<Array<TSearchItem>>([]);

type TSearchItem = {
  title: string;
  value: TKeyValuePair;
};

function setSearch(value: string) {
  search.value = value;
}

const _getAssetTransfer = debounce(async (_search = "") => {
  if (!isCreate.value) return;

  try {
    const res = await getReturnAssetByCondition({
      page: 1,
      search: _search,
      limit: 10,
      type: isReturnSEP.value ? "SEP" : isReturnPPE.value ? "PPE" : "",
    });
    const _items = res.items;
    assets.value = _items.map((item) => ({
      title: item.name,
      value: { _id: item._id },
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

async function _getAssetByItemNo(assetId: string) {
  try {
    const response = await getAssetReturnedItemNo({
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

const onItemSelect = async (selectedId: string | null) => {
  if (!selectedId) {
    itemOptions.value = [];
    return;
  }

  loading.value = true;
  try {
    const response = await _getAssetByItemNo(selectedId);
    itemOptions.value = response;
  } catch (error) {
    console.error("Error fetching stock items:", error);
    itemOptions.value = [];
  } finally {
    loading.value = false;
  }
};

watch([selectedItemNo], async ([assetId]) => {
  if (assetId) {
    await onItemSelect(assetId);
  } else {
    items.value = [];
  }
});

const remarkOptions = [
  { value: "for-reissue", title: "For Reissue" },
  { value: "for-disposal", title: "For Disposal" },
];

const addItem = () => {
  if (!selectedItemNo.value || !selectedStock.value) {
    errorMessage.value = "Please fill in all required fields.";
    return;
  }

  const selectedItem = itemOptions.value.find(
    (item) => String(item.stockId) === String(selectedStock.value)
  );

  if (selectedItem) {
    tableItems.value.push({
      stockId: selectedItem.stockId,
      name: selectedItem.name,
      quantity: "1",
      reference: selectedItem.reference,
      endUser: selectedItem.endUser,
    });

    selectedItemNo.value = null;
    selectedStock.value = null;
    isItemValid.value = false;
  } else {
    console.error("Selected item not found in itemOptions.");
  }
};

const showUpdateDialog = ref(false);
const isLoading = ref(false);

const submitCreateForm = async () => {
  const type = isReturnSEP.value ? "SEP" : isReturnPPE.value ? "PPE" : "";

  try {
    const payload = {
      type,
      itemStocks: tableItems.value.map((item) => ({
        stockId: item.stockId,
      })),
      returnedBy: currentUser.value?._id || "",
    };

    isLoading.value = true;
    await createReturn(payload);
    showUpdateDialog.value = true;

    await new Promise((resolve) => setTimeout(resolve, 3000));
    await goBack();

    console.log("Return created successfully.");
  } catch (error) {
    console.error("Error creating return:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
