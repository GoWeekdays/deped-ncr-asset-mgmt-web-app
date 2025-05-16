<template>
  <v-row class="" justify="center" align="start" color="page-background-color fill-height header-row">
    <v-col cols="12" sm="12" md="11" lg="12" xl="12">
      <v-card class="pa-6 position-relative rounded-lg">
        <v-row dense align="center">
          <v-col cols="3" align-self="center" class="text-left">
            <BackButton />
          </v-col>
          <v-col cols="6" align-self="center" class="text-center">
            <h4 class="text-h4 font-weight-regular text-primary text-uppercase">
              Stock Card
            </h4>
          </v-col>

          <v-col cols="3" align-self="center" class="text-right">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-icon size="large" color="primary" v-bind="props">
                  mdi-dots-horizontal
                </v-icon>
              </template>
              <v-list class="text-primary-text">
                <v-list-item :to="{ name: 'assets-consumables-print-id' }">
                  <v-list-item-title>
                    <v-icon size="small" class="me-2">mdi-printer-outline</v-icon>
                    <span class="text-subtitle-2">Print</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Stock Information -->
        <v-row class="pt-2">
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular">Entity Name</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  {{ asset.entityName || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">Fund Cluster</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  {{ asset.fundCluster || "N/A" }}
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">Item</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  {{ asset.name || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">Stock No.</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  {{ asset.stockNumber || "N/A" }}
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">Description</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  {{ asset.description || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">Re-order Point</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  {{ asset.reorderPoint || "N/A" }}
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">Unit of Measurement</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  {{ asset.unitOfMeasurement || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">Cost</span>
                <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
                  ₱ {{ formatNumber(asset.cost || "N/A") }}
                </div>


              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>

        <v-col cols="auto" class="d-flex justify-end align-center">
          <span class="mr-2 text-caption text-fontgray">
            {{ pageRange }}
          </span>
          <local-pagination v-model="page" :length="pages" @update:value="fetchStocks()" />
        </v-col>

        <v-row no-gutters>
          <v-col cols="12">
            <v-data-table :items="stocks" :headers="headers" hide-default-footer max-height="400" fixed-header
              class="border-thin">
              <template #item.attachment="{ item }">
                <nuxt-link v-if="item.attachment" :href="`${getOrigin()}/api/public/${item.attachment}`"
                  target="__blank">
                  Preview
                </nuxt-link>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const assetId = useRoute().params.id as string;
const { getById } = useAsset();
const asset = await getById(assetId);

const { getStocksByAssetId, stocks, page, pageRange, pages } = useStock();

const headers = [
  {
    title: "",
    children: [
      { title: "Date", value: "createdAt" },
      { title: "Reference", value: "reference" },
    ],
  },
  {
    title: "Receipt",
    children: [{ title: "Qty", value: "ins", width: "80" }],
  },
  {
    title: "Issue",
    align: "center",
    children: [
      { title: "Qty", value: "outs", width: "80" },
      { title: "Office", value: "office", width: "150", align: "center" },
    ],
  },
  {
    title: "",
    children: [
      { title: "Balance", value: "balance", width: "80" },
      { title: "No of Days To Consume", value: "numberOfDaysToConsume" },
      { title: "Attachment", value: "attachment" },
    ],
  },
];

const fetchStocks = async () => {
  try {
    const _stocks = await getStocksByAssetId({
      asset: assetId,
      page: page.value,
    });
    pageRange.value = _stocks.pageRange;
    pages.value = _stocks.pages;
    const items = _stocks.items as Array<TStock>;
    stocks.value = items.map((i) => {
      return {
        ...i,
        createdAt: i.createdAt
          ? new Date(i.createdAt as string).toDateString().slice(4)
          : "",
      };
    });
  } catch (error) {
    console.error("Failed to fetch stocks:", error);
  }
};

fetchStocks();

const { getOrigin, formatNumber } = useUtils();
</script>

<style scoped>
.text-fontgray {
  color: #7e7e7e;
}

:deep() .v-table .v-table__wrapper>table>thead>tr>th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper>table>tbody>tr>td:not(:last-child),
.v-table .v-table__wrapper>table>tbody>tr>th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
