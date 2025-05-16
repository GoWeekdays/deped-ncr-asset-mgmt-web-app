<template>
  <v-row no-gutters justify="center">
    <v-col no-gutters class="fill-height px-10 custom-font a4-landscape light-theme" justify="center"
      align-content="center">
      <div class="text-end font-weight-regular text-capitalize mb-5 font-times th-15px" style="font-style: italic">
        Appendix 65
      </div>
      <v-row dense align="center" justify="center"
        class="text-center font-weight-bold text-capitalize mb-10 font-times text-uppercase"
        style="font-size: 12pt !important">


        {{ lostMaterialPrintTitle }}
      </v-row>

      <v-row dense class="mb-1" align="start" justify="start">
        <v-col cols="6" class="text-left">
          <div class="font-times th-15px font-weight-bold">
            Entity Name:
            <span class="th-15px font-times">{{ lostMaterial.entityName }}</span>
          </div>
        </v-col>

        <v-col cols="6" class="text-left">
          <div class="font-times th-15px font-weight-bold">
            Fund Cluster:
            <span class="th-15px font-times">{{ lostMaterial.fundCluster }}</span>
          </div>
        </v-col>
      </v-row>

      <table style="border-collapse: collapse; width: 100%; border: 1px solid black">
        <thead>
          <tr>
            <td colspan="2" style="padding: 5px; text-align: left; border: none">
              <label class="th-15px font-times font-weight-bold">Department/Office :</label>
              <span class="th-15px font-times" style="border-bottom: 1px solid black; display: inline-block">
                {{ lostMaterial.officeName }}
              </span>
            </td>
            <td rowspan="4" style="padding: 5px; text-align: left; vertical-align: top; border-left: 1px solid black;">
              <div v-if="isRLSDDP || isRLSDDSP">
                <label class="th-15px font-times font-weight-bold">
                  {{ isRLSDDP ? 'RLSDDP No. :' : 'RLSDDSP No. :' }}
                  <u class="th-15px font-times">{{ lostMaterial.lossNo }}</u>
                </label>
                <br />
                <label class="th-15px font-times font-weight-bold">
                  {{ isRLSDDP ? 'RLSDDP Date :' : 'RLSDDSP Date :' }}
                  <u class="th-15px font-times">
                    {{ lostMaterial.createdAt ? new Date(lostMaterial.createdAt).toDateString().slice(4) : '' }}
                  </u>
                </label>
                <br />
                <label class="th-15px font-times font-weight-bold">
                  {{ isRLSDDP ? 'PAR No. :' : 'ICS No. :' }}
                  <u class="th-15px font-times">{{ lostMaterial.issueSlipNo }}</u>
                </label>
                <br />
                <label class="th-15px font-times font-weight-bold">
                  {{ isRLSDDP ? 'PAR Date :' : 'ICS Date :' }}
                  <u class="th-15px font-times">
                    {{ lostMaterial.issuedAt ? new Date(lostMaterial.issuedAt).toDateString().slice(4) : '' }}
                  </u>
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 5px; text-align: left; border: none">
              <label class="th-15px font-times font-weight-bold">Accountable Officer :</label>
              <span class="th-15px font-times" style="border-bottom: 1px solid black; display: inline-block">
                {{ lostMaterial.officerName }}
              </span>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 5px; text-align: left; border: none">
              <label class="th-15px font-times font-weight-bold">Designation :</label>
              <span class="th-15px font-times text-capitalize"
                style="border-bottom: 1px solid black; display: inline-block">
                {{ lostMaterial.officerDesignation }}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 5px; text-align: left; border: none">
              <label class="th-15px font-times">Police Notified :</label>
              <div style="padding-left: 100px;">
                <label style="display: flex; align-items: center; gap: 5px;">
                  <input type="checkbox" name="policeNotified" value="yes" disabled
                    :checked="lostMaterial.policeNotified === 'yes'" />
                  <span class="th-15px font-times">Yes</span>
                </label>
                <label style="display: flex; align-items: center; gap: 5px; margin-top: 5px;">
                  <input type="checkbox" name="policeNotified" value="no" disabled
                    :checked="lostMaterial.policeNotified === 'no'" />
                  <span class="th-15px font-times">No</span>
                </label>
              </div>
            </td>
            <td style="padding: 5px; text-align: left; border: none">
              <label class="th-15px font-times font-weight-bold">Police Station :</label>
              <u class="th-15px font-times">{{ lostMaterial.policeStation }}</u>
              <br />
              <label class="th-15px font-times font-weight-bold">Date :</label>
              <u class="th-15px font-times">{{ lostMaterial.policeReportDate }}</u>
            </td>
          </tr>
        </thead>
      </table>


      <table style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <td class="th-15px font-times" style="border: none; padding-bottom: 5px; text-align: start">
              Status of Property : (check applicable box)
            </td>
          </tr>
          <tr style="border: none">
            <td colspan="2"
              style="border: none; padding-left: 200px; display: flex; justify-content: flex-start; gap: 20px">
              <label class="th-15px font-times" style="display: flex; align-items: center; gap: 5px">
                <input type="checkbox" name="lossStatus" value="lost" :checked="lostMaterial.lossStatus === 'lost'"
                  disabled />
                Lost
              </label>
              <label class="th-15px font-times" style="display: flex; align-items: center; gap: 5px">
                <input type="checkbox" name="lossStatus" value="damaged"
                  :checked="lostMaterial.lossStatus === 'damaged'" disabled />
                Damaged
              </label>
            </td>
          </tr>
          <tr style="border: none">
            <td colspan="2"
              style="border: none; padding-left: 200px; display: flex; justify-content: flex-start; gap: 20px">
              <label class="th-15px font-times" style="display: flex; align-items: center; gap: 5px">
                <input type="checkbox" name="lossStatus" value="stolen" :checked="lostMaterial.lossStatus === 'stolen'"
                  disabled />
                Stolen
              </label>
              <label class="th-15px font-times" style="display: flex; align-items: center; gap: 5px">
                <input type="checkbox" name="lossStatus" value="destroyed"
                  :checked="lostMaterial.lossStatus === 'destroyed'" disabled />
                Destroyed
              </label>
            </td>
          </tr>
        </thead>
      </table>



      <table>
        <thead>
          <tr class="th-15px font-times font-weight-bold">

            <th class="th-15px font-times font-weight-bold">Property No</th>
            <th class="th-15px font-times font-weight-bold">Description</th>
            <th class="th-15px font-times font-weight-bold">Acquisition Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in [
            ...(lostMaterial.itemStocks || []),
            ...Array(Math.max(0, 7 - (lostMaterial.itemStocks?.length || 0))).fill({})
          ]" :key="index" style="border: none;">
            <td class="th-15px font-times">
              {{ item.stockNumber }}
            </td>
            <td class="th-15px font-times">
              {{ item.description }}
            </td>
            <td class="th-15px font-times">
              {{ item.cost ? `₱ ${formatNumber(item.cost)}` : '' }}
            </td>

          </tr>
        </tbody>
      </table>

      <table border="1" style="border-collapse: collapse; width: 100%">
        <thead>
          <tr>
            <th style="text-align: left; padding-left: 10px">
              <div class="th-15px font-times font-weight-bold text-start">
                <p class="th-15px font-times th-reason-transfer"
                  style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal; max-width: 100%; border: none;">
                  <span class="font-weight-bold th-15px font-times"> Circumstances: </span>
                  {{ lostMaterial.circumstances }}
                </p>
              </div>

            </th>
          </tr>

        </thead>
      </table>

      <table style="width: 100%; border-collapse: collapse; border: 1px solid black;">

        <thead>
          <tr>

            <td style="width: 50%; border: 1px solid black; padding: 5px; vertical-align: top;">
              <p class="text-start th-15px font-times">I hereby certify that the item/s and circumstances stated above
                are
                true and correct.</p>


              <div style="text-align: center;">
                <div style="margin-bottom: 8px;" class="th-15px font-times mt-2"> {{ lostMaterial.officerName }}</div>
                <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;"
                  class="th-15px font-times">Signature over Printed Name of the Accountable Officer</span>
              </div>

              <div style="text-align: center;">
                <div style="margin-bottom: 8px;" class="th-15px font-times mt-1"> {{
                  lostMaterial.createdAt
                    ? new Date(lostMaterial.createdAt).toDateString().slice(4)
                    : ""
                }}</div>
                <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;"
                  class="th-15px font-times">Date</span>
              </div>


              <p class="text-start th-15px font-times">Government Issued ID : <u class="th-15px font-times">{{
                lostMaterial.governmentId }}</u></p>
              <p class="text-start th-15px font-times">ID No. : <u class="th-15px font-times">{{
                lostMaterial.governmentIdNo }}</u></p>
              <p class="text-start th-15px font-times">Date Issued : <u class="th-15px font-times">{{
                lostMaterial.governmentIdDate }}</u></p>
            </td>
            <td style="width: 40%; border: 1px solid black; padding: 10px; vertical-align: top;">
              <p class="text-center th-15px font-times">Noted by:</p>

              <div style="text-align: center;">
                <div style="margin-bottom: 8px;" class="th-15px font-times mt-2"> {{ lostMaterial.supervisorName }}
                </div>
                <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;"
                  class="th-15px font-times">Signature over Printed Name of the Immediate Supervisor</span>
              </div>

              <div style="text-align: center;">
                <div style="margin-bottom: 8px;" class="th-15px font-times mt-1"> {{
                  lostMaterial.createdAt
                    ? new Date(lostMaterial.createdAt).toDateString().slice(4)
                    : ""
                }}</div>
                <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;"
                  class="th-15px font-times">Date</span>
              </div>
            </td>
          </tr>
        </thead>
      </table>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="border: none;">
            <td colspan="2" style="padding: 5px; border: none;">
              <p class="text-start th-15px font-times">
                <span class="th-15px font-weight-bold font-times">SUBSCRIBED AND SWORN</span>
                to before me this ______day of _____________, affiant exhibiting the above
                government issued identification card.
              </p>
            </td>
          </tr>

          <tr style="border: none;">

            <td style="width: 50%; padding: 5px; vertical-align: top; border: none;">
              <p class="text-start th-15px font-times">Doc No. __________</p>
              <p class="text-start th-15px font-times">Page No. __________</p>
              <p class="text-start th-15px font-times">Book No. __________</p>
              <p class="text-start th-15px font-times">Series Of __________</p>
            </td>


            <td style="width: 50%; text-align: center; vertical-align: bottom; padding: 10px; border: none;">

              <p style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;"
                class="th-15px font-times">Notary Public</p>
            </td>
          </tr>
        </thead>

      </table>






    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "plain",
});

const { formatNumber } = useUtils()
const { lostMaterialPrintTitle, isRLSDDP, isRLSDDSP, lostMaterial, getLostMaterialById } = useLostMaterial();

const route = useRoute();
const id = computed(() => (useRoute().params.id as string) || "");

const _getLostMaterialById = async () => {
  try {
    const result = await getLostMaterialById(id.value);
    lostMaterial.value = {
      ...lostMaterial.value,
      ...result,
      itemStocks: Array.isArray(result.itemStocks)
        ? result.itemStocks.map((item) => ({
          ...item,
          createdAt: item.createdAt
            ? new Date(item.createdAt).toDateString().slice(4)
            : "N/A",
        }))
        : [],
    };
  } catch (error) {
    console.error("Error fetching lost material details:", error);
    lostMaterial.value.itemStocks = [];
  }
};
_getLostMaterialById()
</script>

<style scoped>
.a4-landscape {
  width: 210mm !important;
  height: 297mm !important;
  max-height: 297mm !important;
  overflow: hidden !important;
  display: block !important;
  page-break-after: avoid;

}

table {
  width: 100%;
  border-collapse: collapse;
  max-height: 297mm !important;
  overflow: hidden;
}

th,
td {
  height: 20px;
  text-align: left;
}

tr {
  page-break-inside: avoid !important;
}

thead {
  display: table-header-group;
}

tfoot {
  display: table-footer-group;
}

@media print {
  .a4-landscape {
    page-break-after: avoid;
  }
}

.th-14px {
  font-size: 14px !important;
  font-weight: bold !important;
  font-style: italic;
}

.th-12px {
  font-size: 12px !important;
  font-weight: normal !important;
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

.th-transfer-type {
  border: 1px solid black;
  padding: 10px;
  font-size: 12px !important;
  font-family: "Times New Roman", Times, serif !important;
}

.th-reason-transfer {
  border: 1px solid black;
  padding: 20px 10px;
  font-size: 12px !important;
  font-family: "Times New Roman", Times, serif !important;
}

.custom-height {
  height: 20rem;
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

.th-15px {
  font-size: 13px !important;
  font-weight: 400;
  font-family: "Times New Roman", Times, serif;
}

.light-theme {
  background-color: white;
  color: black;
}
</style>
