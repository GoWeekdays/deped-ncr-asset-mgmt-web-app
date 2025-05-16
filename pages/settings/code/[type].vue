<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-card-title>
          <v-row
            no-gutters
            align="center"
            justify="space-between"
            class="w-100"
          >
            <v-col cols="6" sm="8" md="9" class="text-primary-text">
              <h1
                class="font-weight-regular text-capitalize"
                :class="{ 'text-h5': !isDesktop, 'text-h4': isDesktop }"
              >
                {{ name }} codes
              </h1>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="d-flex align-center justify-end"
            >
              <v-btn
                color="primary"
                class="text-button"
                prepend-icon="mdi-plus"
                @click="setDialog({ dialog: true })"
              >
                Create
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row no-gutters class="py-3">
          <template v-if="!isDesktop">
            <v-select
              v-model="selectedCodeType"
              :items="codeTypes"
              item-title="title"
              variant="outlined"
              item-value="params.type"
              @update:model-value="navigateToCodeType"
              class="w-100 font-weight-medium rounded-lg"
              dense
            ></v-select>
          </template>
          <template v-else>
            <v-btn
              v-for="(codeType, codeTypeIndex) in codeTypes"
              :key="codeTypeIndex"
              :to="codeType"
              class="font-weight-medium px-7 py-6 rounded-lg d-flex justify-center align-center"
              :color="
                route.params.type === codeType.params.type ? 'primary' : 'grey'
              "
              :variant="
                route.params.type === codeType.params.type ? 'elevated' : 'text'
              "
            >
              {{ codeType.title }}
            </v-btn>
          </template>
        </v-row>

        <v-row no-gutters>
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
                @keydown.enter="_getAssetCodesByType(search)"
              />
            </v-col>

            <v-col cols="auto" class="d-flex justify-end align-center">
              <span class="mr-2 text-caption text-fontgray">
                {{ pageRange }}
              </span>
              <local-pagination
                v-model="page"
                :length="pages"
                @update:value="_getAssetCodesByType(search)"
              />
            </v-col>
          </v-row>
          <v-col cols="12">
            <v-data-table
              :items="assetCodes"
              :headers="headers"
              hide-default-footer
              fixed-header
              :loading="loading"
              class="text-capitalize table-container overflow-y"
              style="max-height: calc(100vh - 310px)"
            >
              <template #item.actions="{ item }">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-icon
                      size="large"
                      class="text-primary-text"
                      v-bind="props"
                    >
                      {{
                        isDesktop ? "mdi-dots-horizontal" : "mdi-dots-vertical"
                      }}
                    </v-icon>
                  </template>

                  <v-list class="pa-0">
                    <v-list-item
                      @click="setDialog({ dialog: true, value: item })"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-pencil-outline</v-icon
                      >
                      Update Code
                    </v-list-item>
                    <v-list-item
                      @click="
                        setDeleteAssetCodeDialog({
                          dialog: true,
                          value: item,
                        })
                      "
                    >
                      <v-icon size="medium" class="me-2">
                        mdi-trash-can-outline
                      </v-icon>
                      Delete
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-dialog v-model="codeDialog" width="400">
      <v-card class="pa-8 rounded-lg">
        <v-form v-model="valid" @submit.prevent="submit(assetCode)">
          <v-row no-gutters>
            <v-col cols="12">
              <v-row justify="start">
                <span v-if="assetCode._id" class="font-weight-regular text-h5"
                  >Update</span
                >
                <span v-else class="font-weight-regular text-h5">Create</span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-6">
              <span class="font-weight-medium">Code</span>
              <v-text-field
                v-model="assetCode.code"
                variant="outlined"
                :rules="[requiredRule]"
                persistent-hint
              ></v-text-field>
            </v-col>

            <v-col cols="12" class="my-4">
              <span class="font-weight-medium">Value</span>
              <v-text-field
                v-model="assetCode.value"
                variant="outlined"
                :rules="[requiredRule]"
                persistent-hint
              ></v-text-field>
            </v-col>
            <v-col v-if="name === 'ppe-code'" cols="12" class="my-4">
              <span class="font-weight-medium">Year</span>
              <v-text-field
                v-model="assetCode.year"
                variant="outlined"
                :rules="[requiredRule]"
                type="number"
                persistent-hint
              ></v-text-field>
            </v-col>

            <v-col v-if="errorMessage" cols="12">
              <span class="text-error">* {{ errorMessage }}</span>
            </v-col>

            <v-col cols="12" class="mt-6">
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn block color="primary" type="submit" :disabled="!valid"
                    >submit</v-btn
                  >
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn
                    block
                    variant="outlined"
                    color="fontgray"
                    @click="setDialog()"
                    >cancel</v-btn
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog :model-value="deleteAssetCodeDialog" max-width="500" persistent>
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
          <v-btn
            color="primary"
            @click="deleteAssetCode(assetCode._id)"
            class="mx-2"
            >Delete</v-btn
          >
          <v-btn
            color="primary"
            variant="outlined"
            @click="setDeleteAssetCodeDialog()"
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
import { useDisplay } from "vuetify";

const router = useRouter();
const route = useRoute();
const { mdAndUp } = useDisplay();
const isDesktop = computed(() => mdAndUp.value);
definePageMeta({
  middleware: ["auth", "personnel"],
});

const codeTypes = [
  {
    title: "Serial Codes",
    name: "settings-code-type",
    params: { type: "serial-code" },
  },
  {
    title: "SEP Codes",
    name: "settings-code-type",
    params: { type: "sep-code" },
  },
  {
    title: "PPE Codes",
    name: "settings-code-type",
    params: { type: "ppe-code" },
  },
  {
    title: "Location Codes",
    name: "settings-code-type",
    params: { type: "location-code" },
  },
];

// Get the current type from the route params
const routeType = useRoute().params.type as string;

// Find the selected code type from the array
const selectedCodeType = ref(
  codeTypes.find((item) => item.params.type === routeType) || {
    title: "School Divisions",
  }
);

// Set the page title dynamically
usePageTitle(selectedCodeType.value.title);

const name = useRoute().params.type as string;

// const selectedCodeType = ref("");

onMounted(() => {
  selectedCodeType.value = route.params.type as string;
});

const navigateToCodeType = (selectedType: string) => {
  router.push({
    name: "settings-code-type",
    params: { type: selectedType },
  });
};

const headers = computed(() => {
  const items = [];

  items.push(
    { title: "Code", value: "code" },
    { title: "Value", value: "value" }
  );
  if (name === "ppe-code") {
    items.push({ title: "Year", value: "year", align: "center" });
  }
  items.push({
    title: "Actions",
    value: "actions",
    align: "center",
    width: "140",
  });
  return items;
});

const codeDialog = ref(false);

function setDialog(
  { dialog = false, value } = {} as { dialog: boolean; value?: TAssetCode }
) {
  codeDialog.value = dialog;

  if (!value) {
    assetCode.value = { code: "", value: "", year: undefined, type: name };
    errorMessage.value = "";
  } else {
    setAssetCode(value);
  }
}

const {
  assetCode,
  assetCodes,
  setAssetCode,
  createAssetCode,
  updateAssetCodeById,
  getAssetCodesByType,
  search,
  page,
  pages,
  pageRange,
  deleteAssetCodeById,
} = useAssetCodes();

setAssetCode();

const loading = ref(false);

async function _getAssetCodesByType(search = "") {
  loading.value = true;

  const currentPage = page.value;

  try {
    const res = await getAssetCodesByType({
      search,
      type: name,
      page: currentPage,
    });
    assetCodes.value = res.items;
    pages.value = res.pages;
    pageRange.value = res.pageRange;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

_getAssetCodesByType();

const { requiredRule } = useUtils();

const valid = ref(false);
const errorMessage = ref("");

async function submit(value: TAssetCode) {
  try {
    let payload: any = {
      code: value.code,
      value: value.value,
      type: selectedCodeType.value,
    };

    if (name === "ppe-code") {
      payload.year = Number(value.year);
    }

    if (value._id) {
      delete payload.type;

      console.log("Updating ID:", value._id, "with payload:", payload);
      await updateAssetCodeById(value._id, payload);
      await _getAssetCodesByType();
    } else {
      console.log("Creating new asset code with payload:", payload);
      await createAssetCode(payload);
      await _getAssetCodesByType();
    }

    setDialog();
  } catch (error: any) {
    console.error("Error saving code:", error);
    errorMessage.value =
      error.data?.message || "An error occurred while saving the code.";
  }
}

const deleteAssetCodeDialog = ref(false);

function setDeleteAssetCodeDialog(
  { dialog = false, value } = {} as { dialog: boolean; value: TAssetCode }
) {
  deleteAssetCodeDialog.value = dialog;
  if (value) {
    assetCode.value = value;
  }
}

async function deleteAssetCode(id: string | undefined) {
  if (!id) {
    throw new Error("Invalid ID.");
  }

  try {
    await deleteAssetCodeById(id);
    await setDeleteAssetCodeDialog();
    await setAssetCode();
    await _getAssetCodesByType();
  } catch (error) {
    console.error(error);
  }
}
</script>
