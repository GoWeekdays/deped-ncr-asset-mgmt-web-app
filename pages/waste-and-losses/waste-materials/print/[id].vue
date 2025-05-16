<template>
    <v-row no-gutters justify="center">
        <v-col no-gutters class="fill-height px-10 custom-font a4-landscape light-theme" justify="center"
            align-content="center">
            <div class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px"
                style=" font-style: italic;">
                Appendix 65

            </div>
            <div class="text-center font-weight-bold text-capitalize mb-10 font-times text-uppercase"
                style="font-size: 14pt !important">
                WASTE MATERIALS REPORT
            </div>

            <v-row class="mb-1" align="start" justify="start">
                <v-col cols="6" class="text-left">
                    <div class="font-times th-15px font-weight-bold">
                        Entity Name: <u class="th-15px font-times">{{ waste.entityName }}</u>
                    </div>
                </v-col>

                <v-col cols="6" class="text-left">
                    <div class="font-times th-15px font-weight-bold">
                        Fund Cluster: <u class="th-15px font-times">{{ waste.fundCluster }}</u>
                    </div>
                </v-col>
            </v-row>

            <table border="0" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>

                        <th style="width: 60%; text-align: left; padding-left: 10px;">
                            <p class="th-15px font-times">Place of Storage : {{
                                waste.placeOfStorage }}</p>

                        </th>


                        <th style="width: 40%; text-align: left; padding-left: 10px;">
                            <p class="th-15px font-times">Date : {{
                                waste.createdAt
                                    ? new Date(waste.createdAt).toDateString().slice(4)
                                    : ""
                            }}
                            </p>

                        </th>
                    </tr>
                </thead>

            </table>

            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>

                        <th style=" text-align: left; padding-left: 10px;">
                            <p class="th-15px font-times font-weight-bold">ITEM FOR DISPOSAL</p>
                        </th>
                    </tr>
                </thead>

            </table>
            <table border="1">
                <thead>
                    <tr>
                        <th rowspan="3" class="th-15px font-times font-weight-bold">Item</th>
                        <th rowspan="3" class="th-15px font-times font-weight-bold" style="width: 5%;">Quantity</th>
                        <th rowspan="3" class="th-15px font-times font-weight-bold">Unit</th>
                        <th rowspan="3" class="th-15px font-times font-weight-bold">Description</th>
                        <th colspan="3" class="th-15px font-times font-weight-bold">Record of Sales</th>
                    </tr>
                    <tr>
                        <th colspan="3" class="th-15px font-times font-weight-bold">Official Receipt</th>
                    </tr>
                    <tr>
                        <th class="th-15px font-times font-weight-bold" style="width: 9%;">No.</th>
                        <th class="th-15px font-times font-weight-bold" style="width: 9%;">Date</th>
                        <th class="th-15px font-times font-weight-bold" style="width: 9%;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="index in 10" :key="index">
                        <td class="th-15px font-times">{{ index }}</td>
                        <td class="th-15px font-times"><span class="th-15px font-times"
                                v-if="waste.itemStocks[index - 1]?.name">1</span></td>
                        <td class="th-15px font-times">{{ waste.itemStocks[index - 1]?.unitOfMeasurement || '' }}</td>
                        <td class="th-15px font-times">
                            {{ waste.itemStocks[index - 1]?.remarks || '' }}
                            <span class="th-15px font-times" v-if="waste.itemStocks[index - 1]?.name">taken from {{
                                waste.itemStocks[index -
                                    1]?.name }}</span>
                        </td>
                        <td class="th-15px font-times"></td>
                        <td class="th-15px font-times"></td>
                        <td class="th-15px font-times"></td>
                    </tr>
                    <tr>
                        <td colspan="4" class="th-15px font-weight-bold">TOTAL</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>



            <table border="2" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th colspan="3" style="text-align: start; width: 50%; padding: 13px;"
                            class="font-weight-regular th-15px">
                            Certified Correct:
                        </th>
                        <th colspan="3" style="text-align: start; width: 50%; padding: 13px;"
                            class="font-weight-regular th-15px">
                            Disposal Approved:
                        </th>
                    </tr>
                </thead>
                <tbody class="text-capitalize th-15px"
                    style="font-family: 'Times New Roman', Times, serif; font-size: 11px;">
                    <tr>
                        <td colspan="3" style="border-top: hidden; text-align: center; padding: 10px;">
                            <div class="th-15px font-times" style="margin-bottom: 2px;">{{ waste.certifiedByName }}
                            </div>
                            <span class="th-15px font-times"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Signature over Printed Name of Supply <br> and/or Property Custodian
                            </span>
                        </td>
                        <td colspan="3" style="border-top: hidden; text-align: center; padding: 10px;">
                            <div class="th-15px font-times" style="margin-bottom: 2px;">{{ waste.disposalApprovedByName
                                }}</div>
                            <span class="th-15px font-times"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Signature over Printed Name of Head of Agency/Entity or his/her Authorized
                                Representative
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>


            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>

                        <th style=" text-align: left; padding-left: 10px;">
                            <p class="th-15px font-times font-weight-bold text-center">CERTIFICATE OF INSPECTION</p>
                        </th>


                    </tr>
                    <tr>
                        <th style="text-align: start; padding-left: 5px 10px;">
                            <p class="th-15px font-times text-start pl-15" style="text-align: center; padding: 5px">
                                I hereby certify that the property enumerated above was disposed of as follows:
                            </p>
                            <div class="th-15px font-times text-start pl-15 mt-2"
                                style="margin: auto; display: inline-block; text-align: start; padding: 5px">
                                <p class="th-15px font-times">Item <u class="th-15px font-times">{{
                                    waste.destroyed || 0 }}</u> Destroyed</p>
                                <p class="th-15px font-times">Item <u class="th-15px font-times">{{
                                    waste.soldAtPrivateSaleCount || 0 }}</u> Sold at private
                                    sale</p>
                                <p class="th-15px font-times">Item <u class="th-15px font-times">{{
                                    waste.soldAtPublicAuctionCount || 0 }}</u> Sold at public auction</p>
                                <p class="th-15px font-times">Item <u class="th-15px font-times">{{
                                    waste.transferredWithoutCostCount || 0 }}</u> Transferred without cost to
                                    <u class="th-15px font-times">{{ waste.transferredTo || 'N/A' }}</u>
                                </p>
                            </div>
                        </th>
                    </tr>


                </thead>

            </table>

            <table border="2" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th colspan="3" style="text-align: start; width: 50%; padding: 13px;"
                            class="font-weight-regular th-15px">
                            Certified Correct:
                        </th>
                        <th colspan="3" style="text-align: start; width: 50%; padding: 13px;"
                            class="font-weight-regular th-15px">
                            Certified Correct:
                        </th>
                    </tr>
                </thead>
                <tbody class="text-capitalize th-15px"
                    style="font-family: 'Times New Roman', Times, serif; font-size: 11px;">
                    <tr>
                        <td colspan="3" style="border-top: hidden; text-align: center; padding: 10px;">
                            <div class="th-15px font-times" style="margin-bottom: 2px;">{{ waste.certifiedByName }}
                            </div>
                            <span class="th-15px font-times"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Signature over Printed Name of Inspection Officer
                            </span>
                        </td>
                        <td colspan="3" style="border-top: hidden; text-align: center; padding: 10px;">
                            <div class="th-15px font-times" style="margin-bottom: 2px;">{{ waste.witnessedByName }}
                            </div>
                            <span class="th-15px font-times"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Signature over Printed Name of Witness
                            </span>
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

const { getWasteById, waste } = useWaste();

const route = useRoute();
const id = computed(() => (useRoute().params.id as string) || "");

const _getWasteById = async () => {

    try {
        const result = await getWasteById(id.value);
        waste.value = {
            ...waste.value,
            ...result,
        };
    } catch (error) {
        console.error("Error fetching transfer details:", error);
    }
};

_getWasteById();
</script>

<style scoped>
.a4-landscape {
    width: 210mm !important;
    /* A4 Portrait Width */
    height: 297mm !important;
    /* A4 Portrait Height */
    max-height: 297mm !important;
    /* Prevents overflow */
    overflow: hidden !important;
    /* Prevents content from spilling */
    display: block !important;
    /* Prevent flexbox stretching */
    page-break-after: avoid;
    /* Prevents blank pages */
}

table {
    width: 100%;
    border-collapse: collapse;
    max-height: 297mm !important;
    /* Prevents table from overflowing */
    overflow: hidden;
}

tr,
td,
th {
    padding: 2px !important;
    /* Reduce padding */
    font-size: 11px !important;
    /* Make text slightly smaller */
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
    padding: 35px 10px;
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
    font-size: 14px !important;
    font-weight: 400;
    font-family: "Times New Roman", Times, serif;
}

.light-theme {
    background-color: white;
    color: black;
}
</style>