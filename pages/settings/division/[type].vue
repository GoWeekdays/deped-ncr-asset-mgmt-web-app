<template>
  <v-row
    class="py-2"
    justify="center"
    align="start"
    color="page-background-color header-row"
  >
    <v-col cols="12" lg="10" md="10">
      <v-card class="pa-6 responsive-card position-relative">
        <!-- Header with Action Buttons -->
        <v-row class="py-4" align="center" justify="space-between">
          <v-col cols="6" sm="8" md="9" class="text-primary-text">
            <h1
              class="font-weight-regular text-capitalize"
              :class="{ 'text-h6': !isDesktop, 'text-h4': isDesktop }"
            >
              {{ divisionPageTitle }}
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

        <!-- Search and Pagination -->
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
                style="max-width: 400px" rounded="lg"
                @keydown.enter="_getDivisions(search)"
              />
            </v-col>

            <v-col cols="auto" class="d-flex justify-end align-center">
              <span class="mr-2 text-caption text-fontgray">
                {{ pageRange }}
              </span>
              <local-pagination
                v-model="page"
                :length="pages"
                @update:value="_getDivisions(search)"
              />
            </v-col>
          </v-row>

          <!-- Data Table -->
          <v-col cols="12">
            <div style="max-height: calc(100vh - 350px); overflow-y: auto">
              <v-data-table
                :items="divisions"
                :headers="headers"
                hide-default-footer
                density="compact"
                item-value="data"
                :loading="loading"
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
                        <v-icon size="medium" class="me-2"
                          >mdi-pencil-outline</v-icon
                        >
                        Edit
                      </v-list-item>
                      <v-list-item
                        @click="
                          setDeleteDivisionDialog({ dialog: true, value: item })
                        "
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
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- Dialog for Creating/Editing Office -->
    <v-dialog v-model="codeDialog" width="400">
      <v-card>
        <v-form v-model="valid" @submit.prevent="submit(division)">
          <v-row no-gutters class="pa-8">
            <v-col cols="12" class="pb-5">
              <v-row justify="start">
                <span v-if="division._id" class="font-weight-regular text-h5">
                  {{ getDivisionActionText("Update") }}
                </span>
                <span v-else class="font-weight-regular text-h5">
                  {{ getDivisionActionText("Add") }}
                </span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-6">
              <InputLabel for="schoolDivision" title="School Division" />
              <v-text-field
                v-model="division.name"
                variant="outlined"
                :rules="[requiredRule]"
                persistent-hint
              />
            </v-col>

            <v-col v-if="isDivision" cols="12" class="my-4">
              <InputLabel for="email" title="Email" />
              <v-text-field
                v-model="division.email"
                variant="outlined"
                :rules="[emailRule]"
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

    <!-- Dialog for Deleting Office -->
    <v-dialog v-model="deleteOfficeDialog" max-width="500" persistent>
      <v-card class="pa-8 rounded-lg" elevation="2">
        <v-card-title class="text-center mb-2">
          <v-avatar size="50" class="mx-auto">
            <v-icon size="32" color="secondary" class="icon-background"
              >mdi-alert-outline</v-icon
            >
          </v-avatar>
        </v-card-title>
        <div class="text-center my-1">
          <h2 class="text-h5 font-weight-bold text-primary-text">Are you sure?</h2>
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
            @click="deleteOffice(division._id)"
            class="mx-2"
          >
            Delete
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            @click="setDeleteDivisionDialog()"
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

const {
  getDivisions,
  createDivision,
  divisionPageTitle,
  updateDivisionById,
  deleteDivisionById,
  isSchool,
  isDivision,
  search,
  divisions,
  setDivision,
  division,
  page,
  pages,
  pageRange,
} = useDivision();

const headers = computed(() => {
  const items: Array<THeader> = [];

  items.push({ title: "Name", value: "name" });

  if (!isSchool.value) {
    items.push({ title: "Email", value: "email" });
  }

  // Add the "Actions" column
  items.push({
    title: "Actions",
    value: "actions",
    align: "center",
    width: "140",
  });

  return items;
});

const loading = ref(false);
const selectedOffice = ref();
const valid = ref(false);
const errorMessage = ref("");

async function _getDivisions(search = "") {
  loading.value = true;

  try {
    await getDivisions({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

_getDivisions();

function getDivisionActionText(action: "Add" | "Update"): string {
  if (isDivision.value) {
    return `${action} DepEd Division`;
  }
  if (isSchool.value) {
    return `${action} School Division`;
  }
  return `${action} Division`;
}

const { requiredRule, emailRule } = useUtils();
const codeDialog = ref(false);

function setDialog(
  { dialog = false, value } = {} as { dialog: boolean; value?: TDivision }
) {
  codeDialog.value = dialog;
  division.value = value || { _id: "", name: "", email: "" };

  if (!value) {
    errorMessage.value = "";
  }

  if (value) {
    setDivision(value);
  }
}

async function submit(value: TDivision) {
  try {
    value.type = "school";

    if (value._id) {
      await updateDivisionById(value);
      const index = divisions.value.findIndex(
        (office) => office._id === value._id
      );
      if (index !== -1) {
        divisions.value[index] = { ...divisions.value[index], ...value };
      }
    } else {
      await createDivision(value);
      await _getDivisions();
    }
    setDialog();
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.data?.message;
  }
}

const deleteOfficeDialog = ref(false);

function setDeleteDivisionDialog(
  { dialog = false, value } = {} as { dialog: boolean; value: TDivision }
) {
  deleteOfficeDialog.value = dialog;
  if (value) {
    division.value = value;
  }
}

async function deleteOffice(id?: string) {
  if (!id) {
    return;
  }

  try {
    await deleteDivisionById(id);
    await setDeleteDivisionDialog();
    await setDivision();
    await _getDivisions();
  } catch (error) {
    console.error("Failed to delete office:", error);
  }
}

const items = computed(() => {
  return divisions.value.map((i) => ({ title: i.name, value: i._id }));
});
</script>
