<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row class="pb-4" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4 class="font-bold text-h4 font-weight-regular">Consumables</h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              :to="{ name: 'assets-consumables-add-supply' }"
              color="primary"
              class="pa-4 py-5 mr-3 rounded-lg d-flex text-button text-capitalize font-weight-medium"
              prepend-icon="mdi-plus"
            >
              Add Supply
            </v-btn>
            <v-btn
              color="primary"
              class="pa-4 py-5 mr-3 rounded-lg d-flex text-button text-capitalize font-weight-medium"
              prepend-icon="mdi-arrow-bottom-left"
              @click="handleReceiveClick"
            >
              Receive
            </v-btn>

            <v-menu class="mb-3">
              <template v-slot:activator="{ props }">
                <v-icon size="large" v-bind="props" class="">
                  mdi-dots-horizontal
                </v-icon>
              </template>
              <v-list class="text-primary-text">
                <v-list-item
                  :to="{
                    name: 'assets-consumables-report-on-the-physical-count-of-inventories',
                  }"
                >
                  <v-list-item-title
                    class="text-decoration-none text-primary-text cursor-pointer"
                  >
                    <v-icon size="small" class="me-2"
                      >mdi-folder-outline</v-icon
                    >
                    <span class="text-subtitle-2"
                      >Report of Physical Count of Inventory</span
                    >
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  :to="{
                    name: 'assets-consumables-report-of-supplies-and-materials-issued',
                  }"
                >
                  <v-list-item-title
                    class="text-decoration-none text-primary-text cursor-pointer"
                  >
                    <v-icon size="small" class="me-2"
                      >mdi-folder-outline</v-icon
                    >
                    <span class="text-subtitle-2"
                      >Report of Supplies & Materials Issued</span
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

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
              rounded="lg"
              style="max-width: 400px"
              @keydown.enter="_getAssets(search)"
            />
          </v-col>

          <v-col cols="auto" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getAssets(search)"
            />
          </v-col>
        </v-row>
        <v-col cols="12">
          <v-data-table
            v-model="selectedItems"
            :items="assets"
            :headers="headers"
            hide-default-footer
            item-value="_id"
            show-select
            fixed-header
            :loading="loading"
            class="text-capitalize table-container overflow-y"
          >
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
                      name: 'assets-consumables-stock-card-id',
                      params: { id: item._id },
                    }"
                  >
                    <v-icon size="medium" class="me-2">mdi-eye-outline</v-icon>
                    Stock Card
                  </v-list-item>
                  <v-list-item
                    :to="{
                      name: 'assets-consumables-add-stock-id',
                      params: { id: item._id },
                    }"
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-plus-circle-outline</v-icon
                    >
                    Add Stock
                  </v-list-item>

                  <v-list-item
                    :to="{
                      name: 'assets-consumables-update-id',
                      params: { id: item._id },
                    }"
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-pencil-outline</v-icon
                    >
                    Update Supply
                  </v-list-item>
                  <v-list-item
                    @click="setDeleteAssetDialog({ value: item, dialog: true })"
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-trash-can-outline</v-icon
                    >
                    Delete
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>

    <!-- dialogs -->
    <v-dialog v-model="addStockDialog" width="400" persistent>
      <v-card class="py-3 px-4 rounded-lg" elevation="2" :loading="isLoading">
        <v-card-title class="text-h5 font-weight-regular text-primary-text">
          Add Stock
        </v-card-title>
        <v-card-text>
          <v-form
            ref="form"
            v-model="isFormValid"
            @submit.prevent="submit(stock)"
            class="text-primary-text text-subtitle-2"
          >
            <v-row>
              <v-col cols="12">
                <!-- Reference Number -->
                <label class="mb-2 text-heading-blue-text font-weight-medium">
                  Reference Number
                </label>
                <v-text-field
                  v-model="stock.reference"
                  :rules="[requiredRule]"
                  required
                  clearable
                  variant="outlined"
                  density="compact"
                  class="mb-4"
                />

                <!-- Quantity -->
                <label class="mb-2 text-heading-blue-text font-weight-medium">
                  Quantity
                </label>
                <v-text-field
                  v-model.number="stock.ins"
                  type="number"
                  :rules="[requiredRule]"
                  required
                  clearable
                  variant="outlined"
                  density="compact"
                  class="mb-4"
                />

                <v-row no-gutters class="my-2" v-if="stock.attachment">
                  <nuxt-link
                    :href="`${getOrigin()}/api/public/${stock.attachment}`"
                    target="__blank"
                  >
                    {{ stock.attachment }}
                  </nuxt-link>
                  <v-btn
                    size="md"
                    variant="text"
                    icon="mdi-close"
                    class="ml-1"
                    @click="deleteFile(stock.attachment)"
                  ></v-btn>
                </v-row>

                <!-- Attachment -->
                <label class="mb-2 text-heading-blue-text font-weight-medium">
                  <v-btn
                    block
                    @click="selectAttachment()"
                    variant="tonal"
                    :loading="isUploading"
                  >
                    Add attachment
                  </v-btn>
                </label>

                <v-file-input
                  v-show="false"
                  v-model="file"
                  class="attachment-input"
                  @change="onFileChange"
                ></v-file-input>
              </v-col>
            </v-row>

            <!-- Buttons in Grid -->
            <v-row>
              <v-col cols="6" class="d-flex justify-center align-center">
                <v-btn
                  block
                  color="primary"
                  class="px-9 py-5 d-flex align-center"
                  type="submit"
                  :disabled="!isFormValid"
                >
                  Confirm
                </v-btn>
              </v-col>
              <v-col cols="6" class="d-flex justify-center align-center">
                <v-btn
                  block
                  color="gray"
                  class="px-9 py-5 d-flex align-center"
                  variant="outlined"
                  @click="setAddStockDialog()"
                >
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog :model-value="deleteAssetDialog" max-width="500" persistent>
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
          <v-btn color="primary" @click="deleteAsset(asset._id)" class="mx-2"
            >Delete</v-btn
          >
          <v-btn
            color="primary"
            variant="outlined"
            @click="setDeleteAssetDialog()"
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
import LocalPagination from "~/components/LocalPagination.vue";

definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Consumables");

const {
  getAssets,
  pageRange,
  assets,
  pages,
  page,
  search,
  setAsset,
  asset,
  deleteAssetById,
  selectedAssets,
} = useAsset();
search.value = "";
const loading = ref(false);
async function _getAssets(search = "") {
  loading.value = true;
  try {
    const res = await getAssets({ search, page: page.value });
    pageRange.value = res.pageRange;
    const items = res.items;
    pages.value = res.pages;
    assets.value = items.map((i) => {
      return {
        ...i,
        createdAt: i.createdAt
          ? new Date(i.createdAt).toDateString().slice(4)
          : "",
        data: {
          _id: i._id,
          stockNumber: i.stockNumber,
          description: i.description,
          quantity: 0,
          unitOfMeasurement: i.unitOfMeasurement,
        },
      };
    });
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
}

selectedAssets.value = [];

const selectedItems = ref<Array<string>>([]);

watch(selectedItems, (current) => {
  const filteredAssets = selectedAssets.value.filter((item) =>
    current.includes(item._id ?? "")
  );
  const missingItems = current
    .filter((id) => !filteredAssets.some((item) => item._id === id))
    .map((id) => {
      const item = assets.value.find((i) => i._id === id);
      return {
        _id: item?._id ?? "",
        stockNumber: item?.stockNumber ?? "",
        description: item?.description ?? "",
        quantity: 0,
        unitOfMeasurement: item?.unitOfMeasurement ?? "",
        article: item?.article ?? "",
      } as TAsset;
    });

  selectedAssets.value = [...filteredAssets, ...missingItems];
});

_getAssets();

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [
  { title: "Date", value: "createdAt" },
  { title: "Stock No.", value: "stockNumber", align: "center" },
  { title: "Name", value: "name" },
  { title: "Description", value: "description" },
  { title: "Qty", value: "quantity", align: "center" },
  { title: "Action", value: "action", align: "center" },
];

const addStockDialog = ref(false);

const { requiredRule } = useUtils();

const { stock, setStock, createStock } = useStock();

function setAddStockDialog({ dialog = false, assetId = "" } = {}) {
  setStock();
  addStockDialog.value = dialog;
  stock.value.assetId = assetId;
  if (!dialog) {
    file.value = null;
    _getAssets();
  }
}

const isFormValid = ref(true);

const {
  uploadFile,
  isUploading,
  file,
  deleteFile: _deleteFile,
} = useFileUpload();

async function onFileChange() {
  try {
    const res = await uploadFile();
    stock.value.attachment = res?.id;
  } catch (error) {
    console.log(error);
  }
}

function selectAttachment() {
  const input = document.querySelector(
    ".attachment-input input"
  ) as HTMLInputElement;
  input.click();
}

const isLoading = ref(false);

async function submit(value: TStock) {
  delete value._id;
  delete value.outs;
  delete value.office;
  delete value.balance;
  delete value.createdAt;
  delete value.numberOfDaysToConsume;
  isLoading.value = true;
  try {
    await createStock(value);
    await setAddStockDialog();
  } catch (error) {
    isLoading.value = false;
    console.log(error);
  }
}

const { getOrigin } = useUtils();

const deleteAssetDialog = ref(false);

function setDeleteAssetDialog(
  { value, dialog = false } = {} as { value?: TAsset; dialog?: boolean }
) {
  deleteAssetDialog.value = dialog;
  setAsset(value);
}

async function deleteFile(value: string) {
  try {
    await _deleteFile(value);
    stock.value.attachment = "";
  } catch (error) {
    console.log(error);
  }
}

async function deleteAsset(id: string | undefined) {
  if (!id) {
    throw new Error("Invalid ID.");
  }

  try {
    await deleteAssetById(id);
    await setDeleteAssetDialog();
    await _getAssets();
  } catch (error) {
    throw new Error("Failed to delete.");
  }
}

const router = useRouter();

async function handleReceiveClick() {
  // Check if there are selected items
  if (selectedItems.value.length > 0) {
    // Filter selected assets
    const selectedAssetsList = assets.value
      .filter((asset) => selectedItems.value.includes(asset._id))
      .map((asset) => ({
        _id: asset._id,
        stockNumber: asset.stockNumber,
        description: asset.description,
        quantity: 1,
        unitOfMeasurement: asset.unitOfMeasurement,
        name: asset.name,
        article: asset.article,
        numberOfDaysToConsume: 0,
      }));
    selectedAssets.value = selectedAssetsList;
  }
  router.push({ name: "assets-consumables-receive" });
}
</script>

<style scoped>
:deep() .v-data-table tbody tr:not(:last-child) {
  border-bottom: 1px solid rgb(236, 0, 0) !important;
}
</style>
