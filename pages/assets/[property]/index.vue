<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="12" md="11" lg="12" xl="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row class="pb-4" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4 class="text-h4 font-weight-regular">
              {{ title }}
            </h4>
          </v-col>

          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              :to="{ name: 'assets-property-add', params: { property: type } }"
              color="primary"
              class="pa-4 px-6 rounded-lg mr-2 d-flex text-capitalize align-center text-button font-weight-medium"
              prepend-icon="mdi-plus"
            >
              Add Property
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
                    name: 'assets-property-report-on-the-physical-count',
                  }"
                >
                  <v-list-item-title
                    class="text-decoration-none text-primary-text cursor-pointer"
                  >
                    <v-icon size="small" class="me-2"
                      >mdi-folder-outline</v-icon
                    >
                    <span v-if="isSEP" class="text-subtitle-2"
                      >Report of Physical Count of Semi-Expendable</span
                    >
                    <span v-else class="text-subtitle-2"
                      >Report of Physical Count of Property, Plant and
                      Equipment</span
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <!-- Search and Pagination -->
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
              @keydown.enter="_getAssets(search)"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">
            <span class="mr-1 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getAssets(search)"
            />
          </v-col>
        </v-row>

        <!-- Table -->
        <v-row>
          <v-col cols="12">
            <v-data-table
              :items="assets"
              :headers="headers"
              key="_id"
              hide-default-footer
              :loading="loading"
              class="text-capitalize table-container overflow-y"
              fixed-header
              color="primary"
            >
              <template #item.condition="{ item }">
                <v-chip
                  v-if="item.goodCondition"
                  color="green"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon>
                  <span class="font-weight-bold mr-1">{{
                    item.goodCondition
                  }}</span>
                  Good Condition
                </v-chip>
                <v-chip
                  v-if="item.reissued"
                  color="blue"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{
                    item.reissued
                  }}</span>
                  Reissued
                </v-chip>
                <v-chip
                  v-if="item.returned"
                  color="yellow"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{
                    item.returned
                  }}</span>
                  Returned
                </v-chip>
                <v-chip
                  v-if="item.transferred"
                  color="purple"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{
                    item.transferred
                  }}</span>
                  Transferred
                </v-chip>
                <v-chip
                  v-if="item.forDisposal"
                  color="red"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{
                    item.forDisposal
                  }}</span>
                  For Disposal
                </v-chip>
                <v-chip
                  v-if="item.forRepair"
                  color="orange"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{
                    item.forRepair
                  }}</span>
                  For Repair
                </v-chip>

                <v-chip
                  v-if="item.lost"
                  color="red"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{ item.lost }}</span>
                  Lost
                </v-chip>

                <v-chip
                  v-if="item.stolen"
                  color="red"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{ item.stolen }}</span>
                  Stolen
                </v-chip>

                
                <v-chip
                  v-if="item.damaged"
                  color="red"
                  class="text-capitalize px-2 mx-1 my-1"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  ><span class="font-weight-bold mr-1">{{ item.damaged }}</span>
                  Damaged
                </v-chip>
              </template>

              <template #item.action="{ item }">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-icon
                      size="large"
                      class="text-primary-text"
                      v-bind="props"
                      >mdi-dots-horizontal</v-icon
                    >
                  </template>
                  <v-list class="pa-0">
                    <v-list-item
                      :to="{
                        name: 'assets-property-property-card-id',
                        params: { property: type, id: item._id },
                      }"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-eye-outline</v-icon
                      >
                      {{ cardLabel }}
                    </v-list-item>
                    <v-list-item
                      :to="{
                        name: 'assets-property-issue-id',
                        params: { property: type, id: item._id },
                      }"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-note-text-outline</v-icon
                      >
                      Issue
                    </v-list-item>
                    <v-list-item
                      :to="{
                        name: 'assets-property-update-id',
                        params: { property: type, id: item._id },
                      }"
                    >
                      <v-icon size="medium" class="me-2">mdi-pencil</v-icon>
                      Update
                    </v-list-item>

                    <v-list-item
                      v-if="
                        item.goodCondition > 0 &&
                        !item.reissued &&
                        !item.transferred &&
                        !item.returned &&
                        !item.forDisposal &&
                        !item.forRepair
                      "
                      @click="setDeleteDialog({ dialog: true, id: item._id })"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-trash-can-outline</v-icon
                      >
                      Delete
                    </v-list-item>

                    <!-- <v-list-item
                      @click="
                        setUpdateConditionDialog({
                          dialog: true,
                          id: item._id,
                        })
                      "
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-sync-circle</v-icon
                      >
                      Update condition
                    </v-list-item> -->
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- Delete Dialog -->
    <v-dialog :model-value="deleteDialog" max-width="500" persistent>
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
            This action cannot be undone. All files associated with this field
            will be lost.
          </p>
        </v-card-text>
        <v-row class="justify-center pa-4">
          <v-btn
            color="primary"
            @click="_deleteAssetById(asset._id)"
            class="mx-2"
            >Delete</v-btn
          >
          <v-btn
            @click="setDeleteDialog()"
            class="mx-2"
            color="primary"
            variant="outlined"
          >
            Cancel
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>

    <v-dialog v-model="updateConditionDialog" max-width="400px">
      <v-card class="py-2 px-3 rounded-lg" elevation="2">
        <v-card-title>
          <span class="headline">Update Property Condition</span>
        </v-card-title>

        <v-card-text>
          <v-select
            v-model="selectedCondition"
            :items="conditionItems"
            variant="outlined"
            placeholder="Update Condition"
            item-value="value"
            item-text="label"
            outlined
            dense
          />

          <v-row justify="center" align="center">
            <v-col cols="6">
              <v-btn
                @click="asset._id && _updateConditionAssetById(asset._id)"
                color="primary"
                class="text-uppercase"
                block
              >
                Confirm
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                @click="setUpdateConditionDialog()"
                color="primary"
                variant="outlined"
                block
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Property");

const {
  getAssets,
  assets,
  pageRange,
  search,
  pages,
  page,
  title,
  isSEP,
  isPPE,
  propertyType,
  type,
  deleteAssetById,
  asset,
  setAsset,
  updateCondition,
} = useAsset();
search.value = "";

usePageTitle(
  isSEP
    ? "Semi-Expendable Property"
    : isPPE
      ? "Property, Plant and Equipment"
      : "Requisition"
);

const loading = ref(false);

async function _getAssets(search = "") {
  loading.value = true;
  try {
    const res = await getAssets({
      search,
      page: page.value,
      type: propertyType.value,
    });
    pageRange.value = res.pageRange;
    pages.value = res.pages;
    assets.value = res.items.map((i) => ({
      ...i,
      createdAt: new Date(i.createdAt ?? "").toDateString().slice(4),
    }));
  } catch (error) {
    console.error(error);
  }

  loading.value = false;
}

_getAssets();
setAsset();

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [
  { title: "Date", value: "createdAt" },
  { title: "Property No.", value: "stockNumber", align: "center" },
  { title: "Name", value: "name" },
  { title: "Description", value: "description" },
  { title: "Initial Qty", value: "initialQty", align: "center" },
  { title: "Balance", value: "quantity", align: "center" },
  { title: "Condition", value: "condition", align: "center" },
  { title: "Action", value: "action", align: "center" },
];

const cardLabel = computed(() => {
  return isSEP ? "SEP Card" : isPPE ? "Property Card" : "Unknown Card";
});

function getStatusColor(status: string): string {
  switch (status) {
    case "good-condition":
      return "green";
    case "reissued":
      return "blue";
    case "returned":
      return "yellow";
    case "transferred":
      return "purple";
    case "for-repair":
      return "orange";
    case "for-disposal":
      return "red";
    default:
      return "grey";
  }
}

const deleteDialog = ref(false);
const deleteError = ref("");

function setDeleteDialog({ dialog = false, id = "" } = {}) {
  deleteDialog.value = dialog;
  asset.value._id = id;
}

async function _deleteAssetById(id = "") {
  try {
    await deleteAssetById(id);
    await setDeleteDialog();
    _getAssets();
  } catch (error: any) {
    deleteError.value = error.data.message;
  }
}

const updateConditionDialog = ref(false);
const updateError = ref("");
const selectedCondition = ref<string | null>("");

const conditionItems = [
  { title: "Returned", value: "returned" },
  { title: "Transfer", value: "transfer" },
  { title: "For Disposal", value: "for-disposal" },
  { title: "For Repair", value: "for-repair" },
];

function setUpdateConditionDialog({ dialog = false, id = "" } = {}) {
  updateConditionDialog.value = dialog;
  asset.value._id = id;
}

async function _updateConditionAssetById(id: string | undefined) {
  try {
    if (id === undefined) {
      throw new Error("Asset ID is undefined");
    }

    if (selectedCondition.value) {
      await updateCondition(id, selectedCondition.value as TCondition);
      await setUpdateConditionDialog();
      await _getAssets();
    } else {
      throw new Error("No condition selected");
    }
  } catch (error: any) {
    updateError.value = error.data?.message || error.message;
  }
}
</script>
