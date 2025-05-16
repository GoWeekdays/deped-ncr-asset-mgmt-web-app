<template>
  <v-row class="py-5" fill-height justify="center" align="center">
    <v-col cols="12" sm="10" md="9" lg="9">
      <v-card class="py-2 px-10">
        <v-row class="py-5" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4 class="font-bold text-h5 font-weight-bold text-uppercase">
              Update Supply
            </h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn color="primary" @click="submitUpdate" class="me-3">
              Update
            </v-btn>
            <v-btn color="fontgray" variant="outlined" @click="goBack">
              Cancel
            </v-btn>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Form -->
        <v-row class="mt-1" justify="center" align="start">
          <v-col cols="12" sm="10" md="9" lg="12">
            <v-form class="text-primary-text font-weight-medium">
              <v-row dense>
                <v-col cols="6">
                  <label class="mb-0">Entity Name</label>
                  <v-text-field v-model="stock.entityName" variant="outlined" density="compact" class="mt-0" />
                </v-col>
                <v-col cols="6">
                  <label class="mb-0">Fund Cluster</label>
                  <v-text-field v-model="stock.fundCluster" variant="outlined" density="compact" class="mt-0" />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="6">
                  <label class="mb-0">Stock No.</label>
                  <v-text-field v-model="stock.stockNumber" variant="outlined" density="compact" class="mt-0"
                    readonly />
                </v-col>
                <v-col cols="6">
                  <label class="mb-0">Re-order Point</label>
                  <v-text-field v-model="stock.reorderPoint" variant="outlined" density="compact" class="mt-0"
                    type="text" />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12">
                  <label class="mb-0">Item</label>
                  <v-text-field v-model="stock.name" variant="outlined" density="compact" class="mt-0" />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12">
                  <label class="mb-0">Description</label>
                  <v-text-field v-model="stock.description" variant="outlined" density="compact" class="mt-0" />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="6">
                  <label class="mb-0">Unit of Measurement</label>
                  <v-text-field v-model="stock.unitOfMeasurement" variant="outlined" density="compact" class="mt-0" />
                </v-col>
                <v-col cols="6">
                  <label class="mb-0">Article</label>
                  <v-text-field v-model="stock.article" variant="outlined" density="compact" class="mt-0" />
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12">
                  <label class="mb-0">Amount</label>
                  <v-text-field v-model.number="stock.amount" variant="outlined" density="compact" class="mt-0"
                    type="number" />
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const { goBack } = useUtils();
const stockId = ref(null);

const stock = ref({
  entityName: "",
  fundCluster: "",
  stockNumber: "",
  reorderPoint: "",
  name: "",
  description: "",
  unitOfMeasurement: "",
  article: "",
  amount: 0,
});

const route = useRoute();
const router = useRouter();
const { getAssetById, updateAsset } = useAsset();

onMounted(async () => {
  stockId.value = route.params.id; // Store the stock ID
  if (!stockId.value || typeof stockId.value !== "string") {
    console.error("Invalid or missing stock ID.");
    alert("Invalid or missing stock ID.");
    router.push("/assets/consumables");
    return;
  }
  await fetchStockDetails(stockId.value);
});

async function fetchStockDetails(stockId) {
  try {
    const data = await getAssetById(stockId);
    if (data) {
      stock.value = {
        entityName: data.entityName || "",
        fundCluster: data.fundCluster || "",
        stockNumber: data.stockNumber || "",
        reorderPoint: data.reorderPoint || "",
        name: data.name || "",
        description: data.description || "",
        unitOfMeasurement: data.unitOfMeasurement || "",
        article: data.article || "",
        amount: data.amount || 0,
      };
    }
  } catch (error) {
    console.error("Failed to fetch stock details:", error);
    alert("Failed to fetch stock details. Please try again.");
  }
}

async function submitUpdate() {
  try {
    const updatedStock = {
      entityName: stock.value.entityName,
      fundCluster: stock.value.fundCluster,
      reorderPoint: stock.value.reorderPoint,
      name: stock.value.name,
      description: stock.value.description,
      unitOfMeasurement: stock.value.unitOfMeasurement,
      article: stock.value.article,
      amount: parseFloat(stock.value.amount),
      stockNumber: stock.value.stockNumber, // Include stockNumber in the update
    };

    const response = await updateAsset(stockId.value, updatedStock); // Pass the correct stock ID
    if (response) {
      alert("Stock updated successfully");
      router.push("/assets/consumables"); // Redirect to /assets/consumables after update
    } else {
      throw new Error("Failed to update stock");
    }
  } catch (error) {
    console.error("Failed to update stock:", error);
    alert("Failed to update stock. Please try again.");
  }
}
</script>
