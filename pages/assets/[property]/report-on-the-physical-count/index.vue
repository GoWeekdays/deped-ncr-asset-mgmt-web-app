<template>
  <v-row fill-height justify="center" align="start">
    <v-col cols="12" sm="10" md="10" lg="12">
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
                name: 'assets-property-report-on-the-physical-count-print',
              }"
              @click="preparePrintData"
              class="cursor-pointer"
              :disabled="selectedCondition !== 'all'"
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
            <h4
              class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
            >
              {{ propertyPrintTitle }}
            </h4>
            <v-row class="mt-1" justify="center" align="center">
              <v-col cols="auto">
                <span
                  class="text-subtitle-1 text-primary-text font-weight-regular"
                >
                  Type of
                  <span
                    class="text-decoration-underline font-weight-medium text-body-1"
                    >{{ propertyPrintType }}</span
                  >
                  :
                </span>
              </v-col>
            </v-row>
            <v-row dense justify="center" align="center">
              <v-col cols="3">
                <v-select
                  v-model="selectedItemCode"
                  :items="itemCodes"
                  variant="outlined"
                  placeholder="Select"
                  density="compact"
                ></v-select>
              </v-col>
            </v-row>
            <v-row dense justify="center" align="center">
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
            <v-row dense justify="center" align="center">
              <v-col cols="3">
                <v-select
                  v-model="selectedCondition"
                  :items="itemCondition"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  placeholder="Select Condition"
                  density="compact"
                ></v-select>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-row class="py-4">
          <v-col class="text-body-2 text-primary-text" cols="12">
            Fund Cluster: {{ reportData.fundCluster || "N/A" }}</v-col
          >
          <v-col cols="12">
            <span class="text-body-2 text-primary-text">
              For which Jocelyn DR. Andaya, Director IV, DepEd NCR, is
              accountable, having assumed such accountability on November 16,
              2021.
            </span>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row class="mt-5">
          <v-col cols="12">
            <v-data-table
              :items="assets"
              :headers="headers"
              item-value="_id"
              fixed-header
              class="text-capitalize"
              hide-default-footer
              :items-per-page="-1"
            >
              <template v-slot:[`item.cost`]="{ item }">
                <span>₱&nbsp;{{ formatNumber(item.cost) }}</span>
              </template>

              <template v-slot:[`item.quantity`]="{ item }">
                <span>{{ item.quantity }}</span>
              </template>
              <template v-slot:[`item.onHandPerCount`]="{ item }">
                <v-text-field
                  v-model="item.onHandPerCount"
                  type="number"
                  density="compact"
                  hide-details="auto"
                  min="0"
                  @update:modelValue="updateShortage(item)"
                ></v-text-field>
              </template>

              <template v-slot:[`item.shortageQuantity`]="{ item }">
                <span>{{ item.shortageQuantity }}</span>
              </template>

              <template v-slot:[`item.value`]="{ item }">
                <span>₱&nbsp;{{ formatNumber(item.shortageValue) }}</span>
              </template>
              <template v-slot:[`item.remarks`]="{ item }">
                <v-text-field
                  v-model="item.remarks"
                  density="compact"
                  hide-details
                ></v-text-field>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
        <v-row class="mt-6 text-primary-text">
          <v-col cols="4">
            <label class="text-primary">Certified Correct</label>
            <div class="text-primary-text">Ariane Astrero</div>
            <div class="text-caption text-capitalize">
              Administrative Officer I <br />
              Inventory Committee Chair and Members
            </div>
          </v-col>
          <v-col cols="4">
            <label class="text-primary">Approved by</label>
            <div class="text-primary-text">Joyce DR. Andaya</div>
            <div class="text-caption">
              Regional Director - NCR <br />
              Office In-Charge, Office of the <br />
              Assistant Secretary for Operation <br />
              Head of Agency/Entity or Authorized Representative
            </div>
          </v-col>
          <v-col cols="4">
            <label class="text-primary">Verified by</label>
            <v-text-field
              v-model="verifiedBy"
              class="ma-0"
              density="compact"
              variant="outlined"
            ></v-text-field>
            <div class="text-caption mt-0">COA Representative</div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const {
  getPropertyPrint,
  assets,
  propertyPrintTitle,
  propertyPrintType,
  propertyType,
  isPPE,
  isSEP,
} = useAsset();

const { formatNumber } = useUtils();

const itemProps = (item) => ({
  title: item.value,
  value: item.code,
});

const selectedItemCode = ref(null);
const selectedCondition = ref(null);

const { SEPCodes, PPECodes, getSepCodes, getPpeCodes } = useAssetCodes();

async function getAssetCodes() {
  if (isSEP) {
    try {
      await getSepCodes();
    } catch (error) {
      console.error(error);
    }
  }

  if (isPPE) {
    try {
      await getPpeCodes();
    } catch (error) {
      console.error(error);
    }
  }
}

await getAssetCodes();

const itemCodes = computed(() => {
  return (isPPE ? PPECodes.value : isSEP ? SEPCodes.value : []).map((item) => ({
    title: item.value || "Unknown",
    value: item.code || "Unknown",
  }));
});

watch(SEPCodes, (newVal) => {
  console.log("Updated SEPCodes:", newVal);
});
watch(PPECodes, (newVal) => {
  console.log("Updated PPECodes:", newVal);
});

const itemCondition = [
  { title: "All", value: "all" },
  { title: "Good Condition", value: "good-condition" },
  { title: "Reissued", value: "reissued" },
  { title: "Returned", value: "returned" },
];

const loading = ref(false);

const reportData = ref({
  items: [],
  fundCluster: "",
});

const headers = [
  { title: "Article", key: "article", align: "start", sortable: false },
  {
    title: "Description",
    key: "description",
    align: "center",
    sortable: false,
  },
  { title: "Property Number", key: "stockNumber", sortable: false },
  { title: "Unit of Measure", key: "unitOfMeasurement", sortable: false },
  { title: "Unit Value", key: "cost", sortable: false },
  { title: "QUANTITY per Card", key: "quantity", sortable: false },
  {
    title: "Quantity per Physical Count",
    key: "onHandPerCount",
    sortable: false,
  },
  {
    title: "Shortage Quantity",
    key: "shortageQuantity",
    align: "center",
    sortable: false,
  },
  { title: "Shortage Value", key: "value", sortable: false },
  { title: "Remarks", key: "remarks", sortable: false },
];

const reportDate = useState("reportDate", () => "");

const fundCluster = useState("fundCluster");
const items = useState("items");
const verifiedBy = useState("verifiedBy", () => "");
const certifiedBy = ref("Ariane Astrero");
const approvedBy = ref("Joyce DR. Andaya");

async function _getAssets() {
  loading.value = true;
  try {
    const params = {
      search: selectedItemCode.value || "",
    };

    if (selectedCondition.value !== "all") {
      params.condition = selectedCondition.value;
    }

    console.log("Fetching assets with params:", params);

    const response = await getPropertyPrint({
      type: propertyType.value,
      params,
    });

    console.log("API Response:", response);

    reportData.value = response;
    assets.value = response.items.map((item) => ({
      ...item,
      onHandPerCount: item.onHandPerCount ?? item.quantity,
      shortageQuantity:
        (item.quantity ?? 0) - (item.onHandPerCount ?? item.quantity),
      shortageValue:
        ((item.quantity ?? 0) - (item.onHandPerCount ?? item.quantity)) *
        (item.cost ?? 0),
    }));

    items.value = assets.value;
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
  loading.value = false;
}

_getAssets();

watch([selectedItemCode, selectedCondition], () => {
  _getAssets();
});
const updateShortage = (item) => {
  if (item.onHandPerCount < 0) {
    item.onHandPerCount = 0;
  }

  if (item.onHandPerCount > item.quantity) {
    item.onHandPerCount = item.quantity;
  }

  item.shortageQuantity =
    (item.quantity ?? 0) - (item.onHandPerCount ?? item.quantity);
  item.shortageValue = item.shortageQuantity * (item.cost ?? 0);
};

const preparePrintData = async () => {
  reportDate.value = reportDate.value;
  fundCluster.value = reportData.value.fundCluster;
  verifiedBy.value = verifiedBy.value;

  const printData = {
    reportDate: reportDate.value,
    fundCluster: fundCluster.value,
    verifiedBy: verifiedBy.value,
    certifiedBy: certifiedBy.value,
    approvedBy: approvedBy.value,
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
    name: "assets-property-report-on-the-physical-count-print",
    query: printData,
  });
};
</script>
