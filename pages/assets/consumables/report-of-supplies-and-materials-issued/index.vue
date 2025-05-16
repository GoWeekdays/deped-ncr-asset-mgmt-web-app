<template>
  <v-row justify="center">
    <v-col cols="12" sm="10" md="10" lg="12">
      <v-card class="pa-6 rounded-lg">
        <v-row align="center" class="grid-container">
          <v-col cols="3">
            <BackButton />
          </v-col>
          <v-col cols="6" class="text-center">
            <h4 class="text-h4 font-weight-regular text-primary text-uppercase mb-0">
              REPORT OF SUPPLIES AND MATERIALS ISSUED
            </h4>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-icon size="large" v-bind="props">mdi-dots-horizontal</v-icon>
              </template>
              <v-list class="text-primary-text">
                <v-list-item>
                  <v-list-item-title :to="{
                    name: 'assets-consumables-report-on-the-physical-count-of-inventories-print',
                  }" @click="preparePrintData" class="cursor-pointer">
                    <v-icon size="small" class="me-2">mdi-printer-outline</v-icon>
                    Print
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row class="py-4">
          <v-col cols="6">
            <label class="text-fontgray text-body-2 font-weight-medium">Entity Name</label>
            <div>{{ entityName }}</div>
          </v-col>
          <v-col cols="6">
            <label class="text-fontgray text-body-2 font-weight-medium">Fund Cluster</label>
            <div>{{ fundCluster }}</div>
          </v-col>
          <v-col cols="6">
            <label class="text-fontgray text-body-2 font-weight-medium">Date</label>
            <div v-if="createdAt">{{ new Date(createdAt).toDateString().slice(4) }}</div>

          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12">
            <v-form v-model="isItemValid" ref="stockManagementForm">
              <v-row class="grid-container" align="center">
                <v-col cols="12" sm="5">
                  <input-label for="risNo" title="RIS No." />
                  <v-autocomplete v-model="selectedRis" :items="itemOptions" item-title="title" item-value="value"
                    variant="outlined" density="compact" placeholder="Select an Item" hide-no-data hide-selected
                    return-object />
                </v-col>

                <v-col cols="12" sm="2">
                  <v-btn color="primary" block @click="addItem" :disabled="!selectedRis">
                    Enter
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>

        <v-row class="mt-5">
          <v-col cols="12">
            <v-data-table :items="requisition" :headers="headers" item-value="_id" fixed-header class="text-capitalize"
              hide-default-footer :items-per-page="-1"> <template v-slot:item.cost="{ item }">
                ₱&nbsp;{{ formatNumber(item.cost) }}
              </template>
              <template v-slot:item.amount="{ item }">
                ₱&nbsp;{{ formatNumber(item.amount) }}
              </template></v-data-table>
          </v-col>
        </v-row>

        <v-row class="mt-6 text-primary-text grid-container">
          <v-col cols="6">
            <span class="text-primary-text font-weight-regular text-body-2">
              I hereby certify to the correctness of the above information.
            </span>
            <div class="text-primary-text text-subtitle-2 pt-5">
              Ariane Astrero
            </div>
            <div class="text-caption text-fontgray font-weight-regular">
              Admin
            </div>
            <div class="text-caption text-fontgray font-weight-regular">
              Supply and/or Property Custodian
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const {
  getRequisitionReport,
  getRequisitionReportData,
  updateGenerateSerialNo,
} = useRequisition();
const { debounce, formatNumber } = useUtils();

const entityName = useState("entityName");
const fundCluster = useState("fundCluster");
const createdAt = useState("createdAt");
const items = useState("items");
const postedBy = useState("postedBy", () => "");
const admin = ref("Ariane Astrero");

const search = ref("");

const isItemValid = ref(false);
const selectedRis = ref<{ title: string; value: string } | null>(null);
const itemOptions = ref<Array<TSearchItem>>([]);
const requisition = ref<Array<TRequisitionReport>>([]);

type TSearchItem = {
  title: string;
  value: string;
};

const headers = [
  { title: "RIS No", key: "risNo", align: "start", sortable: false },
  { title: "RCC", key: "rcc", align: "center", sortable: false },
  { title: "Item", key: "name", sortable: false },
  { title: "Unit", key: "unitOfMeasurement", align: "center", sortable: false },
  { title: "Qty Issued", key: "issueQty", align: "center", sortable: false },
  { title: "Unit Cost", key: "cost", align: "center", sortable: false },
  { title: "Amount", key: "amount", align: "center", sortable: false },
];

const searchItem = debounce(async () => {
  try {
    const res = await getRequisitionReport();
    if (Array.isArray(res)) {
      itemOptions.value = res.map((i) => ({
        title: i.risNo,
        value: i._id,
      }));
    }
  } catch (error) {
    console.error("Error fetching requisition report:", error);
  }
}, 500);

searchItem();

const fetchRequisitionData = async () => {
  if (!selectedRis.value) return;

  try {
    const res = await getRequisitionReportData(selectedRis.value.value);

    if (res) {
      createdAt.value = res.createdAt || "N/A";
      entityName.value = res.entityName || "N/A";
      fundCluster.value = res.fundCluster || "N/A";

      if (Array.isArray(res.itemStocks)) {
        requisition.value = res.itemStocks.map((item) => ({
          ...item,
          amount: item.issueQty * item.cost,
        }));
      } else {
        requisition.value = [];
      }
    }
  } catch (error) {
    console.error("Error fetching requisition report data:", error);
    requisition.value = [];
  }
};

const addItem = () => {
  if (selectedRis.value) {
    fetchRequisitionData();
  }
};

const serialNo = useState("serialNo", () => "N/A");

const preparePrintData = async () => {
  if (!selectedRis.value?.value) {
    console.error("No valid RIS selected");
    return;
  }

  items.value = requisition.value.map((item) => ({
    ...item,
    amount: (item.issueQty ?? 0) * (item.cost ?? 0),
  }));

  try {
    const response = await updateGenerateSerialNo(selectedRis.value.value);
    serialNo.value = response.serialNo || "N/A";
  } catch (error) {
    console.error("Error generating serial number:", error);
    serialNo.value = "N/A";
  }

  entityName.value = entityName.value || "N/A";
  fundCluster.value = fundCluster.value || "N/A";
  postedBy.value = postedBy.value || "N/A";

  console.log("Stored State Data:", {
    entityName: entityName.value,
    fundCluster: fundCluster.value,
    postedBy: postedBy.value,
    items: items.value,
    serialNo: serialNo.value,
    selectedRisId: selectedRis.value.value,
  });

  navigateTo({
    name: "assets-consumables-report-of-supplies-and-materials-issued-print",
  });
};

</script>
