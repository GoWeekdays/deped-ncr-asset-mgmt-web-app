<template>
  <v-row class="py-5" fill-height justify="center" align="center">
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-card class="pa-6">
        <!-- Header with Title and Buttons -->
        <v-row class="py-2" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4
              class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
            >
            WASTE MATERIALS REPORT
            </h4>
          </v-col>
          <v-col cols="auto" align="center" justify="end" class="mb-5">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-icon size="large" v-bind="props">mdi-dots-horizontal</v-icon>
              </template>
              <v-list class="text-primary-text">
                <v-list-item>
                  <v-list-item-title @click="">
                    <v-icon size="small" class="me-2"
                      >mdi-eye-circle-outline</v-icon
                    >
                    <span class="text-subtitle-2">Preview</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="">
                    <v-icon size="small" class="me-2"
                      >mdi-download-outline</v-icon
                    >
                    <span class="text-subtitle-2">Download</span>
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title @click="">
                    <v-icon size="small" class="me-2"
                      >mdi-printer-outline</v-icon
                    >
                    <span class="text-subtitle-2">Print</span>
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row class="py-4">
          <v-col cols="12">
            <v-row>
              <v-col cols="6">
                <label class="text-fontgray text-body-2 font-weight-regular">
                  Entity Name
                </label>
                <div class="text-h6 font-weight-medium text-primary-text">
                  DEPED NCR
                </div>
              </v-col>
              <v-col cols="6">
                <label class="text-fontgray text-body-2 font-weight-regular">
                  Fund Cluster
                </label>
                <div class="text-h6 font-weight-medium text-primary-text">
                  GF-01
                </div>
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="6">
                <label class="text-fontgray text-body-2 font-weight-regular">
                  Place of Storage
                </label>
                <div class="text-h6 font-weight-medium text-primary-text">
                  -
                </div>
              </v-col>
              <v-col cols="6">
                <label class="text-fontgray text-body-2 font-weight-regular">
                  Date
                </label>
                <div class="text-h6 font-weight-medium text-primary-text">
                  -
                </div>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12">
                <h2 class="mb-4 text-primary text-h5 font-weight-regular">
                  ITEMS FOR DISPOSAL
                </h2>
                <v-table
                  class="mt-4 text-primary-text"
                  max-height="300px"
                  density="compact"
                  elevation="0"
                  hover
                  fixed-header
                >
                  <thead class="text-table-header-color">
                    <tr class="font-weight-medium">
                      <th
                        v-for="header in headers"
                        :key="header.key"
                        :style="header.style"
                      >
                        {{ header.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-body-2 font-weight-regular">
                    <tr v-for="(item, index) in waste.items" :key="index">
                      <td>{{ item.item }}</td>
                      <td>{{ item.propertyNumber }}</td>
                      <td>{{ item.propertyName }}</td>
                      <td>{{ item.type }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.unit }}</td>
                      <td>{{ item.description }}</td>
                      <td>{{ item.no }}</td>
                      <td>{{ item.recordOfSalesOfficialReceiptDate }}</td>
                      <td>{{ item.amount }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row class="py-5 text-primary-text">
          <v-col cols="6">
            <div class="text-primary">Certified Correct</div>

            <div>Tanya Hill</div>
            <div class="text-caption">
              Name of Supply and/or Property Custodian
            </div>
          </v-col>
          <v-col cols="6">
            <div class="text-primary">Disposal Approved</div>

            <div>Jane Doe</div>
            <div class="text-caption">Name of Head of Entity/Agency</div>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-row class="mb-2 pt-3" density="compact">
          <v-col cols="12">
            <h2 class="text-primary text-subtitle-1">
              Certificate of Inspection
            </h2>
            <p class="text-primary-text text-body-2">
              I hereby certify that the property enumerated above was disposed
              of as follows:
            </p>
          </v-col>

          <v-row class="text-body-2">
            <v-col cols="6">
              <!-- First Item Row -->
              <v-row
                no-gutters
                justify="center"
                align="center"
                class="text-start pl-2"
              >
                <v-col>
                  <label class="text-primary-text">Item Destroyed</label>
                </v-col>
                <v-col>
                  <span class="text-decoration-underline">1</span>
                </v-col>
              </v-row>

              <!-- Second Item Row -->
              <v-row
                no-gutters
                justify="center"
                align="center"
                class="text-start pl-2"
              >
                <v-col>
                  <label class="text-primary-text"
                    >Item Sold at private sale</label
                  >
                </v-col>
                <v-col>
                  <span class="text-decoration-underline">1</span>
                </v-col>
              </v-row>

              <v-row
                no-gutters
                justify="center"
                align="center"
                class="text-start pl-2"
              >
                <v-col>
                  <label class="text-primary-text"
                    >Item Sold at public auction</label
                  >
                </v-col>
                <v-col>
                  <span class="text-decoration-underline">1</span>
                </v-col>
              </v-row>

              <!-- Fourth Item Row -->
              <v-row
                no-gutters
                justify="center"
                align="center"
                class="text-start pl-2"
              >
                <v-col>
                  <label class="text-primary-text"
                    >Item Transferred without cost to (Name of
                    Agency/Entity)</label
                  >
                </v-col>
                <v-col>
                  <span class="text-decoration-underline">1</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-row>

        <v-divider></v-divider>

        <v-row class="mb-2 pt-3" density="compact">
          <v-col cols="12">
            <v-row dense>
              <v-col cols="6">
                <label class="mb-1 text-primary">Certified Correct</label>
              </v-col>
              <v-col cols="6">
                <label class="mb-1 text-primary">Witness to Disposal</label>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-row dense>
              <v-col cols="6">
                <div class="text-primary-text text-body-2 font-weight-medium">
                  Tanya Hill
                </div>
                <label
                  class="mb-1 text-caption text-fontgray font-weight-regular"
                  >Name of Inspection Officer</label
                >
              </v-col>
              <v-col cols="6">
                <div class="text-primary-text text-body-2 font-weight-medium">
                  Tanya Hill
                </div>
                <label
                  class="mb-1 text-caption text-fontgray font-weight-regular"
                  >Name of Head of Agency/Entity or his/her Authorized
                  Representative</label
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const waste = useState(
  "Waste",
  (): TWaste => ({
    _id: "",
    entityName: "",
    fundCluster: "",
    placeOfStorage: "",
    createdAt: "",
    certifiedCorrectName: "",
    disposalApprovedName: "",
    witnessToDisposalName: "",

    items: [
      {
        item: "",
        propertyNumber: "",
        propertyName: "",
        type: "",
        quantity: 0,
        unit: "",
        description: "",
        no: "",
        recordOfSalesOfficialReceiptDate: "",
        amount: 0,
      },
    ],
  })
);

const headers = ref([
  {
    title: "Item",
    key: "item",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "Property No.",
    key: "propertyNumber",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "Property Name",
    key: "propertyName",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "Type",
    key: "type",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "Quantity",
    key: "quantity",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "Unit",
    key: "unit",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "Description",
    key: "description",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "No.",
    key: "no",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: " Record Of Sales Official Receipt Date",
    key: "recordOfSalesOfficialReceiptDate",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
  {
    title: "Amount",
    key: "amount",
    style: { backgroundColor: "#e1e1f0", color: "text-table-header-color" },
  },
]);

const selectedTransferType = ref(null);
</script>

<style scoped>
.table-header {
  background-color: #f5f5f5;
}
</style>
