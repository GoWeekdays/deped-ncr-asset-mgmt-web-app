<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-6 responsive-card position-relative rounded-lg">
        <v-row class="pb-4" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4 class="text-h4 font-weight-regular">
              {{ issuePageTitle }}
            </h4>
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
              @keydown.enter="_getIssueSlips(search)"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getIssueSlips(search)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-data-table
              :items="formattedIssueSlips"
              :headers="headers"
              item-value="_id"
              hide-default-footer
              fixed-header
              :loading="loading"
              class="text-capitalize table-container overflow-y"
            >
              <template #item.status="{ item }">
                <v-chip
                  :color="getStatusColor(item.status || '')"
                  class="text-capitalize px-2"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon>
                  {{ item.status || "" }}
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
                    <v-list-item
                      :to="{
                        name: 'ics-par-issueslip-issueslip-view-card',
                        params: { card: item._id },
                      }"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-eye-outline</v-icon
                      >
                      View
                    </v-list-item>

                    <v-list-item
                      v-if="showAcknowledgeMenu(item)"
                      :to="{
                        name: 'ics-par-issueslip-issueslip-issued-card',
                        params: { card: item._id },
                      }"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-bookmark-check-outline</v-icon
                      >
                      Acknowledge
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
  middleware: ["auth", "personnel"],
});

const {
  getIssueSlips,
  pageRange,
  search,
  pages,
  page,
  issuePageTitle,
  isICS,
  isPAR,
  loading,
  formattedIssueSlips,
} = useIssueSlips();

usePageTitle(
  isICS.value
    ? "Inventory Custodian Slip"
    : isPAR.value
      ? "Property Acknowledgement Slips"
      : "Requistion"
);

const { getStatusColor, isAdmin, isAdminHead } = useUtils();

search.value = "";

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [
  { title: "Date Issued", value: "createdAt", align: "start" },
  {
    title: isICS.value ? "ICS No." : isPAR.value ? "PAR No." : "Reference No.",
    value: "issueSlipNo",
    align: "center",
  },
  { title: "Received By", value: "receivedByName", align: "center" },
  { title: "Status", value: "status", align: "center" },
  { title: "Action", value: "action", align: "center" },
];

async function _getIssueSlips(search = "") {
  loading.value = true;

  try {
    await getIssueSlips({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

_getIssueSlips();

function showAcknowledgeMenu(item: any) {
  if (!isAdmin.value && !isAdminHead.value) {
    return item.status !== "issued";
  }
  return false;
}
</script>
