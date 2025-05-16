<template>
  <v-row dense justify="center" align="start">
    <v-col cols="12">
      <v-card class="border-b-sm rounded-lg" elevation="1">
        <v-row class="py-5 px-5" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4
              class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
            >
              Receive
            </h4>
          </v-col>

          <v-col cols="auto" class="d-flex justify-end">
            <v-btn
              color="primary"
              class="pa-4 px-6 rounded-lg mr-2 d-flex align-center text-button font-weight-medium"
              :disabled="!valid"
              @click="submit({ reference, attachment, items })"
              >Submit</v-btn
            >
            <v-btn
              color="fontgray"
              class="pa-4 px-6 rounded-lg mr-2 d-flex align-center text-button font-weight-medium"
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
  <v-row dense class="py-2" fill-height justify="center" align="start">
    <v-col cols="12" lg="12" md="12">
      <v-form
        v-model="isValid"
        class="text-primary-text font-weight-medium text-subtitle-2"
        ref="generalInfoForm"
      >
        <v-row dense>
          <v-col cols="12" lg="9" md="7" class="mb-4">
            <v-card class="pa-5 rounded-lg mb-4" elevation="3">
              <label
                for="itemInfo"
                class="text-capitalize text-fontgray text-subtitle-2"
              >
                Delivery Info
              </label>
              <v-row dense class="mt-2">
                <v-col cols="10">
                  <label class="mb-1">Reference No.</label>
                  <v-text-field
                    v-model="reference"
                    variant="outlined"
                    :rules="[requiredRule]"
                    density="compact"
                    class="mt-0"
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

              <v-row class="mt-5" justify="center" align="start">
                <v-col cols="12">
                  <v-form
                    v-model="isItemValid"
                    class="text-primary-text font-weight-medium text-subtitle-2"
                    ref="stockManagementForm"
                  >
                    <v-row dense align="center">
                      <v-col cols="3">
                        <InputLabel for="item" title="Item" />
                        <v-autocomplete
                          v-model="selectedItem"
                          :items="itemOptions"
                          item-value="value"
                          item-disabled="disabled"
                          variant="outlined"
                          density="compact"
                          class="mt-0"
                          placeholder="Select an Item"
                          hide-no-data
                          hide-selected
                          return-object
                          :search="search"
                          @keydown.enter="searchItem(search)"
                          @update:search="setSearch"
                          @update:modelValue="
                            setSelectedItem(selectedItem.value)
                          "
                        />
                      </v-col>
                      <v-col cols="3">
                        <label class="mb-1">Stock No.</label>
                        <v-text-field
                          v-model="item.stockNumber"
                          :rules="[requiredRule]"
                          variant="outlined"
                          density="compact"
                          class="mt-0"
                          disabled
                        />
                      </v-col>
                      <v-col cols="2">
                        <InputLabel for="quantity" title="Quantity" />
                        <v-text-field
                          v-model.number="item.quantity"
                          variant="outlined"
                          density="compact"
                          class="mt-0"
                          :rules="
                            item.stockNumber ? [requiredRule, isNumber] : []
                          "
                          type="number"
                          min="1"
                          :value="item.quantity || 1"
                        />
                      </v-col>
                      <v-col cols="2">
                        <label
                          class="text-subtitle-2 font-weight-medium text-primary-text"
                          >Days To Consume</label
                        >
                        <v-text-field
                          v-model.number="item.numberOfDaysToConsume"
                          variant="outlined"
                          hint=" Days To Consume"
                          density="compact"
                          class="mt-0"
                          type="number"
                          min="0"
                        />
                      </v-col>
                      <v-col cols="2" class="d-flex align-center">
                        <v-btn
                          color="primary"
                          class="pa-4 py-5 rounded-lg d-flex align-center text-button font-weight-medium"
                          @click="addItem(item)"
                          :disabled="!isItemValid || isItemInTable()"
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
                  <v-data-table
                    :headers="headers"
                    :items="items"
                    item-value="stockNumber"
                    class="text-primary-text border-thin text-capitalize table-container overflow-y"
                    density="compact"
                    style="max-height: calc(100vh - 310px)"
                    fixed-header
                    hide-default-footer
                    dense
                  >
                    <!-- Quantity Slot -->
                    <template #item.quantity="{ item }">
                      <v-row align="center" justify="center" class="pa-0 ma-0">
                        <v-col>
                          <v-text-field
                            v-model.number="item.quantity"
                            hide-details
                            type="number"
                            variant="outlined"
                            density="compact"
                            min="1"
                            :rules="[(v) => (v && v > 0) || 'Invalid value.']"
                          />
                        </v-col>
                      </v-row>
                    </template>

                    <!-- Actions Slot -->
                    <template #item.actions="{ item, index }">
                      <v-row align="center" justify="center" class="pa-0 ma-0">
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
                        There are no items in the stock list. Click 'Add to
                        List' to get started.
                      </div>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" lg="3" md="5" class="mb-4">
            <v-card class="pa-5 rounded-lg" elevation="3">
              <label
                for="itemInfo"
                class="text-capitalize text-fontgray text-subtitle-2"
              >
                Add Attachment
              </label>
              <v-row dense class="mt-2">
                <v-col cols="12">
                  <v-row no-gutters>
                    <!-- Dotted Frame -->
                    <v-col cols="12">
                      <div
                        class="dotted-frame d-flex align-center justify-center"
                        style="
                          border: 2px dotted #888;
                          padding: 8px;
                          border-radius: 8px;
                          width: 100%;
                          height: 150px;
                          overflow: hidden;
                          position: relative;
                          text-align: center;
                        "
                      >
                        <template v-if="attachment">
                          <v-img
                            :src="`${getOrigin()}/api/public/${attachment}`"
                            alt="Attachment"
                            contain
                            style="max-width: 100%; max-height: 100%"
                          />
                          <v-btn
                            size="md"
                            variant="text"
                            icon="mdi-close"
                            class="delete-btn"
                            @click="deleteFile(attachment)"
                            style="
                              position: absolute;
                              top: 8px;
                              right: 8px;
                              z-index: 10;
                            "
                          ></v-btn>
                        </template>
                        <template v-else>
                          <p
                            class="text-subtitle-2 text-fontgray"
                            style="margin: 0; color: #888"
                          >
                            Click the browse button to upload an image
                          </p>
                        </template>
                      </div>
                    </v-col>

                    <!-- Add Attachment Button -->
                    <v-col cols="12">
                      <label
                        class="mb-2 text-heading-blue-text font-weight-medium"
                      >
                        <v-btn
                          block
                          @click="selectAttachment()"
                          variant="tonal"
                          class="pa-4 py-5 mt-3 rounded-lg d-flex align-center text-button font-weight-medium"
                          :loading="isUploading"
                        >
                          Click here to browse
                        </v-btn>
                      </label>
                    </v-col>

                    <!-- Hidden File Input -->
                    <v-file-input
                      v-show="false"
                      v-model="file"
                      class="attachment-input"
                      @change="onFileChange"
                      accept=".jpg, .jpeg, .png, .pdf"
                    />
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { selectedAssets, search, getAssets } = useAsset();
const { goBack, requiredRule, isNumber, getOrigin } = useUtils();

const headers = [
  { title: "Stock No.", value: "stockNumber", align: "start" },
  { title: "Unit", value: "unitOfMeasurement" },
  { title: "Description", value: "description" },
  { title: "Quantity", value: "quantity", align: "center", width: "140px" },
  {
    title: "No. of Days to Consume",
    align: "center",
    value: "numberOfDaysToConsume",
  },
  { title: "Actions", value: "actions", align: "center", width: "100px" },
];

const isValid = ref(false);

const items = ref<Array<TBatchItem>>([]);

const route = useRoute();
const assetId = route.params.id as string;

selectedAssets.value.forEach((asset: TAsset) => {
  items.value.push(JSON.parse(JSON.stringify(asset)));
});

type TSearchItem = {
  title: string;
  value: TKeyValuePair;
};
const { createStockByBatch, getStocksByAssetId } = useStock();

const itemOptions = ref<Array<TSearchItem>>([]);

const { debounce } = useUtils();

function setSearch(value: string) {
  search.value = value;
}

const searchItem = debounce(async (_search = "") => {
  itemOptions.value = [];
  try {
    const res = await getAssets({ search: _search, limit: 50 });
    const _items = res.items;

    const existingItemIds = items.value.map((item) => item._id);
    itemOptions.value = _items.map((i) => ({
      title: `${i.name}`,
      value: {
        _id: i._id,
        stockNumber: i.stockNumber,
        description: i.description,
        quantity: i.quantity,
        unitOfMeasurement: i.unitOfMeasurement,
      },
      disabled: existingItemIds.includes(i._id),
    }));
  } catch (error) {
    console.error("Error fetching items:", error);
  }
}, 500);

searchItem();

const selectedItem = ref();

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

const isItemValid = ref(false);

function addItem(value: Partial<TAsset>) {
  const _items = items.value.filter((i) => i._id === value._id);
  if (!_items.length) {
    items.value.push(JSON.parse(JSON.stringify(value)));

    selectedItem.value = null;
    item._id = "";
    item.name = "";
    item.stockNumber = "";
    item.description = "";
    item.unitOfMeasurement = "";
    item.quantity = 0;
    item.numberOfDaysToConsume = 0;
  }
}
const reference = ref("");
const attachment = ref(null);

function isItemInTable() {
  return items.value.some((i) => i._id === item._id);
}

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

const {
  file,
  uploadFile,
  deleteFile: _deleteFile,
  isUploading,
} = useFileUpload();

file.value = null;

function selectAttachment() {
  const input = document.querySelector(
    ".attachment-input input"
  ) as HTMLInputElement;
  input.click();
}

async function onFileChange() {
  try {
    const res = await uploadFile();
    attachment.value = res?.id;
  } catch (error) {
    console.log(error);
  }
}

async function deleteFile(value: string) {
  try {
    await _deleteFile(value);
    attachment.value = null;
  } catch (error) {
    console.log(error);
  }
}

const loading = ref(false);
const errorDialog = ref(false);
const errorMessage = ref("");

const { currentUser } = useLocalAuth();

async function submit(
  { attachment, reference, items } = {} as {
    attachment: string | null;
    reference: string;
    officeId: string;
    items: Array<TBatchItem>;
  }
) {
  const user = currentUser?.value;
  if (!user || !user.officeId) {
    throw new Error("User's officeId is missing.");
  }
  loading.value = true;
  try {
    await createStockByBatch({
      attachment,
      reference,
      officeId: user.officeId,
      items,
    });
    file.value = null;
    await goBack();
  } catch (error: any) {
    errorMessage.value = error.data.message;
    errorDialog.value = true;
    console.error(error);
  }

  loading.value = false;
}

const valid = computed(() => {
  return isValid.value && items.value && items.value.length;
});

onMounted(() => {
  if (selectedAssets.value && selectedAssets.value.length > 0) {
    items.value = selectedAssets.value.map((asset) => ({
      ...asset,
      quantity: 1, // Default quantity
      numberOfDaysToConsume: 0, // Default number of days
    }));
  }
});
</script>

<style scoped>
.table-header {
  background-color: #e1e1f0;
}
</style>
