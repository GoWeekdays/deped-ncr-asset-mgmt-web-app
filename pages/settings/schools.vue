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
              Schools
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
                @keydown.enter="_getSchool(search)"
              />
            </v-col>

            <v-col cols="auto" class="d-flex justify-end align-center">
              <span class="mr-2 text-caption text-fontgray">
                {{ pageRange }}
              </span>
              <local-pagination
                v-model="page"
                :length="pages"
                @update:value="_getSchool(search)"
              />
            </v-col>
          </v-row>

          <!-- Data Table -->
          <v-col cols="12">
            <v-data-table
              :items="schools"
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
                      <v-icon size="medium" class="me-2"
                        >mdi-pencil-outline</v-icon
                      >
                      Update School
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
        <v-form v-model="valid" @submit.prevent="submit(school)">
          <v-row no-gutters>
            <v-col cols="12" class="pb-5">
              <v-row justify="start">
                <span v-if="school._id" class="font-weight-regular text-h5">
                  Update School
                </span>
                <span v-else class="font-weight-regular text-h5">
                  Add School
                </span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-2">
              <InputLabel for="schoolName" title="School Name" />
              <v-text-field
                v-model="school.name"
                variant="outlined"
                density="compact"
                :rules="[requiredRule]"
                persistent-hint
              />
            </v-col>

            <v-col cols="12" class="mt-2">
              <InputLabel for="schoolDivision" title="School Division" />
              <v-select
                v-model="school.divisionId"
                :items="_divisions"
                variant="outlined"
                density="compact"
                :rules="[requiredRule]"
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
          <v-btn color="primary" @click="deleteSchool(school._id)" class="mx-2">
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

usePageTitle("Schools");

const {
  getSchools,
  createSchool,
  updateSchoolById,
  deleteSchoolById,
  search,
  schools,
  setSchoolCode,
  school,
  page,
  pages,
  pageRange,
} = useSchool();

const { getSchoolDivisions } = useSchoolDivisions();

type TDivisionOptions = {
  title: string;
  value: string;
};

const _divisions = ref<Array<TDivisionOptions>>([]);

async function _getDivisions(search = "") {
  try {
    const res = await getSchoolDivisions({ limit: 20, search });
    _divisions.value = res.items.map((i) => ({
      title: i.name,
      value: i._id ?? "",
    }));
  } catch (error) {
    console.log(error);
  }
}

_getDivisions();

const headers = computed(() => [
  { title: "School", value: "name" },
  { title: "School Division", value: "divisionName" },
  {
    title: "Actions",
    value: "actions",
    align: "center",
    width: "140",
  },
]);

const loading = ref(false);
const selectedSchool = ref();
const valid = ref(false);
const errorMessage = ref("");

async function _getSchool(search = "") {
  loading.value = true;

  const currentPage = page.value;

  try {
    const res = await getSchools({
      search,
      page: currentPage,
    });
    schools.value = res.items;
    pages.value = res.pages;
    pageRange.value = res.pageRange;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

_getSchool();

const { requiredRule } = useUtils();
const codeDialog = ref(false);

function setDialog(
  { dialog = false, value } = {} as { dialog: boolean; value?: TSchool }
) {
  codeDialog.value = dialog;
  school.value = value || { name: "", divisionId: "" };

  if (!value) {
    errorMessage.value = "";
  }

  if (value) {
    setSchoolCode(value);
  }
}

async function submit(value: TSchool) {
  try {
    const { _id, divisionName, ...updateData } = value;

    if (_id) {
      await updateSchoolById({ ...updateData, _id });
      const index = schools.value.findIndex((school) => school._id === _id);
      if (index !== -1) {
        schools.value[index] = { ...schools.value[index], ...updateData };
      }
    } else {
      await createSchool(updateData);
      await _getSchool();
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
    school.value = value;
  }
}

async function deleteSchool(id?: string) {
  if (!id) {
    return;
  }

  try {
    await deleteSchoolById(id);
    await setDeleteSchoolDialog();
    await setSchoolCode();
    await _getSchool();
  } catch (error) {
    console.error("Failed to delete school:", error);
  }
}

const items = computed(() => {
  return schools.value.map((i) => ({ title: i.name, value: i._id }));
});
</script>
