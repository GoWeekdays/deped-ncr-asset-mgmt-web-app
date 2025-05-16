<template>
  <v-row class="py-5" fill-height justify="center" align="start">
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-card class="pa-6 rounded-lg">
        <v-menu
          location="bottom end"
          :close-on-content-click="false"
          :nudge-left="16"
          :z-index="99"
        >
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              class="position-absolute"
              style="top: 16px; right: 16px; z-index: 1"
            >
              mdi-dots-horizontal
            </v-icon>
          </template>
          <v-list>
            <v-list-item
              :to="{
                name: 'return-returnedType-inventory-and-inspection-report-print',
              }"
              @click="preparePrintData"
              class="cursor-pointer"
            >
              <v-list-item-title>
                <v-icon size="small" class="me-2">mdi-printer-outline</v-icon>
                <span class="text-subtitle-2">Print</span>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-row class="py-4" justify="center" align="center">
          <v-col cols="12" class="text-center text-primary-text">
            <span
              class="text-h4 font-weight-regular text-primary text-uppercase"
            >
              {{ returnInventoryTitle }}
            </span>

            <v-row class="mt-1" justify="center" align="center">
              <v-col cols="auto">
                <span class="mr-2 text-subtitle-1 text-primary-text"
                  >As at:</span
                >
              </v-col>
              <v-col cols="auto">
                <v-text-field
                  v-model="reportDate"
                  hide-details
                  placeholder="Date"
                  type="date"
                  class="mb-2"
                  density="compact"
                  variant="plain"
                  style="max-width: 200px"
                />
              </v-col>
            </v-row>

            <v-row class="mt-1" justify="start" align="start">
              <v-col cols="4">
                <v-text-field density="compact" v-model="accountableOfficer" />
                <span
                  class="text-primary-text text-caption font-weight-regular"
                  style="margin-top: -10px; display: block"
                >
                  Name of Accountable Officer
                </span>
              </v-col>
              <v-col cols="4">
                <v-text-field
                  density="compact"
                  v-model="accountableDesignation"
                />
                <span
                  class="text-primary-text text-caption font-weight-regular"
                  style="margin-top: -10px; display: block"
                >
                  Designation
                </span>
              </v-col>
              <v-col cols="4">
                <v-text-field density="compact" v-model="accountableStation" />
                <span
                  class="text-primary-text text-caption font-weight-regular"
                  style="margin-top: -10px; display: block"
                >
                  Station
                </span>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-row class="py-4">
          <v-col class="text-body-2 text-primary-text" cols="6">
            Entity Name: {{ reportData.entityName || "" }}
          </v-col>
          <v-col class="text-body-2 text-primary-text" cols="6">
            Fund Cluster: {{ reportData.fundCluster || "" }}
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row class="mt-5">
          <v-col cols="12">
            <v-data-table
              :items="items"
              :headers="headers"
              item-value="_id"
              fixed-header
              class="text-capitalize"
              hide-default-footer
              :items-per-page="-1"
            >
              <template v-slot:item.acquiredAt="{ item }">
                {{
                  item.acquiredAt
                    ? new Date(item.acquiredAt).toDateString().slice(4)
                    : ""
                }}
              </template>

              <template v-slot:item.cost="{ item }">
                ₱&nbsp;{{ formatNumber(item.cost) }}
              </template>

              <template v-slot:item.totalCost="{ item }">
                ₱&nbsp;{{ formatNumber(item.totalCost) }}
              </template>

              <template v-slot:item.accumulatedDepreciation="{ item }">
                ₱&nbsp;{{ formatNumber(item.accumulatedDepreciation) }}
              </template>

              <template v-slot:item.remarks="{ item }">
                <v-text-field
                  v-model="item.remarks"
                  density="compact"
                  hide-details
                ></v-text-field>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row class="py-4">
          <v-col class="text-body-2 text-primary-text" cols="12">
            <span class="text-subtitle-2 text-primary-text"
              >I HEREBY request inspection and disposition, pursuant to Section
              79 of PD 1445, of the property enumerated above</span
            ></v-col
          >
        </v-row>
        <v-row dense>
          <v-col cols="6">
            <label class="text-primary">Requested by</label>
          </v-col>
          <v-col cols="6">
            <label class="text-primary">Approved by</label>
          </v-col>
        </v-row>
        <v-row dense class="mt-6 text-primary-text">
          <v-col cols="6">
            <div class="text-caption mt-0">Name of Accountable Officer</div>
            <v-text-field
              v-model="nameAccountableOfficer"
              class="ma-0"
              density="compact"
              variant="outlined"
            ></v-text-field>
            <div class="text-caption mt-0">
              Designation of Accountable Officer
            </div>
            <v-text-field
              v-model="designationAccountableOfficer"
              class="ma-0"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <div class="text-caption mt-0">Name of Authorize Official</div>
            <v-text-field
              v-model="nameAuthorizeOfficial"
              class="ma-0"
              density="compact"
              variant="outlined"
            ></v-text-field>
            <div class="text-caption mt-0">
              Designation of Authorize Official
            </div>
            <v-text-field
              v-model="designationAuthorizeOfficial"
              class="ma-0"
              density="compact"
              variant="outlined"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const { isReturnPPE, isReturnSEP, returnInventoryTitle, getInventoryReport } =
  useReturn();
const { formatNumber } = useUtils();

const { getConsumablePrint, assets } = useAsset();
const loading = ref(false);

const reportData = ref({
  items: [],
  entityName: "",
  fundCluster: "",
});

const headers = [
  {
    title: "Date Acquired",
    key: "acquiredAt",
    align: "start",
    sortable: false,
  },
  {
    title: "Particulars/Article",
    key: "name",
    align: "center",
    sortable: false,
  },
  {
    title: isReturnPPE.value
      ? "Property No."
      : isReturnSEP.value
        ? "SEP No."
        : "Reference No.",
    key: "stockNumber",
    sortable: false,
  },
  { title: "Qty", key: "quantity", sortable: false },
  { title: "Unit Cost", key: "cost", sortable: false },
  { title: "Total Cost", key: "totalCost", sortable: false },
  ...(!isReturnSEP.value
    ? [
        {
          title: "Accumulated Depreciation",
          key: "accumulatedDepreciation",
          sortable: false,
        },
      ]
    : []),
  {
    title: "Accumulated Impairment Losses",
    key: "",
    align: "center",
    sortable: false,
  },
  { title: "Carrying Amount", key: "", sortable: false },
  { title: "Remarks", key: "remarks", sortable: false },
];
const reportDate = useState("reportDate", () => "");

const entityName = useState("entityName", () => "");
const fundCluster = useState("fundCluster", () => "");
const items = useState("items");
const accountableOfficer = useState("accountableOfficer");
const accountableDesignation = useState("accountableDesignation");
const accountableStation = useState("accountableStation");

const nameAccountableOfficer = useState("nameAccountableOfficer");
const designationAccountableOfficer = useState("designationAccountableOfficer");
const nameAuthorizeOfficial = useState("nameAuthorizeOfficial");
const designationAuthorizeOfficial = useState("designationAuthorizeOfficial");

async function _getInventoryReport() {
  loading.value = true;
  try {
    const response = await getInventoryReport();
    console.log("Full API Response:", response);

    if (!response) {
      console.error("API returned undefined or null.");
      return;
    }

    if (!response.items) {
      console.error("Invalid response format, missing 'items':", response);
      return;
    }

    reportData.value = response;
    assets.value = response.items.map((item) => ({ ...item }));
    items.value = assets.value;
    entityName.value = response.entityName || "";

    await nextTick(); 
  } catch (error) {
    console.error("Error fetching assets:", error);
  } finally {
    loading.value = false;
  }
}
_getInventoryReport();

const preparePrintData = async () => {
  reportDate.value = reportDate.value;
  fundCluster.value = reportData.value.fundCluster;
  verifiedBy.value = verifiedBy.value;

  const printData = {
    reportDate: reportDate.value,
    fundCluster: fundCluster.value,
    verifiedBy: verifiedBy.value,
    // certifiedBy: certifiedBy.value,
    // approvedBy: approvedBy.value,
    items: assets.value.map((item) => ({
      ...item,
      shortageQuantity:
        (item.quantity ?? 0) - (item.onHandPerCount ?? item.quantity),
      shortageValue:
        ((item.quantity ?? 0) - (item.onHandPerCount ?? item.quantity)) *
        (item.cost ?? 0),
    })),
  };

  console.log("Print Data:", printData);

  await nextTick();
  navigateTo({
    name: "return-returnedType-inventory-and-inspection-report-print",
    query: printData,
  });
};
</script>
