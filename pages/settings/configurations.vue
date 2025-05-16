<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row class="py-4" align="center" justify="space-between">
          <v-col cols="6" sm="8" md="9" class="text-primary-text">
            <h1
              class="font-weight-regular text-capitalize"
              :class="{ 'text-h6': !isDesktop, 'text-h4': isDesktop }"
            >
              Configurations
            </h1>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
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
                @keydown.enter="_getConfiguration(search)"
              />
            </v-col>

            <v-col cols="auto" class="d-flex justify-end align-center">
              <span class="mr-2 text-caption text-fontgray">
                {{ pageRange }}
              </span>
              <local-pagination
                v-model="page"
                :length="pages"
                @update:value="_getConfiguration(search)"
              />
            </v-col>
          </v-row>

          <v-col cols="12">
            <v-data-table
              :items="configurations"
              :headers="headers"
              hide-default-footer
              item-value="data"
              fixed-header
              :loading="loading"
              class="text-capitalize table-container overflow-y"
            >
              <template #item.actions="{ item }">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-icon
                      size="large"
                      class="text-primary-text"
                      v-bind="props"
                    >
                      mdi-dots-horizontal
                    </v-icon>
                  </template>
                  <v-list class="pa-0">
                    <v-list-item
                      @click="setDialog({ dialog: true, value: item })"
                    >
                      <v-icon size="medium" class="me-2">
                        mdi-pencil-outline
                      </v-icon>
                      Update Configuration
                    </v-list-item>
                    <v-list-item
                      @click="
                        setDeleteConfigurationDialog({
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

    <!-- Dialog for Creating/Editing Configuration -->
    <v-dialog v-model="codeDialog" width="400">
      <v-card class="rounded-lg">
        <v-form v-model="valid" @submit.prevent="submit(configurationCode)">
          <v-row no-gutters class="pa-8">
            <v-col cols="12" class="pb-5">
              <v-row justify="start">
                <span
                  v-if="configurationCode._id"
                  class="font-weight-regular text-h5"
                >
                  Update Configuration
                </span>
                <span v-else class="font-weight-regular text-h5">
                  Create Configuration
                </span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-6">
              <InputLabel for="name" title="Name" />
              <v-text-field
                v-model="configurationCode.name"
                variant="outlined"
                :rules="[requiredRule]"
                persistent-hint
              />
            </v-col>

            <v-col cols="12" class="my-4">
              <InputLabel for="value" title="Value" />
              <v-text-field
                v-model="configurationCode.value"
                variant="outlined"
                persistent-hint
              />
            </v-col>

            <v-col v-if="errorMessage" cols="12">
              <span class="text-error">* {{ errorMessage }}</span>
            </v-col>

            <v-col cols="12" class="mt-6">
              <v-row>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn color="primary" block type="submit" :disabled="!valid">
                    Submit
                  </v-btn>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="6">
                  <v-btn block @click="setDialog()">Cancel</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog for Deleting Configuration -->
    <v-dialog v-model="deleteConfigurationDialog" max-width="500" persistent>
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
            @click="deleteConfiguration(configurationCode._id)"
            class="mx-2"
          >
            Delete
          </v-btn>

          <v-btn
            color="primary"
            variant="outlined"
            @click="setDeleteConfigurationDialog()"
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

const { mdAndUp } = useDisplay();
const isDesktop = computed(() => mdAndUp.value);
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Configurations");

const {
  getConfigurations,
  createConfiguration,
  deleteConfigurationById,
  search,
  configurations,
  updateConfigurationById,
  setConfigurationCode,
  configurationCode,
  page,
  pages,
  pageRange,
} = useConfiguration();

const headers = computed(() => [
  { title: "Name", value: "name" },
  { title: "Value", value: "value" },
  {
    title: "Actions",
    value: "actions",
    align: "center",
    width: "140",
  },
]);

const loading = ref(false);
const selectedConfiguration = ref();
const valid = ref(false);
const errorMessage = ref("");

async function _getConfiguration(search = "") {
  loading.value = true;

  const currentPage = page.value;

  try {
    const res = await getConfigurations({
      search,
      page: currentPage,
    });
    configurations.value = res.items;
    pages.value = res.pages;
    pageRange.value = res.pageRange;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

_getConfiguration();

const { requiredRule } = useUtils();
const codeDialog = ref(false);

function setDialog(
  { dialog = false, value } = {} as { dialog: boolean; value?: TConfiguration }
) {
  codeDialog.value = dialog;
  configurationCode.value = value || { _id: "", name: "", value: "" };

  if (!value) {
    errorMessage.value = "";
  }

  if (value) {
    setConfigurationCode(value);
  }
}

async function submit(value: TConfiguration) {
  loading.value = true;
  try {
    if (configurationCode.value._id) {
      await updateConfigurationById(configurationCode.value);
      const index = configurations.value.findIndex(
        (config) => config._id === configurationCode.value._id
      );
      if (index !== -1) {
        configurations.value[index] = {
          ...configurations.value[index],
          ...configurationCode.value,
        };
      }
    } else {
      // Create new configuration
      await createConfiguration(value);
      await _getConfiguration();
    }
    setDialog();
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.response?.data?.message || "An error occurred";
  } finally {
    loading.value = false;
  }
}

const deleteConfigurationDialog = ref(false);

function setDeleteConfigurationDialog(
  { dialog = false, value } = {} as { dialog: boolean; value: TConfiguration }
) {
  deleteConfigurationDialog.value = dialog;
  if (value) {
    configurationCode.value = value;
  }
}

async function deleteConfiguration(id?: string) {
  if (!id) {
    return;
  }

  try {
    await deleteConfigurationById(id);
    await setDeleteConfigurationDialog();
    await setConfigurationCode();
    await _getConfiguration();
  } catch (error) {
    console.error(error);
  }
}
</script>
