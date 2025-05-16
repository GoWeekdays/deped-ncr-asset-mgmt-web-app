<template>
    <v-row no-gutters justify="center">
        <v-col no-gutters class="fill-height px-10 custom-font a4-landscape" justify="center" align-content="center">
            <div v-if="isInventory" class="text-end font-weight-regular text-capitalize mb-2 font-times"
                style="font-size: 14pt !important; font-style: italic;">
                Annex A.5
            </div>

            <div v-else class="text-end font-weight-regular text-capitalize mb-2 font-times"
                style="font-size: 14pt !important; font-style: italic;">
                Appendix 76
            </div>


            <div class="text-center font-weight-bold text-capitalize mb-10 font-times text-uppercase"
                style="font-size: 14pt !important">
                {{ transferPrintTitle }}
            </div>

            <v-row class="mb-1" align="start" justify="start">
                <v-col cols="6" class="text-left">
                    <div class="font-times" style="font-size: 11pt !important; font-weight: bold">
                        Entity Name: <u class="th-11px font-times">{{ transferProperty.entityName }}</u>
                    </div>
                </v-col>

                <v-col cols="6" class="text-left">
                    <div class="font-times" style="font-size: 11pt !important; font-weight: bold">
                        Fund Cluster: <u class="th-11px font-times">{{ transferProperty.fundCluster }}</u>
                    </div>
                </v-col>
            </v-row>

            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>

                        <th style="width: 70%; text-align: left; padding-left: 10px;">
                            <p class="th-11px font-times">From Accountable Officer/Agency/Fund Cluster: {{
                                transferProperty.from }}</p>
                            <p class="th-11px font-times">To Accountable Officer/Agency/Fund Cluster: {{
                                transferProperty.to }}</p>
                        </th>


                        <th style="width: 30%; text-align: left; padding-left: 10px;">
                            <p v-if="isInventory" class="th-11px font-times">ITR No. {{ transferProperty.transferNo }}:
                            </p>
                            <p v-else class="th-11px font-times">PTR No. {{ transferProperty.transferNo }}:
                            </p>
                            <p class="th-11px font-times">Date: {{
                                transferProperty.createdAt
                                    ? new Date(transferProperty.createdAt).toDateString().slice(4)
                                    : ""
                            }}</p>
                        </th>
                    </tr>
                </thead>

            </table>
            <table style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <td class="th-11px font-times" style="text-align: left; border: none; padding-left: 20px;">
                            Transfer Type: (check only one)
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left; border: none; padding-left: 200px;">
                            <label class="th-11px font-times">
                                <input type="checkbox" name="transferType" value="donation"
                                    :checked="transferProperty.transferType === 'donation'" disabled
                                    style="filter: grayscale(0) opacity(1);" /> Donation
                            </label>
                            <label class="th-11px font-times" style="margin-left: 20px;">
                                <input type="checkbox" name="transferType" value="relocate"
                                    :checked="transferProperty.transferType === 'relocate'" disabled
                                    style="filter: grayscale(0) opacity(1);" /> Relocate
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: left; border: none; padding-left: 200px;">
                            <label class="th-11px font-times">
                                <input type="checkbox" name="transferType" value="reassignment"
                                    :checked="transferProperty.transferType === 'reassignment'" disabled
                                    style="filter: grayscale(0) opacity(1);" /> Reassignment
                            </label>
                            <label class="th-11px font-times" style="margin-left: 20px;">

                                <input type="checkbox" name="transferType" value="others"
                                    :checked="!['donation', 'relocate', 'reassignment'].includes(transferProperty.transferType)"
                                    disabled style="filter: grayscale(0) opacity(1);" /> Others (Specify)


                                <u class="th-11px font-times mb-3"
                                    v-if="!['donation', 'relocate', 'reassignment'].includes(transferProperty.transferType)"
                                    style="  padding-left: 5px;">
                                    {{ transferProperty.transferType }}
                                </u>
                            </label>
                        </td>
                    </tr>
                </thead>

            </table>

            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr v-if="isInventory" class="font-weight-bold th-11px">
                        <th rowspan="1" class="text-center">Date Acquired</th>
                        <th rowspan="1" class="text-center">Item No</th>
                        <th colspan="1" class="text-center">ICS No.</th>
                        <th rowspan="1" class="text-center">Description</th>
                        <th rowspan="1" class="text-center">Amount</th>
                        <th rowspan="1" class="text-center custom-table-header" style="width: 10%;">Condition of
                            Inventory</th>
                    </tr>
                    <tr v-else class="font-weight-bold th-11px">
                        <th rowspan="1" class="text-center">Date Acquired</th>
                        <th rowspan="1" class="text-center">Property No</th>
                        <th rowspan="1" class="text-center">Description</th>
                        <th rowspan="1" class="text-center">Amount</th>
                        <th rowspan="1" class="text-center custom-table-header" style="width: 10%;">Condition of
                            PPE</th>
                    </tr>
                </thead>

                <tbody v-if="isInventory">

                    <tr v-for="(item, index) in transferProperty.itemStocks" :key="index" class="text-capitalize">
                        <td class="th-12px">{{ item.createdAt }}</td>
                        <td class="th-12px">{{ item.itemNo }}</td>
                        <td class="th-12px">{{ item.reference }}</td>
                        <td class="th-12px">{{ item.description }}</td>
                        <td class="th-12px">₱&nbsp;{{ formatNumber(item.cost) }}</td>
                        <td class="th-12px">{{ item.condition }}</td>
                    </tr>

                    <tr v-for="n in 15" :key="'placeholder-' + n">
                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                    </tr>
                </tbody>

                <tbody v-else>

                    <tr v-for="(item, index) in transferProperty.itemStocks" :key="index" class="text-capitalize">
                        <td class="th-12px">{{ item.createdAt }}</td>
                        <td class="th-12px">{{ item.stockNumber }}</td>

                        <td class="th-12px">{{ item.description }}</td>
                        <td class="th-12px">₱&nbsp;{{ formatNumber(item.cost) }}</td>
                        <td class="th-12px">{{ item.condition }}</td>
                    </tr>

                    <tr v-for="n in 15" :key="'placeholder-' + n">
                        <td class="th-12px">&nbsp;</td>

                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                        <td class="th-12px">&nbsp;</td>
                    </tr>
                </tbody>
            </table>
            <table style="border-collapse: collapse; width: 100%; border: none;">
                <thead>
                    <tr class="th-11px">
                        <th style="width: 100%; text-align: left; border: none;">
                            <p class="th-11px font-times th-reason-transfer"
                                style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal; max-width: 100%;">
                                <span class="font-weight-bold th-11px font-times">Reason for Transfer:</span>
                                {{ transferProperty.transferReason }}
                            </p>
                        </th>
                    </tr>
                </thead>
            </table>


            <table style="width: 100%; border: 1px solid black; border-collapse: collapse; ">
                <thead>
                    <tr class="th-11px">
                        <th style="text-align: center; width: 25%; border: none;"></th>
                        <th style="text-align: center; width: 25%; border: none;">Approved by:</th>
                        <th style="text-align: center; width: 25%; border: none;">Release/Issued by:</th>
                        <th style="text-align: center; width: 25%; border: none;">Received by:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="text-11px font-times font-weight-bold"
                            style="text-align: left; vertical-align: top; border: none; padding-left: 5px;">Signature:
                        </td>
                        <td style="border: none;"></td>
                        <td style="border: none;"></td>
                        <td style="border: none;"></td>
                    </tr>
                    <tr>
                        <td class="text-11px font-times font-weight-bold"
                            style="text-align: left; vertical-align: top; border: none; padding-left: 5px;">Printed
                            Name:</td>
                        <td class="th-12px" style="border: none;">{{ transferProperty.approvedByName }}</td>
                        <td class="th-12px" style="border: none;">{{ transferProperty.issuedByName }}</td>
                        <td class="th-12px" style="border: none;">{{ transferProperty.receivedByName }}</td>
                    </tr>
                    <tr class="text-capitalize">
                        <td class="text-11px font-times font-weight-bold"
                            style="text-align: left; vertical-align: top; border: none; padding-left: 5px;">Designation:
                        </td>
                        <td class="th-12px" style="border: none;">{{ transferProperty.approvedByDesignation }}</td>
                        <td class="th-12px" style="border: none;">{{ transferProperty.issuedByDesignation }}</td>
                        <td class="th-12px" style="border: none;">{{ transferProperty.receivedByDesignation }}</td>
                    </tr>
                    <tr>
                        <td class="text-11px font-times font-weight-bold"
                            style="text-align: left; vertical-align: top; border: none; padding-left: 5px;">Date:</td>
                        <td class="th-12px" style="border: none;">
                            {{ transferProperty.approvedAt ? new
                                Date(transferProperty.approvedAt).toDateString().slice(4) : ""
                            }}
                        </td>
                        <td class="th-12px" style="border: none;">
                            {{ transferProperty.completedAt ? new
                                Date(transferProperty.completedAt).toDateString().slice(4) : ""
                            }}
                        </td>
                        <td class="th-12px" style="border: none;">
                            {{ transferProperty.approvedAt ? new
                                Date(transferProperty.approvedAt).toDateString().slice(4) : ""
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

const { formatNumber } = useUtils()

const { getTransferById, transferProperty, isInventory, isProperty, transferPrintTitle } = useTransfer();

const route = useRoute();
const id = computed(() => (useRoute().params.id as string) || "");

const _getTransferById = async () => {


    try {
        const result = await getTransferById(id.value);
        transferProperty.value = {
            ...transferProperty.value,
            ...result,
            itemStocks:
                result.itemStocks?.map((item) => ({
                    ...item,
                    createdAt: item.createdAt
                        ? new Date(item.createdAt).toDateString().slice(4)
                        : "N/A",
                })) || [],
        };
    } catch (error) {
        console.error("Error fetching transfer details:", error);
        transferProperty.value.itemStocks = [];
    }
};

_getTransferById();
</script>

<style scoped>
.a4-landscape {
    height: 275mm !important;
    width: 200mm !important;
    /* border: 1px solid black; */
}

.th-14px {
    font-size: 14px !important;
    font-weight: bold !important;
    font-style: italic;
}

.th-12px {
    font-size: 16px !important;
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

.th-11px {
    font-size: 15px !important;
    font-weight: 400;
    font-family: "Times New Roman", Times, serif;
}
</style>