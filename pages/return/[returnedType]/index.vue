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
            <h4 class="text-h4 font-weight-regular">
              {{ returnPageTitle }}
            </h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              :to="{ name: 'return-returnedType-create' }"
              color="primary"
              class="mr-2 text-button"
              prepend-icon="mdi-plus"
            >
              Create
            </v-btn>
            <v-menu v-if="isAdmin" class="mb-3">
              <template v-slot:activator="{ props }">
                <v-icon size="large" v-bind="props" class="">
                  mdi-dots-horizontal
                </v-icon>
              </template>
              <v-list class="text-primary-text">
                <v-list-item
                  :to="{
                    name: 'return-returnedType-inventory-and-inspection-report',
                  }"
                >
                  <v-list-item-title
                    class="text-decoration-none text-primary-text cursor-pointer"
                  >
                    <v-icon size="small" class="me-2">mdi-eye-outline</v-icon>
                    View Report
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

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
              @keydown.enter="_getReturns(search)"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getReturns(search)"
            />
          </v-col>
        </v-row>

        <!-- Table -->
        <v-row>
          <v-col cols=" 12">
            <v-data-table
              :items="returns"
              :headers="headers"
              item-value="_id"
              class="text-capitalize table-container overflow-y"
              hide-default-footer
              fixed-header
              :loading="loading"
              color="primary"
            >
              <template #item.createdAt="{ item }">
                {{ new Date(item.createdAt).toDateString().slice(4) }}
              </template>

              <template #item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status || 'default')"
                  size="small"
                  class="font-weight-regular"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  >{{ item.status || "N/A" }}
                </v-chip>
              </template>

              <template #item.action="{ item }">
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
                    <v-list-item v-if="canView(item)" :to="getViewLink(item)">
                      <v-icon size="medium" class="me-2"
                        >mdi-eye-outline</v-icon
                      >
                      View
                    </v-list-item>
                    <v-list-item
                      v-if="canApprove(item)"
                      :to="getApproveLink(item)"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-clipboard-check-outline</v-icon
                      >
                      Approved
                    </v-list-item>

                    <v-list-item
                      v-if="canComplete(item)"
                      :to="getCompleteLink(item)"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-clipboard-check-outline</v-icon
                      >
                      Completed
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
definePageMeta({
  middleware: ["auth"],
});

const {
  getReturns,
  returnPageTitle,
  returns,
  isReturnPPE,
  isReturnSEP,
  loading,
  search,
  page,
  pageRange,
  pages,
} = useReturn();

usePageTitle(
  isReturnSEP.value
    ? "Returned Semi-Expendable Property"
    : isReturnPPE.value
      ? "Returned Property, Plant and Equipment"
      : "Returned"
);

const headers = computed<
  { title: string; value: string; align?: "start" | "end" | "center" }[]
>(() => [
  {
    value: "createdAt",
    title: "Date",
  },
  {
    value: "returnNo",
    title: isReturnSEP.value
      ? "RSSEP No."
      : isReturnPPE.value
        ? "RSPPE No."
        : "Reference No.",
    align: "center",
  },
  {
    value: "returnedByName",
    title: "Returned By",
  },
  {
    value: "officeName",
    title: "Office/Department",
  },
  {
    value: "status",
    title: "Status",
  },
  {
    value: "action",
    title: "Action",
  },
]);

const { getStatusColor, isAdmin, isOfficeChief, isAdminHead } = useUtils();

async function _getReturns(search = "") {
  loading.value = true;

  try {
    await getReturns({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

_getReturns();

search.value = "";

const getViewLink = (item: TReturn) => ({
  name: "return-returnedType-view-id",
  params: { id: item._id },
});

const getApproveLink = (item: TReturn) => ({
  name: "return-returnedType-approve-id",
  params: { id: item._id },
});

const getCompleteLink = (item: TReturn) => ({
  name: "return-returnedType-complete-id",
  params: { id: item._id },
});

const canView = (item: TReturn) => true;

const canApprove = (item: TReturn) =>
  isAdminHead.value &&
  item.status !== "approved" &&
  item.status !== "completed";

const canComplete = (item: TReturn) =>
  isAdmin.value && item.status === "approved";
</script>
