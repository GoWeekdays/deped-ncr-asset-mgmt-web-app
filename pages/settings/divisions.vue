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
              DepEd Division
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
                style="max-width: 400px"
                rounded="lg"
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
            <v-data-table
              :items="divisions"
              :headers="headers"
              hide-default-footer
              item-value="data"
              fixed-header
              :loading="loading"
              class="table-container overflow-y"
            >
              <template #item.name="{ item }">
                <span class="text-capitalize">{{ item.name }}</span>
              </template>
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
                      Update DepEd Division
                    </v-list-item>
                    <v-list-item
                      @click="
                        setDeleteSchoolDialog({ dialog: true, value: item })
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
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <v-dialog v-model="codeDialog" width="400">
      <v-card class="pa-8 rounded-lg">
        <v-form v-model="valid" @submit.prevent="submit(division)">
          <v-row no-gutters>
            <v-col cols="12" class="pb-5">
              <v-row justify="start">
                <span v-if="division._id" class="font-weight-regular text-h5">
                  Update DepEd Division
                </span>
                <span v-else class="font-weight-regular text-h5">
                  Add DepEd Division
                </span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-2">
              <InputLabel for="divisionName" title="Division Name" />
              <v-text-field
                v-model="division.name"
                variant="outlined"
                density="compact"
                :rules="[requiredRule]"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" class="mt-2">
              <InputLabel for="email" title="Email" />
              <v-text-field
                v-model="division.email"
                type="email"
                variant="outlined"
                density="compact"
                persistent-hint
              />
            </v-col>
            <v-col v-if="errorMessage" cols="12">
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
                  <v-btn block @click="setDialog()">Cancel</v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- Dialog for Deleting School -->
    <v-dialog v-model="deleteSchoolDialog" max-width="500" persistent>
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
            @click="deleteSchool(division._id)"
            class="mx-2"
          >
            Delete
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            @click="setDeleteSchoolDialog()"
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

usePageTitle("DepEd Divisions");

const {
  getDivisions,
  createDivision,
  updateDivisionById,
  deleteDivisionById,
  search,
  division,
  setDivision,
  divisions,
  page,
  pages,
  pageRange,
} = useDivision();

const headers = computed(() => [
  { title: "Division", value: "name" },
  { title: "Email", value: "email" },
  {
    title: "Actions",
    value: "actions",
    align: "center",
    width: "140",
  },
]);

const loading = ref(false);
const valid = ref(false);
const errorMessage = ref("");

async function _getDivisions(search = "") {
  loading.value = true;

  const currentPage = page.value;

  try {
    const res = await getDivisions({
      search,
      page: currentPage,
    });
    divisions.value = res.items;
    pages.value = res.pages;
    pageRange.value = res.pageRange;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

_getDivisions();

const { requiredRule, emailRule } = useUtils();
const codeDialog = ref(false);

function setDialog(
  { dialog = false, value } = {} as { dialog: boolean; value?: TDivision }
) {
  codeDialog.value = dialog;
  division.value = value || { name: "" };

  if (!value) {
    errorMessage.value = "";
  }

  if (value) {
    setDivision(value);
  }
}

async function submit(value: TSchoolDivision) {
  try {
    const { _id, createdAt, updatedAt, deletedAt, ...updateData } = value;
    if (_id) {
      await updateDivisionById({ ...updateData, _id });
      const index = divisions.value.findIndex((school) => school._id === _id);
      if (index !== -1) {
        divisions.value[index] = {
          ...divisions.value[index],
          ...updateData,
        };
      }
    } else {
      await createDivision(updateData);
      await _getDivisions();
    }
    setDialog();
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.data?.message;
  }
}

const deleteSchoolDialog = ref(false);

function setDeleteSchoolDialog(
  { dialog = false, value } = {} as { dialog: boolean; value: TSchool }
) {
  deleteSchoolDialog.value = dialog;
  if (value) {
    division.value = value;
  }
}

async function deleteSchool(id?: string) {
  if (!id) {
    return;
  }

  try {
    await deleteDivisionById(id);
    await setDeleteSchoolDialog();
    await setDivision();
    await _getDivisions();
  } catch (error) {
    console.error("Failed to delete school:", error);
  }
}

const items = computed(() => {
  return divisions.value.map((i) => ({ title: i.name, value: i._id }));
});
</script>
