<template>
  <v-row
    justify="center"
    align="start"
    color="page-background-color fill-height header-row"
  >
    <v-col cols="12" sm="12" md="11" lg="12" xl="12">
      <v-card class="pa-5 position-relative rounded-lg">
        <v-row dense align="center">
          <v-col cols="3" align-self="center" class="text-left">
            <BackButton />
          </v-col>
          <v-col cols="6" align-self="center" class="text-center">
            <h4 class="text-h4 font-weight-regular text-primary text-uppercase">
              {{ title }} Card
            </h4>
          </v-col>

          <v-col cols="3" align-self="center" class="text-right">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-icon size="large" v-bind="props">
                  mdi-dots-horizontal
                </v-icon>
              </template>
              <v-list class="text-primary-text">
                <v-list-item
                  :to="{
                    name: 'assets-property-print-id',
                    params: { property: type },
                  }"
                >
                  <v-list-item-title>
                    <v-icon size="small" class="me-2"
                      >mdi-printer-outline</v-icon
                    >
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
                <span class="text-fontgray font-weight-regular text-body-2"
                  >Entity Name</span
                >
                <div
                  class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                >
                  {{ asset.entityName || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2"
                  >Fund Cluster</span
                >
                <div
                  class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                >
                  {{ asset.fundCluster || "N/A" }}
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">{{
                  name
                }}</span>
                <div
                  class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                >
                  {{ asset.name || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2"
                  >{{ title }} Number</span
                >
                <div
                  class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                >
                  {{ asset.stockNumber || "N/A" }}
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2"
                  >Description</span
                >
                <div
                  class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                >
                  {{ asset.description || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">
                  Mode of Acquisition
                </span>
                <div
                  class="text-subtitle-1 text-capitalize text-primary-text font-weight-regular mt-1"
                >
                  {{ asset?.modeOfAcquisition || "N/A" }}
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2">
                  Procurement
                </span>
                <div
                  class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                >
                  {{ asset?.procurementType || "N/A" }}
                </div>
              </v-col>
              <v-col cols="6">
                <span class="text-fontgray font-weight-regular text-body-2"
                  >Name of Supplier</span
                >
                <div
                  class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
                >
                  {{ asset?.supplier || "N/A" }}
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
          <local-pagination
            v-model="page"
            :length="pages"
            @update:value="fetchStocks()"
          />
        </v-col>

        <!-- Stock Movement Table -->
        <v-row no-gutters>
          <v-col cols="12">
            <v-data-table
              :items="stocks"
              :headers="headers"
              hide-default-footer
              max-height="400"
              fixed-header
              class="border-thin text-capitalize"
            >
              <template #item.condition="{ item }">
                <v-chip
                  :color="getStatusColor(item.condition || '')"
                  class="text-capitalize px-2"
                  size="small"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon
                  >{{ item.condition || "" }}
                </v-chip>
              </template>

              <template #item.unitCost="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  ₱&nbsp;{{ formatNumber(item.unitCost || 0) }}
                </span>
              </template>

              <template #item.totalCost="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  ₱&nbsp;{{ formatNumber(item.totalCost || 0) }}
                </span>
              </template>

              <template #item.createdAt="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.createdAt?.toLocaleString() }}
                </span>
              </template>

              <template #item.reference="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.reference?.toLocaleString() }}
                </span>
              </template>

              <template #item.serialNo="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.serialNo?.toLocaleString() }}
                </span>
              </template>

              <template #item.office="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.office?.toLocaleString() }}
                </span>
              </template>

              <template #item.ins="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.ins?.toLocaleString() }}
                </span>
              </template>

              <template #item.itemNo="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.itemNo?.toLocaleString() }}
                </span>
              </template>

              <template #item.outs="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.outs?.toLocaleString() }}
                </span>
              </template>

              <template #item.amount="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  ₱&nbsp;{{ formatNumber(item.amount) }}
                </span>
              </template>

              <template #item.balance="{ item }">
                <span
                  :class="{
                    'text-red': [
                      'for-disposal',
                      'lost',
                      'stolen',
                      'damaged',
                      'destroyed',
                    ].includes((item.condition || '').toLowerCase()),
                  }"
                >
                  {{ item.balance?.toLocaleString() }}
                </span>
              </template>

              <template #item.attachment="{ item }">
                <nuxt-link
                  v-if="item.attachment"
                  :href="`${getOrigin()}/api/public/${item.attachment}`"
                  target="__blank"
                >
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
const { getById, title, name, isSEP, type } = useAsset();
const asset = await getById(assetId);

const { getStocksByAssetId, stocks, page, pageRange, pages } = useStock();

const headers = computed(() => {
  let items = [];

  items.push({
    title: "",
    children: [
      { title: "Date", value: "createdAt" },
      { title: "Reference", value: "reference" },
      { title: "Serial No", value: "serialNo" },
    ],
  });

  const receipt = {
    title: "Receipt",
    align: "center",
    children: [{ title: "Qty", value: "ins" }],
  };

  if (isSEP) {
    receipt.children.push(
      { title: "Unit Cost", value: "unitCost" },
      { title: "Total Cost", value: "totalCost" }
    );
  }

  items.push(receipt);

  const issueTransferDisposal = {
    title: "Issue/Transfer/Disposal",
    align: "center",
    children: [] as Array<any>,
  };

  if (isSEP) {
    issueTransferDisposal.children.push({
      title: "Item No.",
      value: "itemNo",
    });
  }

  issueTransferDisposal.children.push(
    { title: "Qty", value: "outs" },
    { title: "Office/Officer", value: "office", align: "center" }
  );

  items.push(issueTransferDisposal);

  items.push(
    {
      title: "Balance",
      children: [{ title: "Qty", value: "balance" }],
    },
    {
      title: "",
      children: [
        { title: "Amount", value: "amount" },
        { title: "Remarks", value: "remarks" },
        { title: "Conditions", value: "condition", align: "center" },
        { title: "Attachment", value: "attachment" },
      ],
    }
  );

  return items;
});

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
      let totalCost = 0;
      let qty = i.ins ?? i.outs ?? 0;

      if (qty) {
        totalCost = (i.cost ?? 0) * qty; // Multiply only for total cost
      }

      console.log(
        `Item: ${i.reference}, Cost: ${i.cost}, Qty: ${qty}, Total Cost: ${totalCost}`
      );

      return {
        ...i,
        createdAt: i.createdAt
          ? new Date(i.createdAt as string).toDateString().slice(4)
          : "",
        unitCost: i.cost, // Keep the original cost here
        totalCost, // Only total cost gets multiplied
        qty, // Store quantity explicitly
      };
    });
  } catch (error) {
    console.error("Failed to fetch stocks:", error);
  }
};

fetchStocks();

const { getOrigin, getStatusColor, formatNumber } = useUtils();
</script>

<style scoped>
.text-fontgray {
  color: #7e7e7e;
}

:deep() .v-table .v-table__wrapper > table > thead > tr > th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}

:deep() .v-table .v-table__wrapper > table > tbody > tr > td:not(:last-child),
.v-table .v-table__wrapper > table > tbody > tr > th:not(:last-child) {
  border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
