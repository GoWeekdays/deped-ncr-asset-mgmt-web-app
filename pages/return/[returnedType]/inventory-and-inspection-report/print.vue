<template>
  <v-row no-gutters justify="center">
    <v-col class="page-container" justify="center" align-content="center">
      <v-col
        class="page-content light-theme"
        justify="center"
        align-content="center"
      >
        <header>
          <div
            v-if="isReturnPPE"
            class="text-end font-times th-12px mb-2"
            style="font-style: italic"
          >
            Appendix 74
          </div>

          <div
            v-if="isReturnSEP"
            class="text-end font-times th-12px mb-2"
            style="font-style: italic"
          >
            Annex A.10
          </div>

          <div class="text-center font-times mb-4" style="font-size: 16pt">
            {{ returnInventoryTitle }}
          </div>

          <div class="d-flex justify-center mb-4">
            <div class="font-times text-caption">
              As at <u>{{ reportDate }}</u>
            </div>
          </div>
        </header>

        <v-row dense class="mb-1" align="start" justify="start">
          <v-col cols="6" class="text-start">
            <div class="font-times">
              Entity Name:
              <u class="th-12px font-weight-regular font-times">{{
                entityName
              }}</u>
            </div>
          </v-col>
          <v-col cols="6" class="text-end">
            <div class="font-times">
              Fund Cluster:
              <u class="th-12px font-weight-regular font-times">{{
                fundCluster
              }}</u>
            </div>
          </v-col>
        </v-row>

        <v-row dense class="mt-4 mb-2" align="center" justify="center">
          <template v-for="(item, index) in officerInfo" :key="index">
            <v-col cols="4" class="text-center">
              <span class="text-caption font-times font-weight-regular">{{
                item.value
              }}</span>
              <div
                class="font-times font-weight-regular text-caption officer-label"
              >
                {{ item.label }}
              </div>
            </v-col>
          </template>
        </v-row>

        <table v-if="isReturnPPE" class="inventory-table">
          <thead>
            <tr>
              <th
                colspan="10"
                class="text-center font-weight-bold border-right font-times text-caption"
              >
                INVENTORY
              </th>
              <th
                colspan="8"
                class="text-center font-weight-bold font-times text-caption"
              >
                INSPECTION and DISPOSAL
              </th>
            </tr>
            <tr>
              <th
                v-for="header in inventoryHeaders"
                :key="header.key"
                :rowspan="header.rowspan || 1"
                :colspan="header.colspan || 1"
                class="text-center border-right font-times text-caption"
              >
                {{ header.label }}
              </th>
            </tr>
            <tr v-if="disposalHeaders">
              <th
                v-for="header in disposalHeaders"
                :key="header.key"
                class="text-center border-right font-times text-caption"
              >
                {{ header.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in safeItems" :key="index">
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ formatDate(item.acquiredAt) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.name }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.stockNumber }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.quantity }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                ₱ {{ formatNumber(item.cost) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                ₱ {{ formatNumber(item.totalCost) }}
              </td>
              <td
                v-if="isReturnPPE"
                class="border-right font-times text-caption font-weight-regular"
              >
                ₱ {{ formatNumber(item.accumulatedDepreciation) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              ></td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              ></td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.remarks }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.sale }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.transfer }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.destruction }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.others }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.total }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              ></td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              ></td>
              <td></td>
            </tr>

            <tr
              v-for="n in Math.max(10 - safeItems.length, 0)"
              :key="'empty-' + n"
            >
              <td v-for="i in 18" :key="i">&nbsp;</td>
            </tr>
          </tbody>

          <tbody>
            <tr>
              <td colspan="10" class="font-weight-regular font-times">
                <div class="certification-section">
                  <p class="text-caption font-times">
                    I HEREBY request inspection and disposition, pursuant to
                    Section 79 of PD 1445, of the property enumerated above.
                  </p>
                  <div class="signature-container">
                    <div class="signature-block">
                      <span
                        class="text-start text-caption font-times font-weight-regular"
                        >Requested by:</span
                      >
                      <div class="text-center mt-2 font-times text-caption">
                        {{ nameAccountableOfficer }}
                      </div>
                      <div class="signature-line ma-0">
                        <span class="text-caption font-times"
                          >(Signature over Printed Name of Accountable
                          Officer)</span
                        >
                      </div>
                      <div class="text-center ma-0 font-times text-caption">
                        {{ designationAccountableOfficer }}
                      </div>
                      <div
                        class="text-caption signature-line text-caption font-times ma-0"
                      >
                        Designation of Accountable Officer
                      </div>
                    </div>
                    <div class="signature-block">
                      <span class="text-start text-caption font-times"
                        >Approved by:</span
                      >
                      <div class="text-center ma-0 font-times text-caption">
                        {{ nameAuthorizeOfficial }}
                      </div>
                      <div class="signature-line ma-0">
                        <span class="text-caption font-times text-center"
                          >(Signature over Printed Name of Authorized
                          Official)</span
                        >
                      </div>
                      <div class="text-center ma-0 font-times text-caption">
                        {{ designationAuthorizeOfficial }}
                      </div>
                      <div
                        class="text-caption signature-line text-caption font-times ma-0"
                      >
                        Designation of Authorized Official
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td colspan="8" class="font-times">
                <div class="certification-section">
                  <div class="signature-container">
                    <div class="signature-block">
                      <p class="text-caption font-times mb-3">
                        I CERTIFY that I have inspected each and every article
                        enumerated in this report, and that the disposition made
                        thereof was, in my judgment, the best for the public
                        interest.
                      </p>
                      <div class="signature-line">
                        <span class="text-caption font-times"
                          >(Signature over Printed Name of Inspection
                          Officer)</span
                        >
                      </div>
                    </div>
                    <div class="signature-block">
                      <p class="text-caption font-times mb-3">
                        I CERTIFY that I have witnessed the disposition of the
                        articles enumerated on this report this ___ day of
                        ____________, ____.
                      </p>
                      <div class="signature-line">
                        <span class="text-caption font-times"
                          >(Signature over Printed Name of Witness)</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-if="isReturnSEP" class="inventory-table">
          <thead>
            <tr>
              <th
                colspan="9"
                class="text-center font-weight-bold border-right font-times text-caption"
              >
                INVENTORY
              </th>
              <th
                colspan="6"
                class="text-center font-weight-bold font-times text-caption"
              >
                INSPECTION and DISPOSAL
              </th>
              <th
                colspan="3"
                class="text-center font-weight-bold font-times text-caption"
              >
                RECORD OF SALES
              </th>
            </tr>
            <tr>
              <th
                v-for="header in inventorySEPHeaders"
                :key="header.key"
                :rowspan="header.rowspan || 1"
                :colspan="header.colspan || 1"
                class="text-center border-right font-times text-caption"
              >
                {{ header.label }}
              </th>
            </tr>
            <tr>
              <th
                v-for="header in disposalHeaders"
                :key="header.key"
                class="text-center border-right font-times text-caption"
              >
                {{ header.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Item Rows -->
            <tr v-for="(item, index) in safeItems" :key="index">
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ formatDate(item.acquiredAt) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.name }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.stockNumber }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.quantity }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                ₱&nbsp;{{ formatNumber(item.cost) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                ₱&nbsp;{{ formatNumber(item.totalCost) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ formatNumber(item.accumulatedImpairmentLosses) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ formatNumber(item.carryingAmount) }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.remarks }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.sale }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.transfer }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.destruction }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.others }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.total }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.appraisedValue }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.orNo }}
              </td>
              <td
                class="border-right font-times text-caption font-weight-regular"
              >
                {{ item.amount }}
              </td>
            </tr>

            <tr
              v-for="n in Math.max(10 - safeItems.length, 0)"
              :key="'empty-' + n"
            >
              <td v-for="i in 17" :key="i">&nbsp;</td>
            </tr>
          </tbody>

          <tbody>
            <tr>
              <td colspan="10" class="font-weight-regular font-times">
                <div class="certification-section">
                  <p class="text-caption font-times">
                    I HEREBY request inspection and disposition, pursuant to
                    Section 79 of PD 1445, of the property enumerated above.
                  </p>
                  <div class="signature-container">
                    <div class="signature-block">
                      <span
                        class="text-start text-caption font-times font-weight-regular"
                        >Requested by:</span
                      >
                      <div class="text-center ma-0 font-times text-caption">
                        {{ nameAccountableOfficer }}
                      </div>
                      <div class="signature-line ma-0">
                        <span class="text-caption font-times"
                          >(Signature over Printed Name of Accountable
                          Officer)</span
                        >
                      </div>
                      <div class="text-center ma-0 font-times text-caption">
                        {{ designationAccountableOfficer }}
                      </div>
                      <div
                        class="text-caption signature-line text-caption font-times ma-0"
                      >
                        Designation of Accountable Officer
                      </div>
                    </div>
                    <div class="signature-block">
                      <span class="text-start text-caption font-times"
                        >Approved by:</span
                      >
                      <div class="text-center ma-0 font-times text-caption">
                        {{ nameAuthorizeOfficial }}
                      </div>
                      <div class="signature-line ma-0">
                        <span class="text-caption font-times text-center"
                          >(Signature over Printed Name of Authorized
                          Official)</span
                        >
                      </div>
                      <div class="text-center ma-0 font-times text-caption">
                        {{ designationAuthorizeOfficial }}
                      </div>
                      <div
                        class="text-caption signature-line text-caption font-times ma-0"
                      >
                        Designation of Authorized Official
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td colspan="8" class="font-times">
                <div class="certification-section">
                  <div class="signature-container">
                    <div class="signature-block">
                      <p class="text-caption font-times mb-3">
                        I CERTIFY that I have inspected each and every article
                        enumerated in this report, and that the disposition made
                        thereof was, in my judgment, the best for the public
                        interest.
                      </p>
                      <div class="signature-line">
                        <span class="text-caption font-times"
                          >(Signature over Printed Name of Inspection
                          Officer)</span
                        >
                      </div>
                    </div>
                    <div class="signature-block">
                      <p class="text-caption font-times mb-3">
                        I CERTIFY that I have witnessed the disposition of the
                        articles enumerated on this report this ___ day of
                        ____________, ____.
                      </p>
                      <div class="signature-line">
                        <span class="text-caption font-times"
                          >(Signature over Printed Name of Witness)</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "plain",
});

const { formatNumber } = useUtils();
const { returnInventoryTitle, isReturnPPE, isReturnSEP } = useReturn();

const items = useState("items", () => []);
const entityName = useState("entityName");
const fundCluster = useState("fundCluster");
const accountableOfficer = useState("accountableOfficer");
const accountableDesignation = useState("accountableDesignation");
const accountableStation = useState("accountableStation");
const reportDate = useState("reportDate", () => "");

const nameAccountableOfficer = useState("nameAccountableOfficer");
const designationAccountableOfficer = useState("designationAccountableOfficer");
const nameAuthorizeOfficial = useState("nameAuthorizeOfficial");
const designationAuthorizeOfficial = useState("designationAuthorizeOfficial");

const officerInfo = computed(() => [
  { value: accountableOfficer.value, label: "(Name of Accountable Officer)" },
  { value: accountableDesignation.value, label: "(Designation)" },
  { value: accountableStation.value, label: "(Station)" },
]);

const inventoryHeaders = [
  { key: "date", label: "Date Acquired", rowspan: 2 },
  { key: "particulars", label: "Particulars/Articles", rowspan: 2 },
  { key: "propertyNo", label: "Property No.", rowspan: 2 },
  { key: "qty", label: "Qty", rowspan: 2 },
  { key: "unitCost", label: "Unit Cost", rowspan: 2 },
  { key: "totalCost", label: "Total Cost", rowspan: 2 },
  {
    key: "accumulatedDepreciation",
    label: "Accumulated Depreciation",
    rowspan: 2,
  },
  {
    key: "accumulatedImpairment",
    label: "Accumulated Impairment Losses",
    rowspan: 2,
  },
  { key: "carryingAmount", label: "Carrying Amount", rowspan: 2 },
  { key: "remarks", label: "Remarks", rowspan: 2 },
  { key: "disposal", label: "DISPOSAL", colspan: 5 },
  { key: "appraisedValue", label: "Appraised Value", rowspan: 2 },
  { key: "recordOfSales", label: "RECORD OF SALES", colspan: 2 },
];

const inventorySEPHeaders = [
  { key: "date", label: "Date Acquired", rowspan: 2 },
  { key: "particulars", label: "Particulars/Articles", rowspan: 2 },
  { key: "propertyNo", label: "Semi-Expendable Property No.", rowspan: 2 },
  { key: "qty", label: "Qty", rowspan: 2 },
  { key: "unitCost", label: "Unit Cost", rowspan: 2 },
  { key: "totalCost", label: "Total Cost", rowspan: 2 },
  {
    key: "accumulatedImpairment",
    label: "Accumulated Impairment Losses",
    rowspan: 2,
  },
  { key: "carryingAmount", label: "Carrying Amount", rowspan: 2 },
  { key: "remarks", label: "Remarks", rowspan: 2 },
  { key: "disposal", label: "DISPOSAL", colspan: 5 },
  { key: "appraisedValue", label: "Appraised Value", rowspan: 2 },
  { key: "recordOfSales", label: "RECORD OF SALES", colspan: 2 },
];

const disposalHeaders = [
  { key: "sale", label: "Sale" },
  { key: "transfer", label: "Transfer" },
  { key: "destruction", label: "Destruction" },
  { key: "others", label: "Others (Specify)" },
  { key: "total", label: "Total" },
  { key: "orNo", label: "OR No." },
  { key: "amount", label: "Amount" },
];

const safeItems = computed(() => {
  const currentItems = items.value || [];
  return currentItems.slice(0, 10);
});

const formatDate = (date) => new Date(date).toDateString().slice(4);
</script>

<style scoped>
.a4-landscape {
  height: 297mm;
  width: 210mm;
  margin: 0;
}

.light-theme {
  background-color: white;
  color: black;
}

.font-times {
  font-family: "Times New Roman", Times, serif !important;
  font-weight: 700;
}

.th-12px {
  font-size: 13px !important;
  font-weight: 400;
}

.officer-label {
  border-top: 1px solid black;
  width: 80%;
  margin: 10px auto;
  padding-top: 5px;
  text-align: center;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

td {
}

.inventory-table th,
.inventory-table td {
  border: 1px solid black;
  text-align: center;
  margin: 0;
  padding: 0;
}

.certification-section {
  padding: 5px;
}

.signature-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: px;
}

.signature-block {
  flex: 1;
  text-align: left !important;
}

.signature-line {
  border-top: 1px solid black;
  margin: 20px 0 10px;
  padding-top: 5px;
  text-align: center !important;
}

.text-caption {
  font-family: "Times New Roman", Times, serif;
  font-size: 11px;
  font-weight: 400;
}

@media print {
  thead {
    display: table-header-group;
  }

  tbody {
    display: table-row-group;
  }

  .inventory-table thead {
    display: table-header-group;
  }

  .inventory-table thead:nth-of-type(n + 2) {
    display: none;
  }

  .inventory-table {
    page-break-inside: auto;
  }
}
</style>
