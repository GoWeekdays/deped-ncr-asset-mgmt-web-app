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
              {{ transferPageTitle }}
            </h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              :to="{ name: 'transfer-transfer-create' }"
              color="primary"
              class="mr-2 text-button"
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
              @keydown.enter="_getTransfers(search)"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getTransfers(search)"
            />
          </v-col>
        </v-row>

        <!-- Table -->
        <v-row>
          <v-col cols="12">
            <v-data-table
              :items="transfers"
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
              <template #item.completedAt="{ item }">
                {{
                  item.completedAt
                    ? new Date(item.completedAt).toDateString().slice(4)
                    : "-"
                }}
              </template>

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
                        name: 'transfer-transfer-view-id',
                        params: { id: item._id },
                      }"
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-eye-outline</v-icon
                      >
                      View
                    </v-list-item>

                    <v-list-item
                      @click="complete(item)"
                      v-if="canComplete(item.status)"
                    >
                      <v-list-item-title
                        ><v-icon size="medium" class="me-2"
                          >mdi-clipboard-check-outline</v-icon
                        >Complete</v-list-item-title
                      >
                    </v-list-item>

                    <v-list-item
                      @click="approve(item)"
                      v-if="canApprove(item.status)"
                    >
                      <v-list-item-title
                        ><v-icon size="medium" class="me-2"
                          >mdi-bookmark-check-outline</v-icon
                        >Approve</v-list-item-title
                      >
                    </v-list-item>

                    <!-- <v-list-item
                          v-if="showAcknowledgeMenu(item)"
                          :to="{
                            name: 'issueslip-issued-card',
                            params: { card: item._id },
                          }"
                        >
                          <v-icon size="medium" class="me-2"
                            >mdi-bookmark-check-outline</v-icon
                          >
                          Acknowledge
                        </v-list-item> -->
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
  getTransfers,
  transferPageTitle,
  transfers,
  isInventory,
  isProperty,
  loading,
  search,
  page,
  pageRange,
  pages,
} = useTransfer();

usePageTitle(
  isInventory.value
    ? "Inventory Transfer"
    : isProperty.value
      ? "Property Transfer"
      : "Requisition"
);

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
}[] = [
  { title: "Date Created", value: "createdAt", align: "start" },
  { title: "Date Transferred", value: "completedAt", align: "center" },
  {
    title: isInventory.value
      ? "ITR No."
      : isProperty.value
        ? "PTR No."
        : "Reference No.",
    value: "transferNo",
    align: "center",
  },
  { title: "To", value: "to", align: "center" },
  { title: "Transfer Type", value: "transferType", align: "center" },
  { title: "Status", value: "status", align: "center" },
  { title: "Action", value: "action", align: "center" },
];

const { getStatusColor, isAdmin } = useUtils();

search.value = "";

async function _getTransfers(search = "") {
  loading.value = true;

  try {
    await getTransfers({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

_getTransfers();

const { isAdminHead } = useUtils();

// review function
function canApprove(value: string | undefined) {
  return isAdminHead.value && value === "pending";
}

function approve(item: TTransfer) {
  if (item.status === "pending") {
    useRouter().push({
      name: "transfer-transfer-approve-id",
      params: { id: item._id },
    });
  } else {
    useRouter().push({
      name: "transfer-transfer",
      params: { id: item._id },
    });
  }
}

// complete function
function canComplete(value: string | undefined) {
  return isAdmin.value && value === "approved";
}

function complete(item: TTransfer) {
  if (item.status === "approved") {
    useRouter().push({
      name: "transfer-transfer-complete-id",
      params: { id: item._id },
    });
  } else {
    useRouter().push({
      name: "transfer-transfer",
      params: { id: item._id },
    });
  }
}
</script>
