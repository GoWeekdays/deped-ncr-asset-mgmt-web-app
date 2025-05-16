<template>
  <v-row no-gutters justify="center">
    <v-col no-gutters class="fill-height px-10 custom-font a4-landscape" justify="center" align-content="center">
      <div class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px" style=" font-style: italic;">
        Appendix 63
      </div>
      <div class="text-center font-weight-bold text-capitalize mb-10 font-times" style="font-size: 16pt !important">
        REQUISITION AND ISSUE SLIPS
      </div>

      <v-row class="mb-2" align="start" justify="start">
        <v-col cols="6" class="text-left">
          <div class="font-times" style="font-size: 11pt !important; font-weight: bold">
            Entity Name: {{ requisition.entityName }}
          </div>
        </v-col>

        <v-col cols="6" class="text-left">
          <div class="font-times" style="font-size: 11pt !important; font-weight: bold">
            Fund Cluster: {{ requisition.fundCluster }}
          </div>
        </v-col>
      </v-row>

      <table>
        <thead>
          <tr>
            <th colspan="5" class="text-start text-capitalize">
              Division:
              <u class="th-12px font-times font-weight-regular">{{ requisition.division }}</u>
            </th>
            <th colspan="5" class="text-start">
              Responsibility Center Code:
              <u class="th-12px font-times font-weight-regular">{{ requisition.rcc }}</u>
            </th>
          </tr>
          <tr>
            <th colspan=" 5" class="text-start">
              Office: <u class="th-12px font-times font-weight-regular">{{ requisition.office }}</u>
            </th>
            <th colspan="6" class="text-start">
              RIS No: <u class="th-12px font-times font-weight-regular">{{ requisition.risNo }}</u>
            </th>
          </tr>
          <tr>
            <th colspan="4" class="text-center font-weight-bold font-italic text-body-2">
              Requisition
            </th>
            <th colspan="2" class="text-center font-weight-bold font-italic text-body-2">
              Stock Available?
            </th>
            <th colspan="3" class="text-center font-weight-bold font-italic text-body-2">
              Issue
            </th>
          </tr>
          <tr>
            <th class="text-center th-12px">Stock No</th>
            <th class="text-center th-12px">Unit</th>
            <th class="text-center th-12px">Description</th>
            <th class="text-center th-12px">Quantity</th>
            <th class="text-center th-12px">Yes</th>
            <th class="text-center th-12px">No</th>
            <th class="text-center th-12px">Quantity</th>
            <th class="text-center th-12px">Remarks</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="index in 12" :key="index">
            <td class="custom-height th-12px">
              {{ requisition.itemStocks[index - 1]?.stockNumber || '' }}
            </td>
            <td class="custom-height th-12px">
              {{ requisition.itemStocks[index - 1]?.unitOfMeasurement || '' }}
            </td>
            <td class="custom-height th-12px">
              {{ requisition.itemStocks[index - 1]?.description || '' }}
            </td>
            <td class="custom-height th-12px">
              {{ requisition.itemStocks[index - 1]?.requestQty || '' }}
            </td>
            <td class="custom-height th-12px">
              {{ requisition.itemStocks[index - 1]?.isAvailable === "yes" ? "Yes" : "" }}
            </td>
            <td class="custom-height">
              {{ requisition.itemStocks[index - 1]?.isAvailable === "no" ? "No" : "" }}
            </td>
            <td class="custom-height th-12px">
              {{ requisition.itemStocks[index - 1]?.issueQty || '' }}
            </td>
            <td class="custom-height th-12px" colspan="2">
              {{ requisition.itemStocks[index - 1]?.remarks || '' }}
            </td>
          </tr>
        </tbody>

      </table>

      <table>
        <tbody>
          <tr>
            <td colspan="12" rowspan="3" class="text-start th-purpose">
              Purpose: {{ requisition.purpose }}
            </td>
          </tr>
        </tbody>
      </table>
      <table border="1" style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th style="text-align: center; width: 20%"></th>
            <th style="text-align: center; width: 20%">Requested by:</th>
            <th style="text-align: center; width: 20%">Approved by:</th>
            <th style="text-align: center; width: 20%">Issued by:</th>
            <th style="text-align: center; width: 20%">Received by:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: left; vertical-align: top; border-top: none">
              Signature: {{ requisition.requestedBy }}
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td style="text-align: left; vertical-align: top">Printed Name:</td>
            <td class="th-12px">{{ requisition.requestedByName }}</td>
            <td class="th-12px">{{ requisition.approvedByName }}</td>
            <td class="th-12px">{{ requisition.issuedByName }}</td>
            <td class="th-12px">{{ requisition.receivedByName }}</td>
          </tr>
          <tr class="text-capitalize">
            <td style="text-align: left; vertical-align: top">Designation:</td>
            <td class="th-12px">{{ requisition.requestedByDesignation }}</td>
            <td class="th-12px">{{ requisition.approvedByDesignation }}</td>
            <td class="th-12px">{{ requisition.issuedByDesignation }}</td>
            <td class="th-12px">{{ requisition.receivedByDesignation }}</td>
          </tr>
          <tr>
            <td style="text-align: left; vertical-align: top">Date:</td>
            <td class="th-12px">


              {{
                requisition.createdAt
                  ? new Date(requisition.createdAt).toDateString().slice(4)
                  : ""
              }}
            </td>
            <td class="th-12px">
              {{
                requisition.approvedAt
                  ? new Date(requisition.approvedAt).toDateString().slice(4)
                  : ""
              }}
            </td>
            <td class="th-12px">
              {{
                requisition.completedAt
                  ? new Date(requisition.completedAt).toDateString().slice(4)
                  : ""
              }}
            </td>
            <td class="th-12px">
              {{
                requisition.completedAt
                  ? new Date(requisition.completedAt).toDateString().slice(4)
                  : ""
              }}
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

const { getRequisitionById, requisition } = useRequisition();
const { stocks } = useStock();
const route = useRoute();

const _stocks = computed(() => {
  return requisition.value.itemStocks;
});

const _id = route.params.id;
const _getRequisition = async () => {
  try {
    requisition.value = await getRequisitionById(_id);
  } catch (error) {
    console.error("Error fetching requisition:", error);
  }
};

_getRequisition();
</script>

<style scoped>
.a4-landscape {
  height: 275mm !important;
  width: 200mm !important;
}

.th-14px {
  font-size: 14px !important;
  font-weight: bold !important;
  font-style: italic;
}

.th-12px {
  font-size: 16px !important;
  font-weight: 400;
  font-family: "Times New Roman", Times, serif;
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
  font-size: 16px !important;
  font-family: "Times New Roman", Times, serif !important;
}

.custom-height {
  height: 20px;
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
