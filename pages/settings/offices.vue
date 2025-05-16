<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row align="center" justify="space-between">
          <v-col cols="6" sm="8" md="9" class="text-primary-text">
            <h1 class="font-weight-regular text-capitalize">Offices</h1>
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
                @keydown.enter="_getOffice(search)"
              />
            </v-col>

            <v-col cols="auto" class="d-flex justify-end align-center">
              <span class="mr-2 text-caption text-fontgray">
                {{ pageRange }}
              </span>
              <local-pagination
                v-model="page"
                :length="pages"
                @update:value="_getOffice(search)"
              />
            </v-col>
          </v-row>

          <v-col cols="12">
            <v-data-table
              :items="offices"
              :headers="headers"
              hide-default-footer
              item-value="data"
              fixed-header
              :loading="loading"
              class="text-capitalize table-container overflow-y"
            >
              <template #item.email="{ item }">
                <span class="text-lowercase">{{ item.email }}</span>
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
                      Update Office
                    </v-list-item>
                    <v-list-item
                      @click="
                        setDeleteOfficeDialog({ dialog: true, value: item })
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

    <!-- Dialog for Creating/Editing Office -->
    <v-dialog v-model="codeDialog" width="400">
      <v-card class="pa-8 rounded-lg">
        <v-form v-model="valid" @submit.prevent="submit(officeCode)">
          <v-row no-gutters>
            <v-col cols="12" class="pb-5">
              <v-row justify="start">
                <span v-if="officeCode._id" class="font-weight-regular text-h5">
                  Update Office
                </span>
                <span v-else class="font-weight-regular text-h5">
                  Add Office
                </span>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-5">
              <InputLabel for="officeName" title="Name" />
              <v-text-field
                v-model="officeCode.name"
                variant="outlined"
                density="compact"
                :rules="[requiredRule]"
                persistent-hint
              />
            </v-col>

            <v-col cols="12" class="mt-2">
              <InputLabel for="division" title="Division" />
              <v-select
                v-model="officeCode.divisionId"
                :items="_divisions"
                item-text="title"
                item-value="value"
                density="compact"
                variant="outlined"
                :rules="[requiredRule]"
                persistent-hint
              />
            </v-col>

            <v-col cols="12" class="my-4">
              <span class="text-subtitle-2 font-weight-medium text-primary-text"
                >Email</span
              >

              <v-text-field
                v-model="officeCode.email"
                variant="outlined"
                density="compact"
                type="email"
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
            @click="deleteOffice(officeCode._id)"
            class="mx-2"
          >
            Delete
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            @click="setDeleteOfficeDialog()"
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
usePageTitle("Offices");

const {
  getOffices,
  createOffice,
  updateOfficeById,
  deleteOfficeById,
  search,
  offices,
  setOfficeCode,
  officeCode,
  page,
  pages,
  pageRange,
} = useOfficeCodes();

const { getUserOfficeChiefById } = useUser();

type TUserOfficeChiefOptions = {
  title: string;
  value: string;
};

const _getUserOfficeChief = ref<Array<TUserOfficeChiefOptions>>([]);

async function _getOfficeChief() {
  try {
    const res = await getUserOfficeChiefById();
    _getUserOfficeChief.value = res.items.map((i) => ({
      title: i.name,
      value: i._id ?? "",
    }));
  } catch (error) {
    console.error("Error fetching office chiefs:", error);
  }
}

_getOfficeChief();

const { getDepedDivision } = useDivision();

type TDivisionOptions = {
  title: string;
  value: string;
};

const _divisions = ref<Array<TDivisionOptions>>([]);

async function _getDivisions(search = "") {
  try {
    const res = await getDepedDivision({ limit: 20, search });
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
  { title: "Name", value: "name" },
  { title: "Division", value: "divisionName" },
  { title: "Office Chief", value: "supervisorName" },
  { title: "Email", value: "email" },
  {
    title: "Actions",
    value: "actions",
    align: "center",
    width: "140",
  },
]);

const loading = ref(false);
const selectedOffice = ref();
const valid = ref(false);
const errorMessage = ref("");
const codeDialog = ref(false);

async function _getOffice(search = "") {
  loading.value = true;

  try {
    await getOffices({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

_getOffice();

const { requiredRule, emailRule } = useUtils();

function setDialog(
  { dialog = false, value } = {} as { dialog: boolean; value?: TOffice }
) {
  codeDialog.value = dialog;
  officeCode.value = value || {
    _id: "",
    name: "",
    email: "",
    divisionId: "",
    supervisorId: "",
  };

  if (!value) {
    errorMessage.value = "";
  }

  if (value) {
    setOfficeCode(value);
  }
}

async function submit(value: TOffice) {
  try {
    const payload = {
      name: value.name,
      email: value.email,
      divisionId: value.divisionId,
      supervisorId: value.supervisorId,
    };

    if (value._id) {
      await updateOfficeById(value._id, payload);
      const index = offices.value.findIndex(
        (office) => office._id === value._id
      );
      if (index !== -1) {
        offices.value[index] = { ...offices.value[index], ...payload };
      }
      await _getOffice();
    } else {
      await createOffice(payload);
      await _getOffice();
    }

    setDialog();
  } catch (error: any) {
    errorMessage.value =
      error.data?.message || "An error occurred while saving the office.";
  }
}
const deleteOfficeDialog = ref(false);

function setDeleteOfficeDialog(
  { dialog = false, value } = {} as { dialog: boolean; value: TOffice }
) {
  deleteOfficeDialog.value = dialog;
  if (value) {
    officeCode.value = value;
  }
}

async function deleteOffice(id?: string) {
  if (!id) {
    return;
  }

  try {
    await deleteOfficeById(id);
    await setDeleteOfficeDialog();
    await setOfficeCode();
    await _getOffice();
  } catch (error) {
    console.error("Failed to delete office:", error);
  }
}

const items = computed(() => {
  return Array.isArray(offices.value)
    ? offices.value.map((i) => ({ title: i.name, value: i._id }))
    : [];
});
</script>
