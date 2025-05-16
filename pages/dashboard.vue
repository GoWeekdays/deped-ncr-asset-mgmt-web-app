<template>
  <v-row class="fill-height" justify="center" align="start">
    <v-col cols="12" lg="12">
      <v-row dense class="mb-0" justify="center">
        <!-- Assets Overview -->
        <v-col cols="12">
          <v-row justify="center" align="center" :gutter="12">
            <v-col
              v-for="(asset, index) in assets"
              :key="index"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              class="mb-1"
            >
              <v-card
                class="rounded-lg pa-4"
                style="
                  transition:
                    transform 0.2s,
                    box-shadow 0.2s;
                "
              >
                <!-- Icon and Label -->
                <v-row dense justify="center" align="center">
                  <v-col cols="12" class="text-center pa-0">
                    <v-icon size="30" color="primary">{{ asset.icon }}</v-icon>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <span class="text-subtitle-2 text-muted">{{
                      asset.label
                    }}</span>
                  </v-col>
                </v-row>

                <!-- Count -->
                <v-row dense justify="center">
                  <v-col cols="12" class="text-center">
                    <span class="text-h3 font-weight-medium text-primary">{{
                      asset.count
                    }}</span>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row dense class="mb-2" justify="center" align="start">
        <v-col cols="12" sm="6">
          <v-card class="rounded-lg pa-7" style="max-height: 350px">
            <v-row justify="start" class="">
              <h1 class="text-h6 text-primary-text font-weight-medium">
                Assets
              </h1>
            </v-row>

            <v-row justify="center" align="center">
              <v-col cols="12" sm="6" class="text-start">
                <v-list dense>
                  <template v-for="(label, index) in chartLabels" :key="index">
                    <v-list-item>
                      <v-list-item-title>
                        <v-avatar
                          size="14"
                          :style="{ backgroundColor: chartColors[index] }"
                        ></v-avatar>
                        <span class="text-body-1" style="margin-left: 8px">
                          {{ label }}: {{ chartData[index].toLocaleString() }}
                        </span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider
                      v-if="index < chartLabels.length - 1"
                      class="my-1"
                    ></v-divider>
                  </template>
                </v-list>
              </v-col>
              <v-col cols="12" sm="6" class="text-center">
                <canvas
                  ref="chart"
                  width="170"
                  height="170"
                  aria-label="Pie chart showing asset distribution by category"
                ></canvas>
              </v-col>
            </v-row>
          </v-card>
          <v-card class="rounded-lg pa-7 mt-4" height="340px">
            <v-row justify="space-between">
              <v-col cols="auto">
                <h1 class="text-h6 text-primary-text font-weight-medium">
                  Maintenance
                </h1>
              </v-col>
              <v-col cols="auto" class="d-flex align-center">
                <NuxtLink
                  :to="{ name: 'maintenance' }"
                  class="text-body-2 text-decoration-none text-primary font-weight-medium"
                >
                  View All
                </NuxtLink>
              </v-col>
            </v-row>

            <v-row dense justify="center" align="center">
              <v-data-table
                :items="maintenances"
                :headers="headers"
                hide-default-footer
                hide-default-header
                item-value="_id"
                items-per-page="5"
                :loading="loading"
                class="text-capitalize"
                style="width: 100%"
              >
                <template #item.name="{ item }" class="text-start">{{
                  item.name
                }}</template>

                <template #item.status="{ item }">
                  <v-chip
                    :color="getStatusColor(item.status)"
                    class="text-capitalize px-2"
                    size="small"
                  >
                    <v-icon size="small" class="me-1">mdi-circle</v-icon>
                    {{ item.status }}
                  </v-chip>
                </template>
              </v-data-table>
            </v-row>
          </v-card>
        </v-col>

        <!-- Asset Condition Card -->
        <v-col cols="12" sm="6" class="text-start">
          <v-card class="rounded-lg pa-7">
            <!-- Header Section -->
            <v-row justify="start" class="mb-5">
              <h1 class="text-h6 text-primary-text font-weight-medium">
                Property Condition
              </h1>
            </v-row>

            <!-- Semi-Expendable Property Section -->
            <v-row justify="start" align="start">
              <h5
                class="text-subtitle-2 text-primary-text font-weight-medium text-start pb-2"
              >
                Semi-Expendable Property
              </h5>
              <v-col cols="12">
                <v-container class="pa-0">
                  <v-row class="mb-2">
                    <v-col
                      cols="6"
                      class="text-start text-subtitle-2 text-primary-text font-weight-regular"
                      >Good Condition</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.sepConditions.goodCondition }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-body-2 text-primary-text font-weight-regular"
                      >Reissued</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.sepConditions.reissued }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-body-2 text-primary-text font-weight-regular"
                      >Returned</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.sepConditions.returned }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-body-2 text-primary-text font-weight-regular"
                      >Transferred</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.sepConditions.transferred }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-subtitle-2 text-primary-text font-weight-regular"
                      >For Disposal</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.sepConditions.forDisposal }}</v-col
                    >
                  </v-row>
                </v-container>
              </v-col>
            </v-row>

            <!-- PPE Section -->
            <v-row justify="start" align="start">
              <h5
                class="text-subtitle-2 text-primary-text font-weight-medium text-start py-2"
              >
                Property, Plant, and Equipment
              </h5>
              <v-col cols="12">
                <v-container class="pa-0">
                  <v-row class="mb-2">
                    <v-col
                      cols="6"
                      class="text-start text-subtitle-2 text-primary-text font-weight-regular"
                      >Good Condition</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.ppeConditions.goodCondition }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-body-2 text-primary-text font-weight-regular"
                      >Reissued</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.ppeConditions.reissued }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-body-2 text-primary-text font-weight-regular"
                      >Returned</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.ppeConditions.returned }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-body-2 text-primary-text font-weight-regular"
                      >Transferred</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.ppeConditions.transferred }}</v-col
                    >

                    <v-col
                      cols="6"
                      class="text-start text-subtitle-2 text-primary-text font-weight-regular"
                      >For Disposal</v-col
                    >
                    <v-col
                      cols="6"
                      class="text-end text-body-2 text-primary-text font-weight-medium"
                      >{{ assetProperty.ppeConditions.forDisposal }}</v-col
                    >
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Activities -->
      <v-row dense class="mb-0" justify="center">
        <v-col cols="12" class="text-start">
          <v-card class="rounded-lg pa-7">
            <v-row justify="start" class="mb-3">
              <h1 class="text-h6 text-primary-text font-weight-medium">
                Recent Activities
              </h1>
            </v-row>
            <v-data-table
              :items="recentActivities"
              :headers="recentTable"
              items-per-page="5"
              hide-default-footer
              item-value="_id"
              :loading="loading"
              class="text-capitalize"
            >
              <template #item.createdAt="{ item }">
                {{ new Date(item.createdAt).toDateString().slice(4) }}
              </template>

              <template #item.condition="{ item }">
                <template
                  v-if="item.type && item.type.toLowerCase() !== 'consumables'"
                >
                  <v-chip
                    :color="getStatusColor(item.condition)"
                    class="text-capitalize px-2"
                    size="small"
                  >
                    <v-icon size="small" class="me-1">mdi-circle</v-icon>
                    {{ item.condition }}
                  </v-chip>
                </template>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Dashboard");

const { getStatusColor } = useUtils();
const {
  getAssetOverview,
  assetOverview,
  loading,
  getAssetChart,
  assetChart,
  assetProperty,
  getAssetProperties,
  recentActivities,
  getRecentDashboard,
} = useDashboard();

const { getMaintenances, page, maintenances } = useMaintenance();

const totalAssetsCounter = ref(0);
const assetsInUseCounter = ref(0);
const assetsMaintenanceCounter = ref(0);
const assetsDisposedCounter = ref(0);

function incrementCounter(targetValue: any, counterRef: any) {
  const duration = 3000;
  const startValue = counterRef.value;
  const startTime = performance.now();

  function animate(time: any) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    counterRef.value = Math.floor(
      startValue + progress * (targetValue - startValue)
    );

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

watch(assetOverview, (newDashboard) => {
  incrementCounter(newDashboard.totalAssets, totalAssetsCounter);
  incrementCounter(newDashboard.totalAssetsInUse, assetsInUseCounter);
  incrementCounter(
    newDashboard.totalAssetMaintenance,
    assetsMaintenanceCounter
  );
  incrementCounter(newDashboard.totalAssetsDisposed, assetsDisposedCounter);
});

const assets = computed(() => [
  {
    icon: "mdi-cube-outline",
    count: totalAssetsCounter.value,
    label: "Total Number of Assets",
  },
  {
    icon: "mdi-checkbox-marked-outline",
    count: assetsInUseCounter.value,
    label: "Assets In Use",
  },
  {
    icon: "mdi-wrench-outline",
    count: assetsMaintenanceCounter.value,
    label: "Maintenance",
  },
  {
    icon: "mdi-delete-outline",
    count: assetsDisposedCounter.value,
    label: "Disposed",
  },
]);

async function _getAssetOverview() {
  loading.value = true;
  try {
    await getAssetOverview();
  } catch (error) {
    console.error("Error fetching maintenances:", error);
  } finally {
    loading.value = false;
  }
}

_getAssetOverview();

import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(PieController, ArcElement, Tooltip, Legend);

const chart = ref<HTMLCanvasElement | null>(null);
const chartLabels = ref<string[]>([]);
const chartData = ref<number[]>([]);
const chartColors = ref<string[]>(["#1E88E5", "#90CAF9", "#0D47A1"]);

async function _getAssetChart() {
  try {
    await getAssetChart();
    chartLabels.value = ["Consumables", "PPE", "SEP"];
    chartData.value = [
      assetChart.value.totalConsumables,
      assetChart.value.totalPPE,
      assetChart.value.totalSEP,
    ];
  } catch (error) {
    console.error("Error fetching asset chart data:", error);
  }
}

let chartInstance: Chart | null = null;

function renderChart() {
  if (chart.value) {
    const canvas = chart.value as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (chartInstance) {
      chartInstance.destroy();
    }

    if (ctx) {
      const config = {
        type: "pie",
        data: {
          labels: chartLabels.value,
          datasets: [
            {
              label: "By Category",
              data: chartData.value,
              backgroundColor: chartColors.value,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${(context.raw as number).toLocaleString()}`;
                },
              },
            },
          },
          elements: { arc: { borderWidth: 0 } },
        },
      };

      chartInstance = new Chart(ctx, config);
    }
  }
}

watch([chartLabels, chartData], () => {
  renderChart();
});

onMounted(async () => {
  try {
    await getAssetChart();

    const { totalConsumables, totalSEP, totalPPE } = assetChart.value;

    chartLabels.value = ["Consumables", "SEP", "PPE"];
    chartData.value = [totalConsumables, totalSEP, totalPPE];
    chartColors.value = ["#1E88E5", "#90CAF9", "#0D47A1"];

    renderChart();
  } catch (error) {
    console.error("Error fetching chart data:", error);
  }
});

const headers = [
  { title: "Item", value: "name", align: "start" },
  { title: "Status", value: "status", align: "end" },
];

async function _getMaintenances(search = "") {
  loading.value = true;
  try {
    await getMaintenances({ search, page: page.value });
  } catch (error) {
    console.error("Error fetching maintenances:", error);
  } finally {
    loading.value = false;
  }
}

_getMaintenances();

async function _getAssetProperty() {
  loading.value = true;
  try {
    const response = await getAssetProperties();

    if (response && response.sepConditions && response.ppeConditions) {
      assetProperty.value = response;
    } else {
      console.error("No valid data found in asset properties response.");
    }
  } catch (error) {
    console.error("Error fetching asset properties:", error);
  } finally {
    loading.value = false;
  }
}

_getAssetProperty();

async function _getRecentDashboard(search = "") {
  loading.value = true;
  try {
    await getRecentDashboard({ search, page: page.value });
  } catch (error) {
    console.error("Error fetching maintenances:", error);
  } finally {
    loading.value = false;
  }
}

_getRecentDashboard();

const recentTable = [
  { title: "Date", value: "createdAt" },
  { title: "Item", value: "name", align: "center" },
  { title: "Type", value: "type", align: "center" },
  { title: "status", value: "condition", align: "center" },
];
</script>
