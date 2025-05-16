<template>
    <v-row no-gutters justify="center">
        <v-col no-gutters class="fill-height px-10 custom-font a4-landscape light-theme" justify="center"
            align-content="center">
            <div v-if="isICS" class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px"
                style=" font-style: italic;">
                Appendix 59
            </div>
            <div v-if="isPAR" class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px"
                style=" font-style: italic;">
                Appendix 71
            </div>

            <div class="text-center font-weight-bold text-capitalize mb-8 font-times"
                style="font-size: 16pt !important">
                {{ issuePageTitle }}
            </div>

            <v-row dense class="mb-1 " align="start" justify="start">
                <v-col cols="6" class="text-left">
                    <div class="font-times">
                        Entity Name: <u class="th-12px font-times font-weight-regular">{{ issueSlip.entityName }}</u>
                    </div>
                </v-col>
                <v-col cols="6" class="text-left">
                    <div class="font-times">

                    </div>
                </v-col>

                <v-col cols="6" class="text-left">
                    <div class="font-times">
                        Fund Cluster: <u class="th-12px font-times font-weight-regular">{{ issueSlip.fundCluster }}</u>
                    </div>
                </v-col>

                <v-col cols="6" class="text-left">
                    <div class="font-times">
                        {{ issueTypeNo }}: <u class="th-12px font-times font-weight-regular">{{ issueSlip.issueSlipNo
                            }}</u>
                    </div>
                </v-col>
            </v-row>

            <table v-if="isPAR">
                <thead class="custom-header-height font-times">
                    <tr>
                        <th class="text-center">Quantity</th>
                        <th class="text-center">Unit</th>
                        <th class="text-center">Description</th>
                        <th class="text-center">Property Number</th>
                        <th class="text-center">Date Acquired</th>
                        <th class="text-center">Amount</th>
                    </tr>
                </thead>
                <tbody>

                    <tr>
                        <td class="custom-height th-12px" style="width: 10%;">{{ issueSlip.quantity }}</td>
                        <td class="custom-height th-12px" style="width: 15%;">{{ issueSlip.unitOfMeasurement }}</td>
                        <td class="custom-height th-12px" style="width: 25%;">{{ issueSlip.description }}</td>
                        <td class="custom-height th-12px" style="width: 10%;">{{ issueSlip.stockNumber }}</td>
                        <td class="custom-height th-12px">
                            {{
                                issueSlip.createdAt
                                    ? new Date(issueSlip.createdAt).toDateString().slice(4)
                                    : ""
                            }}
                        </td>

                        <td class="th-9px">
                            ₱&nbsp;{{ formatNumber((issueSlip.quantity * issueSlip.cost)) }}
                        </td>
                    </tr>




                    <tr v-for="n in 15" :key="'placeholder-' + n">
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                    </tr>
                </tbody>
            </table>
            <table v-if="isICS" class="table table-bordered">
                <thead>
                    <tr>
                        <th rowspan="3" class="text-center th-9px text-capitalize">Quantity</th>
                        <th rowspan="3" class="text-center th-9px text-capitalize">Unit</th>
                        <th colspan="2" class="text-center th-9px text-capitalize">Amount</th>
                        <th rowspan="3" class="text-center th-9px text-capitalize">Description</th>
                        <th rowspan="3" class="text-center th-9px text-capitalize">Inventory Item No</th>
                        <th rowspan="3" class="text-center th-8px custom-table-header">Estimated Useful Life</th>
                    </tr>
                    <tr>
                        <th class="text-center th-9px font-weight-regular">Unit Cost</th>
                        <th class="text-center th-9px font-weight-regular">Total Cost</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td class="th-9px">{{ issueSlip.quantity }}</td>
                        <td class="th-9px">{{ issueSlip.unitOfMeasurement }}</td>
                        <td class="th-9px">₱&nbsp;{{ formatNumber(issueSlip.cost) }}</td>
                        <td class="th-9px">
                            ₱&nbsp;{{ formatNumber((issueSlip.quantity * issueSlip.cost)) }}
                        </td>

                        <td class="th-9px">{{ issueSlip.description }}</td>
                        <td class="th-9px">{{ issueSlip.itemNo }}</td>
                        <td class="th-9px">{{ issueSlip.estimatedUsefulLife }}</td>
                    </tr>

                    <tr v-for="n in 15" :key="'placeholder-' + n">
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                        <td class="custom-height th-12px">&nbsp;</td>
                    </tr>
                </tbody>
            </table>
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th colspan="3" style="text-align: start; width: 50%;">Received By:</th>
                        <th colspan="3" style="text-align: start; width: 50%;">Issued By:</th>
                    </tr>
                </thead>
                <tbody class="text-capitalize th-11px">
                    <tr>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div class="font-times font-weight-regular th-12px" style="margin-bottom: 8px;"> {{
                                issueSlip.receivedByName }}</div>
                            <span class="font-times font-weight-regular th-12px"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Signature Over Printed Name
                            </span>
                        </td>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div class="font-times font-weight-regular th-12px" style="margin-bottom: 8px;"> {{
                                issueSlip.issuedByName }}</div>
                            <span class="font-times font-weight-regular th-12px"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Signature Over Printed Name
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div class="font-times font-weight-regular th-12px" style="margin-bottom: 8px;">{{
                                issueSlip.receivedByDesignation }}</div>
                            <span class="font-times font-weight-regular th-12px"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Position/Office
                            </span>
                        </td>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div class="font-times font-weight-regular th-12px" style="margin-bottom: 8px;">{{
                                issueSlip.issuedByDesignation }}</div>
                            <span class="font-times font-weight-regular th-12px"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Position/Office
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div class="font-times font-weight-regular th-12px" style="margin-bottom: 8px;"> {{
                                issueSlip.receivedAt
                                    ? new Date(issueSlip.receivedAt).toDateString().slice(4)
                                    : ""
                            }}</div>
                            <span class="font-times font-weight-regular th-12px"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Date
                            </span>
                        </td>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div class="font-times font-weight-regular th-12px" style="margin-bottom: 8px;"> {{
                                issueSlip.receivedAt
                                    ? new Date(issueSlip.receivedAt).toDateString().slice(4)
                                    : ""
                            }}</div>
                            <span class="font-times font-weight-regular th-12px"
                                style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Date
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

const route = useRoute();
const id = (route.params.card as string) || "";
const { formatNumber } = useUtils()
const { issuePageTitle, issueTypeNo, issueSlip, issueSlips, getIssueSlipsById, isPAR, isICS } = useIssueSlips();

const _getIssueSlipsById = async () => {
    if (!id) {
        console.error("No ID provided in route params.");
        return;
    }

    try {
        const result = await getIssueSlipsById(id);

        issueSlip.value = result || {};

        issueSlips.value = Array.isArray(result)
            ? result.map((i) => ({
                ...i,
                totalCost: i.cost && i.quantity ? i.cost * i.quantity : 0,
            }))
            : [
                {
                    ...result,
                    totalCost:
                        result.cost && result.quantity
                            ? result.cost * result.quantity
                            : 0,
                    createdAt: result.createdAt
                        ? new Date(result.createdAt).toDateString().slice(4)
                        : "N/A",
                },
            ];
    } catch (error) {
        console.error("Error fetching issue slip:", error);
    }
};

_getIssueSlipsById();
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
    padding: 5px;
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
