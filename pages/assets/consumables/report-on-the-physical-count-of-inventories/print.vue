<template>
  <v-row no-gutters justify="center">
    <v-col no-gutters class="fill-height px-5 custom-font a4-landscape" justify="center" align-content="center">
      <div class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px" style="font-style: italic">
        Appendix 66
      </div>
      <div class="text-center font-weight-bold text-capitalize mb-5 font-times" style="font-size: 16pt !important">
        REPORT ON THE PHYSICAL COUNT OF INVENTORIES
      </div>
      <div class="text-center">
        <span class="font-times" style="font-size: 12pt !important">Consumables</span>
      </div>

      <v-row justify="center">
        <v-col class="text-center font-times mt-2 px-2 mb-2" style="
            font-size: 10pt !important;
            border-top: 1px solid black;
            max-width: 30%;
          ">
          (Type of Inventory Item)
        </v-col>
      </v-row>

      <div class="d-flex justify-center mb-4">
        <div class="font-times" style="font-size: 12pt !important">
          As at
          <u class="font-times" style="font-size: 12pt !important">{{
            reportDate
          }}</u>
        </div>
      </div>

      <div class="d-flex mb-2">
        <div class="font-times" style="font-size: 11pt !important; font-weight: bold">
          Fund Cluster:
          <u class="font-times" style="font-size: 12pt !important">{{
            fundCluster
          }}</u>
        </div>
      </div>

      <div class="mb-2 font-times" style="font-size: 11pt !important; font-weight: bold">
        For which
        <span class="underline font-times" style="font-size: 11pt !important; font-style: italic !important">Jocelyn DR.
          Andaya</span>,
        <span class="underline font-times" style="font-size: 11pt !important; font-style: italic !important">Director
          IV, DepEd NCR</span>
        is accountable, having assumed such accountability on
        <span class="underline font-times" style="font-size: 11pt !important; font-style: italic !important">
          November 16, 2021</span>.
      </div>

      <table style="font-size: 11pt !important" class="table-container">
        <thead>
          <tr>
            <th style="width: 6rem" rowspan="2">Article</th>
            <th style="width: 15rem" rowspan="2">Description</th>
            <th style="width: 8rem" rowspan="2">Stock Number</th>
            <th style="width: 6.5rem" rowspan="2">Unit of Measure</th>
            <th style="width: 6.5rem" rowspan="2">Unit Value</th>
            <th>Balance Per Card</th>
            <th>On Hand Per Count</th>
            <th style="width: 7rem" colspan="2">Shortage/Overage</th>
            <th style="width: 18rem" rowspan="2">Remarks</th>
          </tr>
          <tr>
            <th style="width: 7rem; font-weight: normal">(Quantity)</th>
            <th style="width: 7rem; font-weight: normal">(Quantity)</th>
            <th style="width: 7rem; font-weight: normal">Quantity</th>
            <th style="width: 7rem; font-weight: normal">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td class="custom-height">{{ item.article }}</td>
            <td class="custom-height">{{ item.description }}</td>
            <td class="custom-height">{{ item.stockNumber }}</td>
            <td class="custom-height">{{ item.unitOfMeasurement }}</td>
            <td class="custom-height"> ₱&nbsp;{{ formatNumber(item.cost) }}</td>
            <td class="custom-height">{{ item.quantity }}</td>
            <td class="custom-height">{{ item.onHandPerCount }}</td>
            <td class="custom-height">{{ item.shortageQuantity }}</td>
            <td class="custom-height"> ₱&nbsp;{{ formatNumber(item.shortageValue) }}</td>
            <td class="custom-height">{{ item.remarks }}</td>
          </tr>
        </tbody>

        <tfoot>
          <tr>
            <td colspan="3" class="align-left no-bottom-border no-right-border padding-bottom padding-left-top">
              Certified Correct by:
            </td>
            <td colspan="5"
              class="align-left no-bottom-border no-right-border no-left-border padding-bottom padding-left-top">
              Approved by:
            </td>
            <td colspan="2" class="align-left no-bottom-border no-left-border padding-bottom padding-left-top">
              Verified by:
            </td>
          </tr>
          <tr>
            <td class="no-top-border no-right-border vertical-top padding-bottom custom-px-sm" colspan="3">
              <div class="text-primary-text text-center font-times">
                {{ certifiedBy }}
              </div>
              <hr />
              <div class="font-times">
                Signature over Printed Name of Inventory Committee Chair and
                Members
              </div>
            </td>
            <td class="no-top-border no-right-border no-left-border vertical-top padding-bottom custom-px-md"
              colspan="5">
              <div class="text-primary-text text-center font-times">
                {{ approvedBy }}
              </div>
              <hr />
              <div class="font-times">
                Signature over Printed Name of Head of Agency/Entity or
                Authorized Representative
              </div>
            </td>

            <td colspan="2" class="no-top-border no-left-border mb-10 vertical-top padding-bottom custom-px-sm">
              <div class="text-primary-text text-center font-times">
                {{ verifiedBy }}
              </div>
              <hr />
              <div class="font-times">
                Signature over Printed Name of COA Representative
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "plain",
});

const { formatNumber } = useUtils();

const reportDate = useState("reportDate");

const fundCluster = useState("fundCluster");
const items = useState("items");
const verifiedBy = useState("verifiedBy");
const certifiedBy = ref("Ariane Astrero");
const approvedBy = ref("Joyce DR. Andaya");
</script>

<style scoped>
.a4-landscape {
  width: 297mm !important;
  height: 200mm !important;
  margin: 20px 15px;
  background-color: white;
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
  padding-bottom: 1rem;
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



.underline {
  border-bottom: 1px solid black;
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
