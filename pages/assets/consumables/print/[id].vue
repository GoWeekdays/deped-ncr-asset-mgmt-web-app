<template>
  <v-row no-gutters justify="center">
    <v-col
      no-gutters
      class="fill-height px-10 custom-font a4-landscape light-theme"
      justify="center"
      align-content="center"
    >
      <div
        class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px"
        style="font-style: italic"
      >
        Appendix 58
      </div>
      <div
        class="text-center font-weight-bold text-capitalize mb-10 font-times text-uppercase"
        style="font-size: 14pt !important"
      >
        Stock Card
      </div>

      <v-row dense class="mb-3" align="start" justify="start">
        <v-col cols="6" class="text-left">
          <div class="th-12px font-times">
            Entity Name:
            <u class="th-12px font-times font-weight-regular">{{
              asset.entityName
            }}</u>
          </div>
        </v-col>
        <v-col cols="6" class="text-left">
          <div class="th-12px font-times font-weight-bold">
            Fund Cluster:
            <u class="th-12px font-times font-weight-regular">{{
              asset.fundCluster
            }}</u>
          </div>
        </v-col>
      </v-row>
      <table border="1" style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <td
              v-if="isPPE"
              class="text-start th-12px font-times font-weight-bold"
              colspan="7"
            >
              Property, Plant and Equipment:
              <u class="th-12px font-times font-weight-regular">{{
                asset.name
              }}</u>
            </td>
            <td
              class="text-start th-12px font-times font-weight-bold"
              colspan="4"
            >
              Item:
              <u class="th-12px font-times font-weight-regular">{{
                asset.name
              }}</u>
            </td>
            <td
              class="text-start th-12px font-times font-weight-bold"
              colspan="4"
            >
              Stock No.:
              <u class="th-12px font-times font-weight-regular">{{
                asset.stockNumber
              }}</u>
            </td>
          </tr>
          <tr>
            <td
              class="text-start th-12px font-times font-weight-bold"
              colspan="4"
            >
              Description:
              <u class="th-12px font-times font-weight-regular">{{
                asset.description
              }}</u>
            </td>
            <td
              class="text-start th-12px font-times font-weight-bold"
              colspan="3"
            >
              Reorder Point:
              <u class="th-12px font-times font-weight-regular">{{
                asset.reorderPoint
              }}</u>
            </td>
          </tr>
          <tr>
            <td
              class="text-start th-12px font-times font-weight-bold text-capitalize"
              colspan="4"
            >
              Unit of Measurement:
              <u class="th-12px font-times font-weight-regular">{{
                asset.unitOfMeasurement
              }}</u>
            </td>
            <td
              class="text-start th-12px font-times font-weight-bold text-capitalize"
              colspan="4"
            ></td>
          </tr>
          <tr class="custom-header-height font-times">
            <th
              class="text-center th-12px font-times font-weight-bold"
              rowspan="2"
            >
              Date
            </th>
            <th
              class="text-center th-12px font-times font-weight-bold"
              rowspan="2"
            >
              Reference
            </th>
            <th
              class="text-center th-12px font-times font-weight-bold"
              colspan="1"
            >
              Receipt
            </th>
            <th
              class="text-center th-12px font-times font-weight-bold"
              colspan="2"
            >
              Issue
            </th>
            <th
              class="text-center th-12px font-times font-weight-bold"
              colspan="1"
            >
              Balance
            </th>
            <th
              class="text-center th-12px font-times font-weight-bold"
              rowspan="2"
            >
              No. of Days to Consume
            </th>
          </tr>
          <tr>
            <th class="text-center th-12px font-times font-weight-regular">
              Qty.
            </th>
            <th class="text-center th-12px font-times font-weight-regular">
              Qty.
            </th>
            <th class="text-center th-12px font-times font-weight-regular">
              Office
            </th>
            <th class="text-center th-12px font-times font-weight-regular">
              Qty.
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="stocks.length">
            <tr
              v-for="(item, index) in stocks"
              :key="index"
              class="text-capitalize"
            >
              <td class="custom-height th-12px">
                {{ item.createdAt || "" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.reference || "" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.ins || "0" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.outs || "0" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.office || "" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.balance || "0" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.numberOfDaysToConsume || "" }}
              </td>
            </tr>
          </template>

          <template v-if="stocks.length > 0">
            <tr
              v-for="index in Math.max(10 - stocks.length, 0)"
              :key="'empty-' + index"
              class="text-capitalize"
            >
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
            </tr>
          </template>
        </tbody>
      </table>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "plain",
});

const route = useRoute();
const assetId = useRoute().params.id as string;
const { getById, isPPE } = useAsset();
const asset = await getById(assetId);

const { getStocksByAssetId, page, pageRange, pages } = useStock();
const stocks = ref([]);

const fetchStocks = async () => {
  try {
    const _stocks = await getStocksByAssetId({
      asset: assetId,
      page: page.value,
    });
    pageRange.value = _stocks.pageRange;
    pages.value = _stocks.pages;
    const items = _stocks.items.map((i) => {
      let totalCost = 0;

      if (i.ins) {
        totalCost = i.cost ? i.cost * i.ins : 0;
      } else if (i.outs) {
        totalCost = i.cost ? i.cost * i.outs : 0;
      }

      const stringValue = totalCost.toLocaleString();

      return {
        ...i,
        createdAt: i.createdAt
          ? new Date(i.createdAt as string).toDateString().slice(4)
          : "",
        totalCost: stringValue,
        amount: stringValue,
      };
    });

    stocks.value.push(...items);
  } catch (error) {
    console.error("Failed to fetch stocks:", error);
  }
};

await fetchStocks();
if (pages.value > 1) {
  for (let i = 2; i <= pages.value; i++) {
    page.value = i;
    await fetchStocks();
  }
}
</script>

<style scoped>
.a4-landscape {
  width: 297mm !important;
  height: 210mm !important;
  margin: 0;
  padding: 15mm;
}

th,
td {
  border: 1px solid black;
  text-align: center;
  font-family: "Times New Roman", Times, serif !important;
  height: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.custom-header-height {
  height: 2rem;
}

.th-12px {
  font-size: 14px !important;
  font-weight: 400;
  font-family: "Times New Roman", Times, serif;
}

.th-11px {
  font-size: 11px !important;
  font-weight: 400;
  font-family: "Times New Roman", Times, serif;
}

.font-times {
  font-family: "Times New Roman", Times, serif !important;
  font-weight: 700;
}

.light-theme {
  background-color: white;
  color: black;
}
</style>
