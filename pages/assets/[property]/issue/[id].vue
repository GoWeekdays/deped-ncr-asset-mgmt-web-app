<template>
  <v-form
    ref="form"
    v-model="isFormValid"
    @submit.prevent="submit()"
    class="text-primary-text text-subtitle-2"
  >
    <v-row justify="center" align="start">
      <v-col cols="12">
        <v-card class="border-b-sm rounded-lg" elevation="1">
          <v-row class="py-5 px-5" align="center" justify="space-between">
            <v-col cols="auto" class="text-start text-primary-text">
              <h4
                class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
              >
                {{ issueTitle }}
              </h4>

              <h4
                class="text-caption text-center mt-1 font-weight-regular text-fontgray text-uppercase"
              >
                {{ issueSubtitle }}
              </h4>
            </v-col>

            <v-col cols="auto" class="d-flex justify-end">
              <v-btn
                color="primary"
                class="pa-4 px-6 mr-2 rounded-lg d-flex text-capitalize align-center text-button font-weight-medium"
                type="submit"
                :disabled="!isFormValid"
              >
                Submit
              </v-btn>
              <v-btn
                color="fontgray"
                class="pa-4 px-6 rounded-lg mr-2 d-flex text-capitalize align-center text-button font-weight-medium"
                variant="outlined"
                @click="goBack"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card></v-col
      >
    </v-row>

    <v-row justify="start" align="start">
      <v-col cols="12">
        <v-card class="border-b-sm rounded-lg pa-3" elevation="1">
          <v-row class="py-5 px-5" align="start" justify="space-between">
            <v-col cols="12">
              <v-row>
                <v-col cols="6">
                  <span
                    v-if="isSEP"
                    class="text-fontgray font-weight-regular text-body-2"
                    >Semi-Expendable Property</span
                  >
                  <span
                    v-else="isPPE"
                    class="text-fontgray font-weight-regular text-body-2"
                    >Property, Plant & Equipment</span
                  >
                  <div
                    class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                  >
                    {{ asset.name || "N/A" }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <span
                    v-if="isSEP"
                    class="text-fontgray font-weight-regular text-body-2"
                    >Semi-Expendable Property No.</span
                  >
                  <span
                    v-if="isPPE"
                    class="text-fontgray font-weight-regular text-body-2"
                    >Property No.</span
                  >
                  <div
                    class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                  >
                    {{ asset.stockNumber || "N/A" }}
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row no-gutters class="pt-5">
            <v-col cols="12">
              <v-data-table
                v-model:expanded="expanded"
                :items="stocks"
                :headers="headers"
                density="compact"
                hide-default-footer
                max-height="400"
                fixed-header
                class="border-thin"
                show-expand
              >
                <template v-slot:[`item.description`]="{ item }">
                  <v-col class="text-center"
                    ><span>{{ item.description }}</span></v-col
                  >
                </template>

                <template v-slot:[`item.unitOfMeasurement`]="{ item }">
                  <v-col class="text-center"
                    ><span>{{ item.unitOfMeasurement }}</span></v-col
                  >
                </template>

                <template v-slot:[`item.issuePropertyQty`]="{ item }">
                  <v-row align="center" class="pa-0 ma-0">
                    <v-col>
                      <v-text-field
                        v-model.number="item.qty"
                        variant="outlined"
                        density="compact"
                        placeholder="Enter Issued Qty"
                        type="number"
                        min="1"
                        :max="item.balance ?? 0"
                        @change="updateTotalCost(item)"
                      />
                    </v-col>
                  </v-row>
                </template>

                <template v-slot:[`item.cost`]="{ item }">
                  <div class="text-center">
                    {{ item.cost }}
                  </div>
                </template>

                <template v-slot:[`item.totalCost`]="{ item }">
                  <div class="text-center">
                    {{ item.totalCost ? item.totalCost.toLocaleString() : 0 }}
                  </div>
                </template>

                <template v-if="isPPE" v-slot:[`item.createdAt`]="{ item }">
                  <div class="text-center">
                    {{ item.createdAt }}
                  </div>
                </template>

                <template v-if="isSEP" v-slot:[`item.itemNo`]="{ item }">
                  <div class="text-center">
                    {{ item.itemNo }}
                  </div>
                </template>

                <template v-slot:expanded-row="{ columns, item }">
                  <tr>
                    <td :colspan="columns.length">
                      <v-row
                        align="center"
                        justify="center"
                        s
                        class="pa-0 ma-0"
                      >
                        <v-col>
                          <v-row dense align="center">
                            <v-col cols="12">
                              <v-text-field
                                v-if="isSEP || isPPE"
                                v-model="item.remarks"
                                variant="outlined"
                                density="compact"
                                placeholder="Enter Remarks"
                                class="my-auto"
                              />
                              <span v-else class="my-auto">{{
                                item.remarks
                              }}</span>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </template>
                <template v-slot:[`item.numberOfDaysToConsume`]="{ item }">
                  <v-row align="center" class="pa-0 ma-0">
                    <v-col>
                      <v-text-field
                        v-model.number="item.numberOfDaysToConsume"
                        variant="outlined"
                        density="compact"
                        placeholder="Enter Estimated Useful Life"
                        min="0"
                      />
                    </v-col>
                  </v-row>
                </template>
              </v-data-table>
            </v-col>
          </v-row> </v-card
      ></v-col>
    </v-row>

    <v-row justify="start" align="start">
      <v-col cols="6">
        <v-card class="border-b-sm rounded-lg pa-6" elevation="1">
          <!-- Header with Serial Numbers Label -->
          <v-row dense class="py-2">
            <v-col cols="6">
              <label class="mb-1 text-subtitle-1 text-primary">
                Serial Numbers
              </label>
            </v-col>

            <v-col cols="12">
              <v-row dense class="d-flex align-center">
                <v-col cols="10" class="pr-0">
                  <v-text-field
                    v-model="newSerialNumber"
                    placeholder="Enter serial number"
                    variant="outlined"
                    density="compact"
                    clearable
                    :error-messages="textFieldError ? [textFieldError] : []"
                    :class="{ 'error-field': textFieldError }"
                    hide-details
                  />
                </v-col>

                <v-col cols="2" class="d-flex justify-end">
                  <v-btn
                    color="primary"
                    :disabled="!newSerialNumber || textFieldError !== ''"
                    @click="addSerialNumber"
                    class="ml-2 rounded-lg"
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>

            <v-snackbar v-model="snackbar.visible" color="red" top right>
              {{ snackbar.message }}
            </v-snackbar>
          </v-row>

          <v-row
            align="center"
            justify="center"
            class="border-b-sm py-2"
            dense
            v-for="(serial, index) in serialNumbers"
            :key="index"
          >
            <v-col cols="9">
              <p class="mb-0 text-body-2">{{ serial }}</p>
            </v-col>
            <v-col cols="2" class="text-end">
              <v-btn
                icon
                size="xl"
                variant="flat"
                @click="removeSerialNumber(index)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card class="border-b-sm rounded-lg pa-6" elevation="1">
          <v-row dense class="py-2">
            <v-col cols="6">
              <label class="mb-1 text-subtitle-1 text-primary">
                Received by
              </label>
            </v-col>

            <v-col cols="12">
              <v-row dense>
                <v-col cols="12">
                  <label
                    class="mb-1 text-subtitle-2 text-primary-text font-weight-medium"
                  >
                    Name
                  </label>
                  <v-select
                    v-model="selectedUser"
                    :items="userOptions"
                    :loading="fetchingUsers"
                    variant="outlined"
                    density="compact"
                    :rules="[requiredRule]"
                    placeholder="Search and select a user"
                    item-title="name"
                    item-value="_id"
                    clearable
                    @update:model-value="handleUserSelection"
                    @update:search="fetchUsers"
                  />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12">
                  <label
                    class="mb-1 text-subtitle-2 text-primary-text font-weight-medium"
                  >
                    Position/Office
                  </label>
                  <v-text-field
                    v-model="selectedOffice"
                    placeholder="Position/Office"
                    variant="outlined"
                    density="compact"
                    readonly
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Property Issue");

const { currentUser } = useLocalAuth();
const { requiredRule } = useUtils();
const assetIssueId = useRoute().params.id as string;
const { issueTitle, issueSubtitle, isSEP, isPPE, getById } = useAsset();
const asset = await getById(assetIssueId);

const { goBack } = useUtils();
const isFormValid = ref(true);

const { getStocksByAssetId, createIssueProperty, pageRange, pages } =
  useStock();

const userOptions = ref<Array<{ _id: string; name: string; officeId: string }>>(
  []
);

const selectedUser = ref<string | null>(null);

const { getUsers } = useUser();
const { debounce } = useUtils();
const fetchingUsers = ref(false);

const fetchUsers = debounce(async (search = "") => {
  fetchingUsers.value = true;
  try {
    const { items } = await getUsers({ limit: 20, search });
    userOptions.value = items.map((user: any) => ({
      _id: user._id,
      name: user.name,
      officeId: user.officeId,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    fetchingUsers.value = false;
  }
}, 500);

fetchUsers();

const selectedOffice = ref<string>("");

const { getOffices, offices } = useOfficeCodes();
const fetchingOffices = ref(false);

const _getOffices = debounce(async (_search = "") => {
  fetchingOffices.value = true;
  try {
    await getOffices({ search: _search, limit: 50 });
  } catch (error) {
    console.error("Error fetching offices:", error);
  }
  fetchingOffices.value = false;
}, 500);

_getOffices();

const handleUserSelection = (userId: string | null) => {
  const user = userOptions.value.find((u) => u._id === userId);

  selectedOffice.value = user?.officeId
    ? getOfficeName(user.officeId) || "N/A"
    : "N/A";
};

function getOfficeName(id: string) {
  const office = offices.value.find((i) => i._id == id);
  return office?.name;
}

const expanded = ref<string[]>([]);

const receivedAt = ref<string>("");

async function submit() {
  if (!isPPE && !isSEP) {
    console.error(
      "Error: Unable to determine issue type. Either isPPE or isSEP must be true."
    );
    return;
  }

  const item = stocks.value[0];
  if (!item) {
    console.error("Error: No stock item available to submit.");
    return;
  }

  const type = isPPE ? "PAR" : isSEP ? "ICS" : "";

  const { entityName, fundCluster } = useDefaults();

  const payload = {
    type,

    assetId: item.assetId ?? "",
    serialNo: serialNumbers.value,
    quantity: Number(item.qty),
    estimatedUsefulLife: Number(item.numberOfDaysToConsume) || 0,
    receivedBy: selectedUser.value as string,
    remarks: item.remarks || "",
    issuedBy: currentUser?.value?._id || "",
  };

  try {
    await createIssueProperty(payload);
    goBack();
  } catch (error) {
    console.error("Error submitting property issue:", error);
  }
}

const stocks = ref<Array<TStock>>([]);
const headers = computed(() => {
  let items = [];

  if (isSEP) {
    items.push(
      {
        title: "Qty",
        value: "issuePropertyQty",
        align: "center",
        width: "120",
      },
      { title: "Unit", value: "unitOfMeasurement", align: "center" },
      {
        title: "Amount",
        align: "center",
        children: [
          {
            title: "Unit Cost",
            value: "cost",
            align: "center",
          },
          {
            title: "Total Cost",
            value: "totalCost",
            align: "center",
          },
        ],
      },

      { title: "Description", value: "description", align: "center" },
      { title: "Inventory Item No.", value: "itemNo", align: "center" },
      {
        title: "Estimated Useful Life",
        value: "numberOfDaysToConsume",
        width: "200",
        align: "center",
      }
    );
  }

  if (isPPE) {
    items.push(
      {
        title: "Qty",
        value: "issuePropertyQty",
        align: "center",
        width: "120",
      },
      { title: "Unit", value: "unitOfMeasurement", align: "center" },
      { title: "Description", value: "description", align: "center" },
      { title: "Date Acquired", value: "createdAt", align: "center" },
      { title: "Amount", value: "cost", align: "center" }
    );
  }

  {
    title: "Actions";
    value: "remarks";
  }

  return items;
});

const serialNumbers = ref<string[]>([]);
const newSerialNumber = ref<string>("");
const textFieldError = ref<string>("");

const snackbar = ref<{ visible: boolean; message: string }>({
  visible: false,
  message: "",
});

watch(
  () => stocks.value[0]?.qty,
  (newQty) => {
    const issuedQuantity = newQty ?? 0;

    if (serialNumbers.value.length > issuedQuantity) {
      textFieldError.value = `You can only add up to ${issuedQuantity} serial number(s).`;
      snackbar.value = {
        visible: true,
        message: textFieldError.value,
      };
      hideSnackbar();
    } else {
      textFieldError.value = "";
    }
  },
  { immediate: true }
);

// Add serial number
const addSerialNumber = () => {
  const issuedQuantity =
    stocks.value.length > 0 ? (stocks.value[0]?.qty ?? 0) : 0;

  if (serialNumbers.value.length >= issuedQuantity) {
    textFieldError.value = `You can only add up to ${issuedQuantity} serial number(s).`;
    snackbar.value = {
      visible: true,
      message: textFieldError.value,
    };
    hideSnackbar();
    return;
  }

  if (newSerialNumber.value) {
    serialNumbers.value.push(newSerialNumber.value);
    newSerialNumber.value = "";
    textFieldError.value = "";
  } else {
    textFieldError.value = "Serial number cannot be empty.";
    snackbar.value = {
      visible: true,
      message: textFieldError.value,
    };
    hideSnackbar();
  }
};

// Remove serial number
const removeSerialNumber = (index: number) => {
  serialNumbers.value.splice(index, 1);
};

const hideSnackbar = () => {
  setTimeout(() => {
    snackbar.value.visible = false;
  }, 3000);
};

const updateTotalCost = (item: TIssueProperty) => {
  if (item.cost !== undefined && item.qty !== undefined) {
    item.totalCost = item.qty && item.cost ? item.qty * item.cost : 0;
  }
};

const loading = ref(false);

async function _getStockByAssetId(search = "") {
  loading.value = true;

  try {
    const res = await getStocksByAssetId({
      asset: assetIssueId,
      search,
    });
    pageRange.value = res.pageRange;
    pages.value = res.pages;

    const firstItem = res.items[0];
    if (firstItem) {
      const stockItem = {
        ...firstItem,
        qty: firstItem.qty || 1,
        createdAt: firstItem.createdAt
          ? new Date(firstItem.createdAt).toDateString().slice(4)
          : "",
        unitOfMeasurement: firstItem.unitOfMeasurement || "",
        description: firstItem.description || "",
        totalCost: (firstItem.qty || 1) * (firstItem.cost || 0),
        inventoryItemNo: "0",
        numberOfDaysToConsume: firstItem.numberOfDaysToConsume ?? "0",
      };

      stocks.value = [stockItem];
      updateTotalCost(stockItem);
    } else {
      stocks.value = [];
    }
  } catch (error) {
    console.error("Error fetching requisitions:", error);
  } finally {
    loading.value = false;
  }
}

_getStockByAssetId();
</script>

<style scoped>
.text-fontgray {
  color: #7e7e7e;
}

:deep() .v-table .v-table__wrapper > table > thead > tr > th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child),
:deep() .v-table .v-table__wrapper > table > tbody > tr > th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper > table > thead > tr > th,
:deep() .v-table .v-table__wrapper > table > tbody > tr > td {
  padding: 0.75rem;
  text-align: left;
}

:deep() .v-table .v-table__wrapper > table > tbody > tr {
  transition: background-color 0.2s ease;
}

:deep() .v-table .v-table__wrapper > table > tbody > tr:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
