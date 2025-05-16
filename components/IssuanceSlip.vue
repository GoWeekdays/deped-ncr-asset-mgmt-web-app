<template>
  <v-row
    class=""
    justify="center"
    align="start"
    color="page-background-color  header-row"
  >
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="position-relative rounded-lg">
        <v-row no-gutters class="pa-4">
          <v-col cols="12">
            <v-row no-gutters>
              <v-row no-gutters>
                <!-- Back button -->
                <v-col cols="12" class="align-items-center mb-3 ml-5">
                  <BackButton />
                </v-col>
              </v-row>

              <v-row no-gutters align="center" justify="space-between">
                <v-col cols="auto">
                  <h4
                    class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
                  >
                    {{ issuePageTitle }}
                  </h4>
                </v-col>

                <v-col
                  cols="auto"
                  v-if="
                    (isPersonnel || isOfficeChief) &&
                    issueSlip.status === 'pending' &&
                    props.mode !== 'view'
                  "
                >
                  <v-btn
                    color="primary"
                    class="text-button px-5"
                    size="large"
                    :loading="isConfirmingIssued"
                    @click="confirmIssued"
                    min-width="200px"
                    large
                  >
                    Acknowledge
                  </v-btn>
                </v-col>

                <v-menu v-if="isAdmin">
                  <template v-slot:activator="{ props }">
                    <v-icon
                      size="large"
                      class="text-primary-text"
                      v-bind="props"
                    >
                      mdi-dots-horizontal
                    </v-icon>
                  </template>
                  <v-list>
                    <v-list-item
                      :to="{
                        name: 'ics-par-issueslip-issueslip-print-id',
                        params: { id: issueSlip._id },
                      }"
                      link
                    >
                      <v-icon size="medium" class="me-2"
                        >mdi-printer-outline</v-icon
                      >Print
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </v-row>

            <v-divider></v-divider>

            <v-row justify="start" align="start">
              <v-col cols="12">
                <v-row class="py-5 px-5" align="start" justify="space-between">
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="6">
                        <span
                          class="text-fontgray font-weight-regular text-body-2"
                        >
                          Entity Name
                        </span>
                        <div
                          class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                        >
                          {{ issueSlip.entityName || "N/A" }}
                        </div>
                      </v-col>
                      <v-col cols="6">
                        <span
                          class="text-fontgray font-weight-regular text-body-2"
                        >
                          Fund Cluster
                        </span>
                        <div
                          class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                        >
                          {{ issueSlip.fundCluster || "N/A" }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row class="px-5 pb-4" align="start" justify="space-between">
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="6">
                        <span
                          v-if="isICS"
                          class="text-fontgray font-weight-regular text-body-2"
                          >ICS No.</span
                        >
                        <span
                          v-if="isPAR"
                          class="text-fontgray font-weight-regular text-body-2"
                          >PAR No.</span
                        >
                        <div
                          class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                        >
                          {{ issueSlip.issueSlipNo || "N/A" }}
                        </div>
                      </v-col>

                      <v-col cols="6">
                        <span
                          class="text-fontgray font-weight-regular text-body-2"
                          >Status</span
                        >
                        <div class="mr-10">
                          <v-chip
                            v-if="issueSlip?.status"
                            :color="getStatusColor(issueSlip.status)"
                            density="compact"
                            class="text-capitalize text-caption font-weight-regular"
                            small
                          >
                            <v-icon size="small" class="me-1"
                              >mdi-circle</v-icon
                            >
                            <span class="font-weight-regular">{{
                              issueSlip?.status
                            }}</span>
                          </v-chip>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-divider></v-divider>

                <v-row no-gutters class="pt-5">
                  <v-col cols="12">
                    <v-data-table
                      :items="issueSlips"
                      :headers="headers"
                      density="compact"
                      hide-default-footer
                      max-height="400"
                      fixed-header
                      class="border-thin"
                    >
                      <template v-slot:item.totalCost="{ item }">
                        ₱&nbsp;{{ formatNumber(item.totalCost) }}
                      </template>
                      <template v-slot:item.cost="{ item }">
                        ₱&nbsp;{{ formatNumber(item.cost) }}
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>

                <v-row justify="space-between" align="start" class="py-4">
                  <v-col cols="6" class="d-flex flex-column">
                    <v-col class="py-0">
                      <label class="text-primary">Received By</label>
                    </v-col>
                    <v-col class="py-0">
                      <div>{{ issueSlip?.receivedByName || "N/A" }}</div>
                    </v-col>
                    <v-col class="py-0">
                      <div class="text-caption text-capitalize">
                        {{ issueSlip?.receivedByDesignation || "N/A" }}
                      </div>
                    </v-col>
                    <v-col class="py-0">
                      <div class="text-caption text-capitalize">
                        {{
                          issueSlip?.receivedAt
                            ? new Date(issueSlip.receivedAt)
                                .toDateString()
                                .slice(4)
                            : ""
                        }}
                      </div>
                    </v-col>
                  </v-col>

                  <!-- Issued By Section -->
                  <v-col cols="6" class="d-flex flex-column">
                    <v-col class="py-0">
                      <label class="text-primary">Issued By</label>
                    </v-col>
                    <template v-if="issueSlip?.issuedByName">
                      <v-col class="py-0">
                        <div>{{ issueSlip.issuedByName }}</div>
                      </v-col>
                      <v-col class="py-0">
                        <div class="text-caption text-capitalize">
                          {{ issueSlip?.issuedByDesignation || "N/A" }}
                        </div>
                      </v-col>
                      <v-col class="py-0">
                        <div class="text-caption text-capitalize">
                          {{
                            issueSlip?.createdAt
                              ? new Date(issueSlip.createdAt)
                                  .toDateString()
                                  .slice(4)
                              : "N/A"
                          }}
                        </div>
                      </v-col>
                    </template>
                    <template v-else>
                      <v-col class="py-0">
                        <div class="text-caption text-fontgray">
                          Request is pending approval from the admin. Please
                          wait.
                        </div>
                      </v-col>
                    </template>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  _id: { type: String, default: "" },
  mode: { type: String, default: "view" },
});

const { isPersonnel, isOfficeChief, isAdmin, formatNumber } = useUtils();

const isRead = computed(() => props.mode === "view");
const isIssued = computed(() => props.mode === "issued");

const route = useRoute();
const id = (route.params.card as string) || "";

const {
  issueSlips,
  issueSlip,
  search,
  updateIssueStatus,
  issuePageTitle,
  getIssueSlipsById,
  isICS,
  isPAR,
} = useIssueSlips();

if (!id) {
  console.error("No ID found in route params.");
}

search.value = "";

const _getIssueSlipsById = async () => {
  if (!id) {
    console.error("No ID provided in route params.");
    return;
  }

  try {
    const result = await getIssueSlipsById(id);

    issueSlip.value = result || {};

    issueSlips.value = Array.isArray(result)
      ? result.map((i) => ({
          ...i,
          totalCost: i.cost && i.quantity ? i.cost * i.quantity : 0,
        }))
      : [
          {
            ...result,
            totalCost:
              result.cost && result.quantity
                ? result.cost * result.quantity
                : 0,
            createdAt: result.createdAt
              ? new Date(result.createdAt).toDateString().slice(4)
              : "N/A",
          },
        ];
  } catch (error) {
    console.error("Error fetching issue slip:", error);
  }
};

_getIssueSlipsById();

const headers = computed(() => {
  const items: Array<{
    title: string;
    value: string;
    align?: string;
    width?: string;
  }> = [];

  if (isICS.value) {
    items.push(
      { title: "Quantity", value: "quantity", align: "center" },
      { title: "Unit", value: "unitOfMeasurement", align: "center" },
      { title: "Unit Cost", value: "cost", align: "center" },
      { title: "Total Cost", value: "totalCost", align: "center" },
      { title: "Description", value: "description", align: "start" },
      { title: "Inventory Item No", value: "itemNo", align: "center" },
      {
        title: "Estimated Useful Life",
        value: "estimatedUsefulLife",
        align: "center",
      }
    );
  }

  if (isPAR.value) {
    items.push(
      { title: "Quantity", value: "quantity", align: "center" },
      { title: "Unit", value: "unitOfMeasurement", align: "center" },
      { title: "Description", value: "description", align: "start" },
      { title: "Date Acquired", value: "createdAt", align: "center" },
      { title: "Amount", value: "cost", align: "center" }
    );
  }

  return items;
});

function getStatusColor(status: string): string {
  switch (status) {
    case "for-evaluation":
      return "purple";
    case "for-review":
      return "blue";
    case "pending":
      return "orange";
    case "issued":
      return "green";
    case "cancelled":
      return "secondary";
    default:
      return "grey";
  }
}

const { goBack } = useUtils();

const isConfirmingIssued = ref(false);
const confirmIssued = async () => {
  isConfirmingIssued.value = true;

  try {
    await updateIssueStatus(issueSlip.value._id);
    await goBack();
  } catch (error) {
    console.error("Error updating issue slip status:", error);
  } finally {
    isConfirmingIssued.value = false;
  }
};
</script>
