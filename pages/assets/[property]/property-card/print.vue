<template>
  <v-row no-gutters justify="center">
    <v-col
      no-gutters
      class="fill-height px-10 custom-font a4-landscape"
      justify="center"
      align-content="center"
    >
      <div
        class="text-center font-weight-bold text-uppercase mb-10 font-times"
        style="font-size: 14pt !important"
      >
        Report on the Physical Count of
        <span
          v-if="isSEP"
          class="text-center font-weight-bold text-uppercase mb-10 font-times"
        >
          Semi Expendable Property</span
        >
        <span
          v-else="isPPE"
          class="text-center font-weight-bold text-uppercase mb-10 font-times"
        >
          Property, Plant & Equipment</span
        >
      </div>
      <div
        class="text-center mb-10 font-times"
        style="font-size: 12pt !important"
      >
        {{ asset.name }}
      </div>
      <div
        class="text-center mb-10 font-times"
        style="font-size: 12pt !important"
      >
        As at {{ date }}
      </div>

      <v-row class="mb-2" align="start" justify="start">
        <v-col cols="6" class="text-left">
          <div
            class="font-times"
            style="font-size: 11pt !important; font-weight: bold"
          >
            Fund Cluster: {{ asset.fundCluster }}
          </div>
          <div
            class="font-times"
            style="font-size: 10pt !important; font-weight: bold"
          >
            For which
            <!-- {{ user.name }}, {{ user.role }},
            {{ asset.entityName }}  -->
            is accountable, having assumed such accountability on
            <!-- {{ assumptionDate }} -->
          </div>
        </v-col>
      </v-row>

      <table>
        <thead>
          <tr>
            <th rowspan="3" class="text-center th-9px text-uppercase">
              Article
            </th>
            <th rowspan="3" class="text-center th-9px text-uppercase">
              Description
            </th>
            <th rowspan="3" class="text-center th-9px">
              <span v-if="isSEP" class="text-center th-9px"
                >Semi Expendable Property No.</span
              >
              <span v-else="isPPE" class="text-center th-9px"
                >Property No.</span
              >
            </th>
            <th rowspan="3" class="text-center th-9px text-uppercase">
              Unit of<br />Measure
            </th>
            <th rowspan="3" class="text-center th-9px text-uppercase">
              Unit<br />Value
            </th>
            <th rowspan="3" class="custom-table-header text-center th-8px">
              QUANTITY<br />per<br />PROPERTY CARD
            </th>
            <th rowspan="3" class="text-center th-8px">
              QUANTITY<br />per<br />PHYSICAL COUNT
            </th>
            <th
              colspan="3"
              rowspan="2"
              class="text-center th-9px text-uppercase"
            >
              Shortage/Overage
            </th>
            <th rowspan="3" class="text-center th-9px text-uppercase">
              Remarks
            </th>
          </tr>
          <tr></tr>
          <tr>
            <th class="text-center th-9px">Quantity</th>
            <th class="text-center th-9px">Value</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td class="td-10px">{{ asset.article }}</td>
            <td class="td-10px">{{ asset.description }}</td>
            <td class="td-10px">{{ asset.stockNumber }}</td>
            <td class="td-10px">{{ asset.unitOfMeasurement }}</td>
            <td class="td-10px">{{ asset.cost }}</td>
            <td class="td-10px">{{ asset.quantity }}</td>
            <td class="td-10px">{{ asset.shortageQty }}</td>
            <td class="td-10px">{{ asset.shortageCost }}</td>
            <td class="td-10px">{{ asset.remarks }}</td>
          </tr>
        </tbody>
      </table>

      <table style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th
              style="
                text-align: left;
                width: 33.33%;
                font-size: 11px;
                padding: 0.5rem 0.188rem 1.5rem;
                border: none;
              "
            >
              Certified Correct by
            </th>
            <th
              style="
                text-align: left;
                width: 33.33%;
                font-size: 11px;
                padding: 0.5rem 0.188rem 1.5rem;
                border: none;
              "
            >
              Approved by:
            </th>
            <th
              style="
                text-align: left;
                width: 33.33%;
                font-size: 11px;
                padding: 0.5rem 0.188rem 1.5rem;
                border: none;
              "
            >
              Verified by:
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style="
                text-align: center;
                vertical-align: top;
                border-top: none;
                font-size: 11px;
                border: none;
                padding: 15px;
              "
            >
              <span
                class="font-times"
                style="border-top: 1px solid; display: block; padding: 5px"
                >Signature over Printed Name of<br />Inventory Committee Chair
                and<br />
                Members</span
              >
            </td>
            <td
              style="
                text-align: center;
                vertical-align: top;
                border-top: none;
                font-size: 11px;
                border: none;
                padding: 15px;
              "
            >
              <span
                class="font-times"
                style="border-top: 1px solid; display: block; padding: 5px"
              >
                Signature over Printed Name of Head of Agency/Entity or<br />Authorized
                Representative</span
              >
            </td>
            <td
              style="
                text-align: center;
                vertical-align: top;
                border-top: none;
                font-size: 11px;
                border: none;
                padding: 15px;
              "
            >
              <span
                class="font-times"
                style="border-top: 1px solid; display: block; padding: 5px"
              >
                Signature over Printed Name of COA<br />Representative</span
              >
            </td>
          </tr>
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

const { getAssetById, asset } = useAsset();
const { stocks } = useStock();
const route = useRoute();

const _stocks = computed(() => {
  return asset.value.itemStocks;
});

const _id = route.params.id;
const _getAsset = async () => {
  try {
    asset.value = await getAssetById(_id);
  } catch (error) {
    console.error("Error fetching asset:", error);
  }
};

_getAsset();
</script>

<style scoped>
.a4-landscape {
  width: 275mm !important;
  height: 200mm !important;
  /* border: 1px solid black; */
}

.td-10px {
  font-size: 10px !important;
  font-family: "Times New Roman", Times, serif !important;
}

.th-9px {
  font-size: 9px !important;
  font-family: "Times New Roman", Times, serif !important;
}

.th-8px {
  font-size: 8px !important;
  font-weight: bold !important;
  font-family: "Times New Roman", Times, serif !important;
}

.custom-divider-one {
  width: 20rem;
  margin: 0 auto;
}

.custom-divider-two {
  width: 10rem !important;
  margin: 0 auto;
}

.custom-hr-width {
  width: 10rem;
}

table {
  width: 100%;
  border: 1px solid black;
  background-color: #fff;
  border-collapse: collapse;
}

td {
  border: 1px solid black;
  text-align: center;
  font-family: "Times New Roman", Times, serif !important;
}

th {
  border: 1px solid black;
  text-align: center;
  font-family: "Times New Roman", Times, serif !important;
}

.th-purpose {
  border: 1px solid black;
  padding: 10px;
  font-size: 12px !important;
  font-family: "Times New Roman", Times, serif !important;
}

.custom-height {
  height: 20rem;
}

.custom-table-header {
  height: 3rem;
}

.align-left {
  text-align: left;
}

.no-bottom-border {
  border-bottom: none;
}

.no-top-border {
  border-top: none;
}

.no-right-border {
  border-right: none;
}

.no-left-border {
  border-left: none;
}

.custom-font {
  font-size: 12 !important;
  font-family: "Times New Roman", Times, serif;
}

.padding-bottom {
  padding-bottom: 2.5rem;
}

.vertical-top {
  vertical-align: top;
}

.padding-left-top {
  padding-left: 0.5rem;
  padding-top: 0.5rem;
}

.font-times {
  font-family: "Times New Roman", Times, serif !important;
}

.custom-px-sm {
  padding-inline: 0.5rem;
}

.custom-px-md {
  padding-inline: 1.5rem;
}

.underline {
  border-bottom: 1px solid black;
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
