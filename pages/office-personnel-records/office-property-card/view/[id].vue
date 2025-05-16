<template>
  <v-row
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-3 responsive-card position-relative rounded-lg">
        <v-row no-gutters>
          <v-col cols="12" class="align-items-center ml-5">
            <BackButton />
          </v-col>
        </v-row>
        <v-row class="" align="center">
          <v-col cols="auto" class="d-flex justify-center">
            <v-sheet
              color="#e1e1f0"
              rounded="lg"
              class="d-flex align-center justify-center pa-2"
            >
              <v-icon color="primary" size="90">mdi-bank-outline</v-icon>
            </v-sheet>
          </v-col>

          <v-col>
            <v-row no-gutters align="center">
              <v-col cols="auto" class="text-left">
                <span class="text-h5 font-weight-medium">
                  {{ officeProperty.officeName }}
                </span>
              </v-col>
            </v-row>

            <v-row align="center">
              <v-col
                v-for="(item, index) in userInfo"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                lg="auto"
              >
                <v-row no-gutters justify="start" align="center">
                  <v-col cols="12" class="text-start">
                    <span class="text-body-2 text-primary">{{
                      item.label
                    }}</span>
                  </v-col>
                  <v-col cols="12" class="text-start">
                    <v-icon
                      v-if="item.icon"
                      :icon="item.icon"
                      color="primary"
                      size="small"
                      class=""
                    ></v-icon>
                    <span
                      class="text-body-1 text-primary-text font-weight-medium"
                      >{{ item.value }}</span
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters justify="space-between" align="center" class="pt-5">
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
              @keydown.enter="_getOfficePropertyById()"
            />
          </v-col>
          <v-col cols="auto" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getOfficePropertyById()"
            />
          </v-col>
        </v-row>

        <v-col cols="12">
          <v-data-table
            :items="officeProperty.items"
            :headers="headers"
            hide-default-footer
            item-value="id"
            fixed-header
            :loading="loading"
            class="text-capitalize overflow-y"
            style="max-height: calc(100vh - 64px - 400px); overflow-y: auto"
          >
            <template #item.issuedAt="{ item }">
              {{ new Date(item.issuedAt).toDateString().slice(4) }}
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const loading = ref(false);

const headers = computed<
  { title: string; value: string; align?: "start" | "end" | "center" }[]
>(() => [
  { title: "Property Name", value: "name" },
  {
    title: "Qty",
    value: "quantity",
    align: "center",
  },
  { title: "Date Issued", value: "issuedAt" },
  { title: "ICS/PAR No.", value: "reference" },
  { title: "Personnel", value: "personnel" },
  {
    title: "Action",
    value: "action",
    align: "center",
  },
]);

const id = computed(() => {
  const route = useRoute();
  return String(route.params.id);
});

const {
  getOfficePropertyById,
  officeProperty,
  search,
  page,
  pages,
  pageRange,
} = useOfficeProperty();

const _getOfficePropertyById = async (search = "") => {
  try {
    loading.value = true;
    const result = await getOfficePropertyById({
      officeId: id.value as string,
      page: page.value,
      search,
    });
    pageRange.value = result.pageRange;
    pages.value = result.pages;
    officeProperty.value = result;
    officeProperty.value.items = result.items || [];

    userInfo.value = [
      {
        label: "Division:",
        value: result.divisionName || "N/A",
      },
      {
        label: "Office Chief:",
        value: result.officerName || "N/A",
      },
      {
        label: "Email:",
        value: result.officerEmail || "N/A",
      },
      {
        label: "Total Items Owned:",
        value: result.totalItemsOwned || "N/A",
        icon: "mdi-package-variant-closed",
      },
    ];
  } catch (error) {
    console.error("Error fetching office property details:", error);
  } finally {
    loading.value = false;
  }
};

_getOfficePropertyById();

const userInfo = ref([
  {
    label: "Division:",
    value: "32",
  },
  {
    label: "Office Chief:",
    value: "32",
  },
  {
    label: "Email:",
    value: "32",
  },
  {
    label: "Total Items Owned:",
    value: "totalItemsOwned",
    icon: "mdi-package-variant-closed",
  },
]);
</script>
