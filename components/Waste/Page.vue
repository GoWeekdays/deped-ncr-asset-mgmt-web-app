<template>
  <v-row
    v-if="!isCreate"
    class="py-5"
    fill-height
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-card class="pa-6 rounded-lg">
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
                Waste Material Report
              </h4>
            </v-col>

            <v-col cols="auto" v-if="isAdminHead && isApproving">
              <v-btn
                color="primary"
                class="text-button px-5"
                size="large"
                @click="openWasteDialog"
                min-width="200px"
                large
              >
                Approve
              </v-btn>
            </v-col>

            <v-col cols="auto" v-if="isAdmin && waste.status === 'completed'">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon size="large" class="text-primary-text" v-bind="props">
                    mdi-dots-horizontal
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item
                    :to="{
                      name: 'waste-and-losses-waste-materials-print-id',
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
              {{ waste?.entityName }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Fund Cluster</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ waste?.fundCluster }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              Place of Storage
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ waste?.placeOfStorage }}
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
                waste?.createdAt
                  ? new Date(waste.createdAt).toDateString().slice(4)
                  : "N/A"
              }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              Status
            </label>
            <div>
              <v-chip
                v-if="waste?.status"
                :color="getStatusColor(waste.status)"
                density="compact"
                class="text-capitalize text-caption font-weight-regular"
                small
              >
                <v-icon size="small" class="me-1">mdi-circle</v-icon>
                {{ waste?.status }}
              </v-chip>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-divider></v-divider>

          <v-col cols="12">
            <h6
              class="text-primary text-body-1 text-uppercase font-weight-regular pb-3"
            >
              Item for disposal
            </h6>
            <v-data-table
              :items="waste?.itemStocks || []"
              :headers="headers"
              density="compact"
              hide-default-footer
              class="border-thin"
            >
              <template v-slot:item.index="{ item, index }">
                {{ index + 1 }}
              </template>
              <template #item.type="{ item }">
                <span class="text-capitalize">{{ item.type }}</span>
              </template>
            </v-data-table>
          </v-col>
          <v-divider class="pt-2"></v-divider>
        </v-row>

        <v-row
          class="mt-5 text-primary-text"
          align="start"
          justify="space-between"
        >
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Certified Correct</label>
              </v-col>
              <v-col cols="12" class="py-0">
                <div>
                  {{ waste?.certifiedByName || "N/A" }}
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <!-- Display Designation -->
                <div class="text-caption text-capitalize">
                  Name of Supply and/or Property Custodian
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" lg="6">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Disposal Approved</label>
              </v-col>

              <template v-if="waste?.disposalApprovedByName">
                <v-col cols="12" class="py-0">
                  <!-- Display Name -->
                  <div>
                    {{ waste?.disposalApprovedByName || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <!-- Display Designation -->
                  <div class="text-caption text-capitalize">
                    Head of Agency/Entity or his/her Authorized Representative
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

        <v-row class="text-primary-text">
          <v-col cols="12">
            <h6 class="text-primary font-weight-regular text-h6">
              Certificate of Inspection
            </h6>
            <p class="text-body-2 font-weight-regular">
              I hereby certify that the property enumerated above was disposed
              as follows:
            </p>
          </v-col>
          <v-row class="ml-10 mb-2">
            <v-col cols="12">
              <label class="text-primary-text text-body-2 font-weight-regular"
                >Item
                <span class="text-primary font-weight-medium">{{
                  waste?.destroyedCount
                }}</span>
                Destroyed</label
              >
            </v-col>
            <v-col cols="12">
              <label class="text-primary-text text-body-2 font-weight-regular"
                >Item
                <span class="text-primary font-weight-medium">{{
                  waste?.soldAtPrivateSaleCount
                }}</span>
                Sold at private sale</label
              >
            </v-col>
            <v-col cols="12">
              <label class="text-primary-text text-body-2 font-weight-regular"
                >Item
                <span class="text-primary font-weight-medium">{{
                  waste?.soldAtPublicAuctionCount
                }}</span>
                Sold at public auction</label
              >
            </v-col>
            <v-col cols="12">
              <label class="text-primary-text text-body-2 font-weight-regular"
                >Item
                <span class="text-primary font-weight-medium">{{
                  waste?.transferredWithoutCostCount
                }}</span>
                Transferred without cost to: {{ waste?.transferredTo }}</label
              >
            </v-col></v-row
          >

          <v-divider class="pt-2"></v-divider>
        </v-row>

        <v-row
          class="mt-5 text-primary-text"
          align="start"
          justify="space-between"
        >
          <v-col cols="12" md="4">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Certified Correct</label>
              </v-col>
              <v-col cols="12" class="py-0">
                <div>
                  {{ waste?.certifiedByName || "N/A" }}
                </div>
              </v-col>
              <v-col cols="12" class="py-0">
                <!-- Display Designation -->
                <div class="text-caption text-capitalize">
                  Name of Inspection Officer
                </div>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" lg="6">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Witness Disposal </label>
              </v-col>
              <template v-if="waste?.witnessedByName">
                <v-col cols="12" class="py-0">
                  <div>
                    {{ waste?.witnessedByName || "N/A" }}
                  </div>
                </v-col>
                <v-col cols="12" class="py-0">
                  <div class="text-caption text-capitalize">
                    Name of Witness
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

  <v-row
    v-if="isCreate"
    class="py-5 fill-height"
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="12" md="12" lg="12">
      <v-row justify="center" align="start">
        <v-col cols="12">
          <v-card class="border-b-sm rounded-lg" elevation="1">
            <v-row class="py-5 px-5" align="center" justify="space-between">
              <v-col cols="auto" class="text-start text-primary-text">
                <h4
                  class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
                >
                  Waste Material Report
                </h4>
              </v-col>

              <v-col cols="auto" class="d-flex justify-end">
                <v-btn
                  color="primary"
                  class="me-2 text-button"
                  @click="submit()"
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
        <v-row dense class="py-2" fill-height justify="center" align="start">
          <v-col cols="12" lg="12" md="12">
            <v-row dense>
              <v-col cols="12" lg="12" md="12" class="mb-4">
                <v-card class="pa-5 rounded-lg mb-4" elevation="3">
                  <v-row dense class="mt-2">
                    <v-col cols="12">
                      <InputLabel
                        for="placeOfStorage"
                        title="Place of Storage"
                      />
                      <v-text-field
                        v-model="waste.placeOfStorage"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <h5
                        class="text-primary text-h5 text-uppercase font-weight-regular"
                      >
                        Item for disposal
                      </h5>
                    </v-col>
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
                              :items="assets"
                              variant="outlined"
                              density="compact"
                              class="mt-0"
                              :loading="loading"
                              placeholder="Select an Item"
                              hide-no-data
                              hide-selected
                              :search-input.sync="search"
                              item-value="value._id"
                              item-title="title"
                              @update:model-value="onItemSelect"
                            />
                          </v-col>

                          <v-col cols="2">
                            <InputLabel for="condition" title="Condition" />
                            <v-select
                              v-model="selectedCondition"
                              :items="conditionOptions"
                              :loading="loading"
                              variant="outlined"
                              density="compact"
                              placeholder="Select Condition"
                              :disabled="!selectedItemNo"
                            />
                          </v-col>

                          <v-col cols="2">
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
                              item-value="_id"
                              item-title="itemNo"
                              :disabled="!selectedCondition"
                            />
                          </v-col>
                          <v-col cols="2">
                            <InputLabel for="type" title="Waste Type" />
                            <v-select
                              v-model="selectedWasteType"
                              :items="wasteTypeOptions"
                              :loading="loading"
                              variant="outlined"
                              density="compact"
                              placeholder="Select Waste Type"
                            />
                          </v-col>
                          <v-col cols="2">
                            <v-btn
                              block
                              class="py-5 mb-2"
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
                      <div
                        style="
                          max-height: calc(100vh - 320px);
                          overflow-y: auto;
                        "
                      >
                        <v-data-table
                          v-model:expanded="expanded"
                          :headers="headers"
                          :items="items"
                          class="text-primary-text border-thin text-capitalize"
                          density="compact"
                          fixed-header
                          hide-default-footer
                          show-expand
                        >
                          <!-- Expanded rows -->
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
                          <template v-slot:expanded-row="{ item }">
                            <tr>
                              <td :colspan="headers.length">
                                <v-row align="center" class="pa-0 ma-0">
                                  <v-col>
                                    <v-text-field
                                      v-model="item.remarks"
                                      variant="outlined"
                                      density="compact"
                                      placeholder="Enter Description"
                                      class="my-auto"
                                    />

                                    <v-text-field
                                      v-if="
                                        item.type === 'transferred-without-cost'
                                      "
                                      v-model="item.transferredTo"
                                      variant="outlined"
                                      density="compact"
                                      placeholder="Enter Name of Agency/Entity"
                                      class="mt-2"
                                    />
                                  </v-col>
                                </v-row>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </div>
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

  <v-dialog v-model="wasteApproveDialog" width="500">
    <v-card class="rounded-lg pa-4">
      <v-col cols="12" class="pb-5">
        <v-row justify="start">
          <span class="font-weight-regular text-h5">Witness Disposal</span>
        </v-row>
      </v-col>

      <v-form v-model="valid" @submit.prevent="updateCompleteStatus">
        <v-row no-gutters>
          <InputLabel for="witnessByName" title="Witnessed By" />
          <v-col cols="12" class="mt-2">
            <label for="witnessByName"></label>
            <v-text-field
              v-model="waste.witnessedByName"
              variant="outlined"
              density="compact"
              persistent-hint
            />
          </v-col>
          <v-col v-if="errorMessage" cols="12" class="pl-2">
            <span class="text-error">* {{ errorMessage }}</span>
          </v-col>
          <v-col cols="12" class="mt-2">
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn color="primary" block type="submit" :disabled="!valid">
                  Submit
                </v-btn>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn block @click="setWasteDialog()">Cancel</v-btn>
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
const { getStatusColor, isAdminHead, debounce, isAdmin, goBack, requiredRule } =
  useUtils();

const { waste, getWasteById, updateWasteApproveStatus, createWaste } =
  useWaste();

const isRead = computed(() => props.mode === "view");
const isApproving = computed(() => props.mode === "approve");
const isCompleted = computed(() => props.mode === "complete");
const isCreate = computed(() => props.mode === "create");

const id = computed(() => {
  return !isCreate.value ? (useRoute().params.id as string) || "" : "";
});

const _getWasteById = async () => {
  if (isCreate.value) {
    return;
  }

  try {
    const result = await getWasteById(id.value);
    waste.value = {
      ...waste.value,
      ...result,
    };
  } catch (error) {
    console.error("Error fetching transfer details:", error);
  }
};

_getWasteById();

const expanded = ref([]);

const headers = computed<
  {
    title: string;
    key: string;
    align?: "start" | "end" | "center";
    width?: string;
  }[]
>(() => {
  const items: {
    title: string;
    key: string;
    align?: "start" | "end" | "center";
    width?: string;
  }[] = [];

  if (isRead.value || isApproving.value) {
    items.push(
      { title: "Item", key: "index", align: "start" },
      { title: "Property No", key: "stockNumber" },
      { title: "Property Name", key: "name" },
      { title: "Description", key: "remarks" },
      { title: "Type", key: "type" },
      { title: "Unit", key: "unitOfMeasurement" }
    );
  }

  if (isCreate.value) {
    items.push(
      { title: "Item", key: "index", align: "start" },
      { title: "Property No", key: "stockNumber" },
      { title: "Property Name", key: "name" },
      { title: "Type", key: "type" },
      { title: "Unit", key: "unitOfMeasurement" },
      { title: "Action", key: "actions" }
    );
  }

  return items;
});

const { currentUser } = useLocalAuth();
const wasteApproveDialog = ref(false);

const openWasteDialog = () => {
  wasteApproveDialog.value = true;
};

const setWasteDialog = (value = false) => {
  wasteApproveDialog.value = value;
};

const valid = ref(false);

const updateCompleteStatus = async () => {
  if (!id.value || !currentUser.value?._id) {
    console.error("Missing transfer ID or current user information.");
    return;
  }

  const { witnessedByName } = waste.value;
  const disposalApprovedBy = currentUser.value._id;

  try {
    await updateWasteApproveStatus(
      id.value,
      witnessedByName || "",
      disposalApprovedBy || ""
    );

    await useRouter().push("/waste-and-losses/waste-materials");
  } catch (error) {
    console.error("Failed to update transfer status:", error);
  }
};

const { search, getAssetWasteByCondition, getWastetocksByCondition } =
  useAsset();

const loading = ref(false);

const selectedCondition = ref<TTransferCondition | null>(null);
const isValid = ref(true);
const items = ref<Array<TStockWasteWithCond>>([]);
const itemNo = ref(null);

const route = useRoute();
const assetId = route.params.id as string;

type TSearchItem = {
  title: string;
  value: TKeyValuePair;
};

const selectedItemNo = ref();

const assets = ref<(TAsset | TSearchItem)[]>([]);
const stockItemOptions = ref<Array<TStockWithCond>>([]);
const wasteTypeOptions = [
  { title: "Destroyed", value: "destroyed" },
  { title: "Sold at Private Sale", value: "sold-at-private-sale" },
  { title: "Sold at Public Auction", value: "sold-at-public-auction" },
  { title: "Transferred without Cost", value: "transferred-without-cost" },
];

const selectedWasteType = ref<TWasteType | null>();
const conditionOptions = [
  { title: "Reissued", value: "reissued" },
  { title: "Good Condition", value: "good-condition" },
  { title: "Returned", value: "returned" },
];

const _getAssetTransfer = debounce(async ({ search = "" }) => {
  if (!isCreate.value) return;
  try {
    const res = await getAssetWasteByCondition({
      page: 1,
      search,
      limit: 10,
    });
    assets.value = res.items.map((item) => ({
      title: item.name,
      value: item,
    }));
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
}, 300);

if (isCreate.value) {
  _getAssetTransfer({});
}

const _getWasteStocksByCondition = async (
  condition: string,
  assetId: string
): Promise<{ items: any[] }> => {
  if (!isCreate.value) return { items: [] };

  try {
    const res = await getWastetocksByCondition({ condition, assetId });
    return res;
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return { items: [] };
  }
};

const onItemSelect = async (value: any) => {
  if (!value) {
    selectedItemNo.value = null;
    selectedCondition.value = null;
    itemNo.value = null;
    stockItemOptions.value = [];
    return;
  }

  selectedItemNo.value = value;
  selectedCondition.value = null;
  itemNo.value = null;
  stockItemOptions.value = [];
};

watch(
  () => ({ condition: selectedCondition.value, itemId: selectedItemNo.value }),
  async ({ condition, itemId }) => {
    if (!isCreate.value) return;

    if (condition && itemId) {
      loading.value = true;
      try {
        const res = await _getWasteStocksByCondition(condition, itemId);
        stockItemOptions.value = res.items;
        // Only reset itemNo if it's not in the new options
        if (
          itemNo.value &&
          !res.items.some((item) => item._id === itemNo.value)
        ) {
          itemNo.value = null;
        }
      } catch (error) {
        console.error("Error fetching stock items:", error);
        stockItemOptions.value = [];
        itemNo.value = null;
      } finally {
        loading.value = false;
      }
    } else {
      stockItemOptions.value = [];
      itemNo.value = null;
    }
  },
  { deep: true }
);

const isItemValid = computed(() => {
  return !!(
    selectedItemNo.value &&
    selectedCondition.value &&
    itemNo.value &&
    selectedWasteType.value
  );
});

const addItem = () => {
  errorMessage.value = "";

  if (!isItemValid.value) {
    errorMessage.value = "Please fill in all required fields";
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
    errorMessage.value =
      "This item with the same condition and waste type has already been added";
    return;
  }

  const newItem = {
    ...selectedStockItem,
    index: items.value.length + 1,
    condition: selectedCondition.value,
    // stockNumber: selectedStockItem.stockNumber,
    description: selectedStockItem.description,
    name: selectedStockItem.name,
    // unitOfMeasurement: selectedStockItem.unitOfMeasurement,
    itemNo: selectedStockItem.itemNo,
    _id: selectedStockItem._id,
    type: selectedWasteType.value,
  };

  items.value = [...items.value, newItem];

  selectedItemNo.value = null;
  selectedCondition.value = null;
  itemNo.value = null;
  selectedWasteType.value = null;
};

watch(
  [selectedItemNo, selectedCondition, itemNo, selectedWasteType],
  ([itemNo, condition, stockNo, wasteType]) => {
    isItemValid.value = !!(itemNo && condition && stockNo && wasteType);
  }
);

const removeItem = (index: number) => {
  items.value = items.value.filter((_, i) => i !== index);
};
const errorDialog = ref(false);

const submit = async () => {
  if (!isValid.value) {
    errorMessage.value = "Please fill in all required fields";
    return;
  }

  const payload = {
    placeOfStorage: waste.value.placeOfStorage,
    itemStocks: items.value.map((item) => ({
      stockId: item._id,
      type: item.type,
      remarks: item.remarks || "",
      transferredTo: item.transferredTo || "",
    })),
    certifiedBy: currentUser.value?._id || "",
  };

  try {
    await createWaste(payload);
    await useRouter().push("/waste-and-losses/waste-materials");
  } catch (error) {
    console.error("Error creating waste:", error);
    errorMessage.value = "An error occurred while creating the waste report.";
  }
};
</script>
