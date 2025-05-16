<template>
  <v-row class="py-5" fill-height justify="center" align="center">
    <v-col cols="12" sm="10" md="12" lg="11">
      <v-card class="py-4 px-8">
        <!-- Title and Buttons -->
        <v-row class="py-3" align="center" justify="space-between">
          <v-col cols="auto">
            <h4 class="text-h4 font-weight-regular text-primary text-uppercase">
              WASTE MATERIALS REPORT
            </h4>
          </v-col>
          <v-col cols="auto" class="d-flex align-center justify-end">
            <v-btn color="primary" @click="openDialog" class="me-3"
              >Submit</v-btn
            >
            <v-btn color="fontgray" variant="outlined" @click="goBack"
              >Cancel</v-btn
            >
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Form -->
        <v-row class="mt-3" justify="center" align="start">
          <v-col cols="12">
            <v-form>
              <!-- Entity and Fund Cluster -->
              <v-row dense class="mb-3">
                <v-col cols="6">
                  <label
                    class="mb-2 text-subtitle-2 text-primary-text font-weight-medium"
                  >
                    Entity Name
                  </label>
                  <v-text-field
                    v-model="waste.entityName"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label
                    class="mb-2 text-subtitle-2 text-primary-text font-weight-medium"
                  >
                    Fund Cluster
                  </label>
                  <v-text-field
                    v-model="waste.fundCluster"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- Place of Storage and Date -->
              <v-row dense>
                <v-col cols="6">
                  <label
                    class="mb-2 text-subtitle-2 text-primary-text font-weight-medium"
                  >
                    Place of Storage
                  </label>
                  <v-text-field
                    v-model="waste.placeOfStorage"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label
                    class="mb-2 text-subtitle-2 text-primary-text font-weight-medium"
                    >Date</label
                  >
                  <v-text-field
                    v-model="waste.createdAt"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
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

              <v-divider></v-divider>

              <v-row dense class="mt-5">
                <v-col cols="6">
                  <span class="text-primary">Certified Correct</span>
                  <label
                    class="mb-2 text-subtitle-2 text-primary-text font-weight-medium"
                  >
                    Name of Supply and/or Property Custodian
                  </label>
                  <v-text-field
                    v-model="waste.certifiedCorrectName"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <span class="text-primary">Disposal Approved</span>
                  <label
                    class="mb-2 text-subtitle-2 text-primary-text font-weight-medium"
                  >
                    Name of Head of Agency/Entity or his/her Authorized
                    Representative
                  </label>
                  <v-text-field
                    v-model="waste.disposalApprovedName"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-divider></v-divider>
              <v-row class="mb-2 pt-3" density="compact">
                <v-col cols="12">
                  <h2 class="text-primary text-subtitle-1">
                    Certificate of Inspection
                  </h2>
                  <p class="text-primary-text text-body-2">
                    I hereby certify that the property enumerated above was
                    disposed of as follows:
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
                        <v-text-field
                          density="compact"
                          variant="outlined"
                        ></v-text-field>
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
                        <v-text-field
                          density="compact"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <!-- Third Item Row -->
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
                        <v-text-field
                          density="compact"
                          variant="outlined"
                        ></v-text-field>
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
                        <v-text-field
                          density="compact"
                          variant="outlined"
                        ></v-text-field>
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
                      <label class="mb-1 text-primary"
                        >Witness to Disposal</label
                      >
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="12">
                  <v-row dense>
                    <v-col cols="6">
                      <label
                        class="mb-1 text-subtitle-2 text-primary-text font-weight-medium"
                        >Name of Inspection Officer</label
                      >
                      <v-text-field
                        v-model="waste.certifiedCorrectName"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <label
                        class="mb-1 text-subtitle-2 text-primary-text font-weight-medium"
                        >Name of Head of Agency/Entity or his/her Authorized
                        Representative</label
                      >
                      <v-text-field
                        v-model="waste.witnessToDisposalName"
                        variant="outlined"
                        density="compact"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-col>

    <!-- Confirmation Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="pa-8 rounded-lg text-center" elevation="2">
        <v-card-title class="text-h4 text-primary-text"
          >Confirm Report?</v-card-title
        >
        <v-card-subtitle
          class="text-subtitle-2 text-primary-text"
          style="white-space: normal; overflow: visible; text-overflow: initial"
        >
          Do you want to proceed with the report? Ensure all details are correct
          before confirming.
        </v-card-subtitle>

        <v-row justify="center" align="center" class="pt-10">
          <v-col cols="6">
            <v-btn color="primary" class="py-6" @click="confirmSubmit" block
              >Confirm</v-btn
            >
          </v-col>
          <v-col cols="6">
            <v-btn
              color="fontgray"
              class="py-6"
              variant="outlined"
              @click="closeDialog"
              block
              >Cancel</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
const { goBack } = useUtils();

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

const dialog = ref(false);

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

const closeDialog = () => {
  dialog.value = false;
};

const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    Active: "green",
    Inactive: "red",
    Pending: "orange",
  };
  return statusColors[status] || "gray";
};

const openDialog = () => {
  dialog.value = true;
};

const confirmSubmit = () => {
  dialog.value = false;
  // Logic for confirming submission
};
</script>

<style scoped>
.text-table-header-color {
  background-color: #f5f5f5;
}
</style>
