<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row class="pb-2" align="center" justify="space-between">
          <v-col cols="6" sm="8" md="9" class="text-primary-text">
            <h4 class="font-bold text-h4 font-weight-regular">
              Office Property Cards
            </h4>
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
              <template v-slot:item.action="{ item }" class="pr-15">
                <NuxtLink
                  :to="{
                    name: 'office-personnel-records-office-property-card-view-id',
                    params: { id: item._id },
                  }"
                  class="text-primary font-weight-medium cursor-pointer text-decoration-none"
                >
                  View
                </NuxtLink>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Office Property Card");

const { getOffices, search, offices, page, pages, pageRange } =
  useOfficeCodes();

const loading = ref(false);

const headers = computed<
  { title: string; value: string; align?: "start" | "end" | "center" }[]
>(() => [
  { title: "Offices", value: "name" },
  {
    title: "Action",
    value: "action",
    align: "end",
  },
]);

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

const items = computed(() => {
  return Array.isArray(offices.value)
    ? offices.value.map((i) => ({ title: i.name, value: i._id }))
    : [];
});
</script>
