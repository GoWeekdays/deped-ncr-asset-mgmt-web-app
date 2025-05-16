<template>
  <v-row no-gutters justify="center">
    <v-col no-gutters class="fill-height px-10 custom-font a4-landscape light-theme" justify="center"
      align-content="center">
      <div class="text-end font-weight-regular text-capitalize mb-2 font-times th-12px" style="font-style: italic">
        Appendix 64
      </div>

      <div class="text-center font-weight-bold text-capitalize mb-8 font-times" style="font-size: 16pt !important">
        REPORT OF SUPPLIES AND MATERIALS ISSUED
      </div>

      <v-row dense class="mb-1" align="start" justify="start">
        <v-col cols="6" class="text-left">
          <div class="font-times">
            Entity Name:
            <u class="th-12px font-times font-weight-regular">{{
              entityName
            }}</u>
          </div>
        </v-col>
        <v-col cols="6" class="text-left">
          <div class="font-times">
            Serial No:
            <u class="th-12px font-times font-weight-regular">{{ serialNo }}</u>
          </div>
        </v-col>

        <v-col cols="6" class="text-left">
          <div class="font-times">
            Fund Cluster:
            <u class="th-12px font-times font-weight-regular">{{
              fundCluster
            }}</u>
          </div>
        </v-col>
        <v-col cols="6" class="text-left">
          <div class="font-times">
            Date:

            <u class="th-12px font-times font-weight-regular">{{ new Date(createdAt).toDateString().slice(4) }}
            </u>
          </div>
        </v-col>
      </v-row>

      <table class="table table-bordered">
        <thead>
          <tr>
            <th colspan="6" class="text-center text-caption font-weight-regular" style="width: 12%; font-style: italic">
              To be filled up by the Supply and/or Property Division/Unit
            </th>
            <th colspan="4" class="text-center text-caption font-weight-regular" style="width: 12%; font-style: italic">
              To be filled up by the Accounting Division/Unit
            </th>
          </tr>
          <tr>
            <th class="text-center th-8px custom-table-header" style="width: 12%">
              RIS No.
            </th>
            <th class="text-center th-8px custom-table-header" style="width: 12%">
              Responsibility Center Code
            </th>
            <th class="text-center th-8px custom-table-header" style="width: 12%">
              Stock No.
            </th>
            <th class="text-center th-8px custom-table-header" style="width: 16%">
              Item
            </th>
            <th class="text-center th-8px custom-table-header" style="width: 8%">
              Unit
            </th>
            <th class="text-center th-8px custom-table-header" style="width: 10%">
              Quantity Issued
            </th>
            <th class="text-center th-8px custom-table-header" style="width: 10%">
              Unit Cost
            </th>
            <th class="text-center th-8px custom-table-header" style="width: 10%">
              Amount
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in items.slice(0, 10)" :key="index">
            <td class="th-12px">{{ item.risNo }}</td>
            <td class="th-12px">{{ item.rcc }}</td>
            <td class="th-12px">{{ item.stockNumber }}</td>
            <td class="th-12px">{{ item.name }}</td>
            <td class="th-12px">{{ item.unitOfMeasurement }}</td>
            <td class="th-12px">{{ item.issueQty }}</td>
            <td class="th-12px">₱&nbsp;{{ formatNumber(item.cost) }}</td>
            <td class="custom-height th-12px">₱&nbsp;{{ formatNumber(item.amount) }}</td>
          </tr>

          <tr v-for="n in 10 - items.length" :key="'placeholder-' + n">
            <td class="custom-height th-12px">&nbsp;</td>
            <td class="custom-height th-12px">&nbsp;</td>
            <td class="custom-height th-12px">&nbsp;</td>
            <td class="custom-height th-12px">&nbsp;</td>
            <td class="custom-height th-12px">&nbsp;</td>
            <td class="custom-height th-12px">&nbsp;</td>
            <td class="custom-height th-12px">&nbsp;</td>
            <td class="custom-height th-12px">&nbsp;</td>
          </tr>

          <tr>
            <td colspan="1" class="text-center font-weight-bold"></td>
            <td colspan="2" class="text-center font-weight-bold">
              Recapitulation:
            </td>
            <td colspan="1"></td>
            <td colspan="1"></td>
            <td colspan="3" class="text-center font-weight-bold">
              Recapitulation:
            </td>
          </tr>

          <tr>
            <td class="custom-height">&nbsp;</td>
            <td class="text-center font-weight-bold">Stock No.</td>
            <td class="text-center font-weight-bold">Quantity Issued</td>
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
            <td class="text-center font-weight-bold">Unit Cost</td>
            <td class="text-center font-weight-bold">Amount</td>
            <td class="text-center font-weight-bold">UACS Object Code</td>
          </tr>

          <tr v-for="n in 10" :key="'placeholder-' + n">
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
            <td class="custom-height">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <table border="1" style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th colspan="3" style="text-align: start; width: 50%" class="font-weight-regular text-body-2 font-times">
              I hereby certify to the correctness of the above information.
            </th>
            <th colspan="3" style="text-align: start; width: 50%" class="font-times font-weight-regular text-body-2">
              Posted by:
            </th>
          </tr>
        </thead>
        <tbody class="text-capitalize th-11px">
          <tr>
            <td colspan="3" style="border-top: hidden; text-align: center">
              <div style="margin-bottom: 8px"></div>
              <div class="text-primary-text text-center text-caption font-weight-regular font-times mt-3">
                {{ admin }}
              </div>
              <span style="
                  border-top: 1px solid;
                  display: inline-block;
                  padding: 5px 0;
                  width: 70%;
                " class="font-times font-weight-regular text-caption">
                Signature over Printed Name of Supply and/or Property Custodian
              </span>
            </td>

            <td colspan="3" style="border-top: hidden; text-align: center">
              <div style="
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 20px;
                ">
                <span style="
                    border-top: 1px solid;
                    display: inline-block;
                    padding: 5px 0;
                    width: 70%;
                  " class="font-times font-weight-regular text-caption mt-3">
                  Signature over Printed Name of Designated Accounting Staff
                </span>
                <span style="
                    border-top: 1px solid;
                    display: inline-block;
                    padding: 5px 0;
                    width: 30%;
                  " class="font-times font-weight-regular text-caption mt-3">
                  Date
                </span>
              </div>
            </td>
          </tr>
        </tbody>
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
const items = useState("items", () => []);
const entityName = useState("entityName");
const fundCluster = useState("fundCluster");
const admin = ref("Arrianne Astrero");
const postedBy = useState("postedBy");
const createdAt = useState("createdAt");
const serialNo = useState("serialNo", () => "N/A");
</script>

<style scoped>
.a4-landscape {
  height: 297mm !important;
  width: 210mm !important;
  margin: 0;
  padding: 15mm;
}

th,
td {
  border: 1px solid black;
  text-align: center;
  font-family: "Times New Roman", Times, serif !important;
  padding: 2px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.custom-header-height {
  height: 1rem;
}

.custom-height {
  height: 10px;
}

.th-12px {
  font-size: 13px !important;
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
