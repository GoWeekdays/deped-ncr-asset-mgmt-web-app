<template>
  <v-row no-gutters justify="center">
    <v-col
      no-gutters
      class="fill-height px-10 custom-font a4-landscape light-theme"
      justify="center"
      align-content="center"
    >
      <div
        v-if="isPPE"
        class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px"
        style="font-style: italic"
      >
        Appendix 69
      </div>
      <div
        class="text-center font-weight-bold text-capitalize mb-10 font-times text-uppercase"
        style="font-size: 14pt !important"
      >
        {{ assetCardPrint }}
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
      <table>
        <thead>
          <tr></tr>
          <tr class="text-start">
            <td
              v-if="isPPE"
              class="text-start th-12px font-times font-weight-bold"
            >
              Property, Plant and Equipment:
              <u class="th-12px font-times font-weight-regular">
                {{ asset.name }}
              </u>
            </td>
            <td
              v-if="isSEP"
              class="text-start th-12px font-times font-weight-bold"
            >
              Semi-expendable Property:
              <u class="th-12px font-times font-weight-regular">
                {{ asset.name }}
              </u>
            </td>
            <td
              rowspan="2"
              class="text-start th-12px font-times font-weight-regular"
            >
              Property Number:
              <u class="th-12px font-times font-weight-regular">
                {{ asset.stockNumber }}
              </u>
            </td>
          </tr>
          <tr>
            <td class="text-start th-12px font-times font-weight-bold">
              Description:
              <u class="th-12px font-times font-weight-regular">
                {{ asset.description }}
              </u>
            </td>
          </tr>
        </thead>
      </table>
      <table>
        <thead class="custom-header-height font-times">
          <tr>
            <th class="text-center" rowspan="2">Date</th>
            <th v-if="isSEP" class="text-center" rowspan="2">Reference</th>
            <th v-if="isPPE" class="text-center" rowspan="2">
              Reference/PAR No.
            </th>
            <th class="text-center" :colspan="isPPE ? '2' : '3'">Receipt</th>
            <th class="text-center" colspan="3">Issue/Transfer/Disposal</th>
            <th v-if="!isPPE" class="text-center" rowspan="2">Balance QTY</th>
            <th class="text-center" rowspan="2">Amount</th>
            <th class="text-center" rowspan="2">Remarks</th>
          </tr>
          <tr>
            <th class="text-center">Qty</th>
            <th class="text-center">Unit Cost</th>
            <th v-if="!isPPE" class="text-center">Total Cost</th>
            <th class="text-center">Item No.</th>
            <th class="text-center">Qty</th>
            <th class="text-center">Office/Officer</th>
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
              <td v-if="isSEP" class="custom-height th-12px">
                {{ item.reference || "" }}
              </td>
              <td v-if="isPPE" class="custom-height th-12px">
                {{ item.reference || "" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.ins || "0" }}
              </td>
              <td class="custom-height th-12px">
                ₱&nbsp;{{ formatNumber(item.cost) }}
              </td>
              <td v-if="!isPPE" class="custom-height th-12px">
                ₱&nbsp;{{ formatNumber(item.totalCost) }}
              </td>
              <td class="custom-height th-12px">
                {{ item.itemNo || "" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.outs || "0" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.office || "" }}
              </td>
              <td v-if="!isPPE" class="custom-height th-12px">
                {{ item.balance || "0" }}
              </td>
              <td class="custom-height th-12px">
                ₱ {{ formatNumber(item.amount) || "" }}
              </td>
              <td class="custom-height th-12px">
                {{ item.remarks || "" }}
              </td>
            </tr>
          </template>

          <!-- Fill empty rows to maintain at least 10 rows, but only when data exists -->
          <template v-if="stocks.length > 0">
            <tr
              v-for="index in Math.max(10 - stocks.length, 0)"
              :key="'empty-' + index"
              class="text-capitalize"
            >
              <td class="custom-height th-12px"></td>
              <td v-if="isSEP" class="custom-height th-12px"></td>
              <td v-if="isPPE" class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td v-if="!isPPE" class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td class="custom-height th-12px"></td>
              <td v-if="!isPPE" class="custom-height th-12px"></td>
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
const { formatNumber } = useUtils();
const assetId = useRoute().params.id as string;
const { getById, assetCardPrint, name, isSEP, isPPE, type } = useAsset();
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
    const items = _stocks.items as Array<TStock>;
    stocks.value = items.map((i) => {
      let totalCost = 0;

      if (i.ins) {
        totalCost = i.cost ? i.cost * i.ins : 0;
      } else if (i.outs) {
        totalCost = i.cost ? i.cost * i.outs : 0;
      }

      return {
        ...i,
        createdAt: i.createdAt
          ? new Date(i.createdAt as string).toDateString().slice(4)
          : "",
        totalCost,
        amount: totalCost,
      };
    });
  } catch (error) {
    console.error("Failed to fetch stocks:", error);
  }
};

fetchStocks();

await fetchStocks();
if (pages.value > 1) {
  for (let i = 2; i <= pages.value; i++) {
    page.value = i;
    await fetchStocks();
    console.log("Page", i);
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
