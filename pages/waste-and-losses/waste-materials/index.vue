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
          <v-col cols="auto" class="text-start text-primary-text">
            <h4 class="text-h4 font-weight-regular">Waste Materials</h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              v-if="!isAdminHead"
              :to="{
                name: 'waste-and-losses-waste-materials-create',
              }"
              color="primary"
              class="mr-2"
              prepend-icon="mdi-plus"
            >
              Create
            </v-btn>
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
              @keydown.enter="_getWastes(search)"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getWastes(search)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-data-table
              :items="wastes"
              :headers="headers"
              item-value="_id"
              fixed-header
              :loading="loading"
              class="text-capitalize table-container overflow-y"
              hide-default-footer
              color="primary"
            >
              <template #item.createdAt="{ item }">
                {{ new Date(item.createdAt).toDateString().slice(4) }}
              </template>
              <template #item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status || '')"
                  class="text-capitalize px-2 font-weight-regular"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon>
                  {{ item.status || "" }}
                </v-chip>
              </template>

              <template #item.action="{ item }">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-icon size="large" v-bind="props"
                      >mdi-dots-horizontal</v-icon
                    >
                  </template>
                  <v-list elevation="2">
                    <v-list-item
                      :to="{
                        name: 'waste-and-losses-waste-materials-view-id',
                        params: { id: item._id },
                      }"
                      class="cursor-pointer"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-eye-outline</v-icon
                      >
                      View
                    </v-list-item>
                    <v-list-item
                      v-if="isAdminHead && item.status !== 'completed'"
                      :to="{
                        name: 'waste-and-losses-waste-materials-approve-id',
                        params: { id: item._id },
                      }"
                      class="cursor-pointer"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-pencil-box-outline</v-icon
                      >
                      Approve
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { wastes, search, getWastes, loading, pages, page, pageRange } =
  useWaste();
const { getStatusColor, isAdminHead } = useUtils();

usePageTitle("Waste Materials");

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [
  { title: "Date", value: "createdAt" },
  { title: "Place of Storage", value: "placeOfStorage", align: "center" },
  { title: "Status", value: "status", align: "center" },
  { title: "Action", value: "action", align: "center" },
];

async function _getWastes(search = "") {
  loading.value = true;

  try {
    await getWastes({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

_getWastes();
</script>
