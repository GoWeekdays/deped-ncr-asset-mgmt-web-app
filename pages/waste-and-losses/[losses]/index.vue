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
              {{ lostMaterialPageTitle }}
            </h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn
              :to="{ name: 'waste-and-losses-losses-create' }"
              color="primary"
              class="mr-2 text-button"
              prepend-icon="mdi-plus"
            >
              Create
            </v-btn>
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
              @keydown.enter="_getLostMaterials(search)"
            />
          </v-col>

          <v-col cols="6" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getLostMaterials(search)"
            />
          </v-col>
        </v-row>

        <!-- filter buttons -->
        <v-row
          class="font-weight-medium rounded-md"
          no-gutters
          align="center"
          justify="start"
        >
          <v-btn
            class="px-10 py-6 me-3 rounded-lg d-flex justify-center align-center"
            :color="activeFilter === 'all' ? 'primary' : undefined"
            :variant="activeFilter === 'all' ? 'flat' : 'text'"
            @click="updateFilter('all')"
          >
            All
          </v-btn>

          <v-btn
            v-if="isOfficeChief || isPersonnel"
            class="px-10 py-6 me-3 rounded-lg d-flex justify-center align-center"
            :color="activeFilter === 'pending' ? 'primary' : undefined"
            :variant="activeFilter === 'pending' ? 'flat' : 'text'"
            @click="updateFilter('pending')"
          >
            FOR APPROVAL
          </v-btn>
          <v-btn
            v-if="isAdmin"
            class="px-10 py-6 me-3 rounded-lg d-flex justify-center align-center"
            :color="activeFilter === 'approved' ? 'primary' : undefined"
            :variant="activeFilter === 'approved' ? 'flat' : 'text'"
            @click="updateFilter('approved')"
          >
            Approved
          </v-btn>
          <v-btn
            class="px-10 py-6 me-3 rounded-lg d-flex justify-center align-center"
            :color="activeFilter === 'completed' ? 'primary' : undefined"
            :variant="activeFilter === 'completed' ? 'flat' : 'text'"
            @click="updateFilter('completed')"
          >
            Completed
          </v-btn>
        </v-row>

        <!-- Table -->
        <v-row>
          <v-col cols=" 12">
            <v-data-table
              :items="losts"
              :headers="headers"
              item-value="_id"
              class="text-capitalize"
              hide-default-footer
              style="max-height: calc(100vh - 64px - 275px); overflow-y: auto"
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
                      Approve
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
  middleware: ["auth", "personnel"],
});

const {
  getLostMaterials,
  lostMaterialPageTitle,
  losts,
  isRLSDDP,
  isRLSDDSP,
  loading,
  search,
  page,
  pageRange,
  pages,
} = useLostMaterial();

usePageTitle(
  isRLSDDP.value
    ? "Lost, Stolen, Damaged, Destroyed SEP"
    : isRLSDDSP.value
      ? "Lost, Stolen, Damaged, Destroyed PPE"
      : "Lost"
);

const headers = computed<
  { title: string; value: string; align?: "start" | "end" | "center" }[]
>(() => [
  {
    value: "createdAt",
    title: isRLSDDSP.value
      ? "RLSDDSP Date"
      : isRLSDDP.value
        ? "RLSDDP Date"
        : "Reference No.",
    align: "start",
  },
  {
    value: "lossNo",
    title: isRLSDDSP.value
      ? "RLSDDSP No."
      : isRLSDDP.value
        ? "RLSDDP No."
        : "Reference No.",
    align: "center",
  },
  {
    value: "description",
    title: "Description",
    align: "center",
  },
  {
    value: "officeName",
    title: "Department/Office",
    align: "center",
  },
  {
    value: "status",
    title: "Status",
    align: "center",
  },
  {
    value: "action",
    title: "Action",
    align: "center",
  },
]);

const { getStatusColor, isAdmin, isOfficeChief, isPersonnel } = useUtils();

search.value = "";

async function fetchLostMaterials(status: string) {
  await getLostMaterials({ page: page.value, search: search.value, status });
}

fetchLostMaterials("all");

const activeFilter = ref("all");

async function updateFilter(status: string) {
  activeFilter.value = status;
  await fetchLostMaterials(status);
}

async function _getLostMaterials(search = "") {
  loading.value = true;

  try {
    await getLostMaterials({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

// _getLostMaterials();

const getViewLink = (item: TLost) => ({
  name: "waste-and-losses-losses-view-id",
  params: { id: item._id },
});

const getApproveLink = (item: TLost) => ({
  name: "waste-and-losses-losses-approve-id",
  params: { id: item._id },
});

const getCompleteLink = (item: TLost) => ({
  name: "waste-and-losses-losses-completed-id",
  params: { id: item._id },
});

const canView = (item: TLost) => true;

const canApprove = (item: TLost) =>
  isOfficeChief.value &&
  item.status !== "approved" &&
  item.status !== "completed";

const canComplete = (item: TLost) =>
  isAdmin.value && item.status !== "pending" && item.status !== "completed";

const { isAdminHead } = useUtils();
</script>
<!-- <style scoped>
.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  opacity: 0.9;
}

.bg-primary {
  background-color: rgb(var(--v-theme-primary)) !important;
}

.text-white {
  color: white !important;
}

.text-primary {
  color: rgb(var(--v-theme-primary)) !important;
}
</style> -->
