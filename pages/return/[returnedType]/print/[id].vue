<template>
    <v-row no-gutters justify="center">
        <v-col no-gutters class="fill-height px-10 custom-font a4-landscape light-theme" justify="center"
            align-content="center">
            <div class="text-end font-weight-regular text-capitalize mb-2 font-times th-15px"
                style=" font-style: italic;">
                Annex A.6

            </div>
            <div class="text-center font-weight-bold text-capitalize mb-10 font-times text-uppercase"
                style="font-size: 14pt !important">
                {{ returnPrintTitle }}
            </div>

            <v-row dense class="mb-3" align="start" justify="start">
                <v-col cols="8" class="text-left">
                    <div class="font-times">
                        Entity Name: <span class="th-12px font-times font-weight-regular">{{ returned.entityName
                            }}</span>
                    </div>
                </v-col>
                <v-col cols="4" class="text-left" style="border: 1px solid black; padding: 8px;">
                    <div class="font-times">
                        Date: <span class="th-12px font-times font-weight-regular">{{ returned.createdAt ? new
                            Date(returned.createdAt).toDateString().slice(4) : "" }}</span>
                    </div>
                    <div v-if="isReturnSEP" class="font-times">
                        RSSEP No: <span class="th-12px font-times font-weight-regular">{{ returned.returnNo }}</span>
                    </div>
                    <div v-else class="font-times">
                        RSPPE No: <span class="th-12px font-times font-weight-regular">{{ returned.returnNo }}</span>
                    </div>
                </v-col>
            </v-row>

            <table v-if="isReturnSEP">
                <thead class="custom-header-height font-times">
                    <tr>
                        <th class="text-center text-capitalize" style="width: 25%;">Item Description</th>
                        <th class="text-center text-capitalize" style="width: 10%;">Qty</th>
                        <th class="text-center text-capitalize" style="width: 15%;">Unit</th>
                        <th class="text-center text-capitalize" style="width: 20%;">Ics No.</th>
                        <th class="text-center text-capitalize" style="width: 15%;">End User</th>
                        <th class="text-center text-capitalize" style="width: 15%;">Remarks</th>
                    </tr>

                </thead>
                <tbody>
                    <tr v-for="(item, index) in [
                        ...(returned.itemStocks?.filter(item => Object.values(item).some(val => val)) || []),
                        ...Array(Math.max(0, 12 - (returned.itemStocks?.filter(item => Object.values(item).some(val => val))?.length || 0))).fill({})
                    ]" :key="index" style="border: none;" class="text-capitalize">

                        <td class="custom-height th-12px">{{ item.description || '' }}</td>
                        <td class="custom-height th-12px">{{ item.description ? 1 : '' }}</td>

                        <td class="custom-height th-12px">{{ item.unitOfMeasurement || '' }}</td>
                        <td class="custom-height th-12px">{{ item.reference || '' }}</td>
                        <td class="custom-height th-12px">{{ item.endUser || '' }}</td>
                        <td class="custom-height th-12px">{{ item.stockRemarks || '' }}</td>

                    </tr>
                </tbody>
            </table>
            <table v-if="isReturnPPE">
                <thead class="custom-header-height font-times">
                    <tr>
                        <th class="text-center text-capitalize" style="width: 25%;">Item Description</th>
                        <th class="text-center text-capitalize" style="width: 10%;">Qty</th>
                        <th class="text-center text-capitalize" style="width: 20%;">Par. No.</th>
                        <th class="text-center text-capitalize" style="width: 15%;">End User</th>
                        <th class="text-center text-capitalize" style="width: 15%;">Remarks</th>
                    </tr>

                </thead>
                <tbody>
                    <tr v-for="(item, index) in [
                        ...(returned.itemStocks?.filter(item => Object.values(item).some(val => val)) || []),
                        ...Array(Math.max(0, 12 - (returned.itemStocks?.filter(item => Object.values(item).some(val => val))?.length || 0))).fill({})
                    ]" :key="index" style="border: none;" class="text-capitalize">

                        <td class="custom-height th-12px">{{ item.description || '' }}</td>
                        <td class="custom-height th-12px">{{ item.description ? 1 : '' }}</td>
                        <td class="custom-height th-12px">{{ item.reference || '' }}</td>
                        <td class="custom-height th-12px">{{ item.endUser || '' }}</td>
                        <td class="custom-height th-12px">{{ item.stockRemarks || '' }}</td>

                    </tr>
                </tbody>

            </table>
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <thead>
                    <tr>
                        <th colspan="3" style="text-align: start; width: 50%;">Returned by:</th>
                        <th colspan="3" style="text-align: start; width: 50%;">Received by:</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div style="margin-bottom: 8px;">{{ returned.returnedByName }}</div>
                            <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                End User
                            </span>
                        </td>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div style="margin-bottom: 8px;">{{ returned.receivedByName }}</div>
                            <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Head, Property and Supply Unit
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div style="margin-bottom: 8px;">{{
                                returned.completedAt
                                    ? new Date(returned.completedAt).toDateString().slice(4)
                                    : ""
                            }}</div>
                            <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
                                Date
                            </span>
                        </td>
                        <td colspan="3" style="border-top: hidden; text-align: center;">
                            <div style="margin-bottom: 8px;">{{
                                returned.completedAt
                                    ? new Date(returned.completedAt).toDateString().slice(4)
                                    : ""
                            }}</div>
                            <span style="border-top: 1px solid; display: inline-block; padding: 5px 0; width: 70%;">
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
const id = computed(() => (useRoute().params.id as string) || "");

const {
    returned,
    getReturnById,
    returnPrintTitle,
    isReturnPPE,
    isReturnSEP,

} = useReturn();

const _getReturnById = async () => {
    try {
        const result = await getReturnById(id.value);

        const formattedItemStocks = result.itemStocks.map((item: any) => ({
            stockId: item.stockId || "",
            description: item.description || "",
            unitOfMeasurement: item.unitOfMeasurement || "",
            quantity: item.quantity || "",
            reference: item.reference || "",
            endUser: item.endUser || "",
            remarks: item.remarks || "",
            stockRemarks: item.stockRemarks || "",
        }));

        returned.value = {
            ...returned.value,
            ...result,
            itemStocks: formattedItemStocks,
        };
    } catch (error) {
        console.error("Error fetching return details:", error);
    }
};

_getReturnById();
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
    height: 50px;
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
