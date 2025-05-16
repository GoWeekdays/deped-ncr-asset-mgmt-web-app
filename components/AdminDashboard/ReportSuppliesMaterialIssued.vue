<template>
  <v-row class="mb-5" fill-height justify="center" align="start">
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-card class="pa-6">
        <!-- Report Title with Icon on the Right -->
        <v-row class="py-4">
          <v-col cols="10" class="text-start text-primary-text">
            <h4 class="font-bold">REPORT OF SUPPLIES AND MATERIALS ISSUED</h4>
          </v-col>
          <v-col cols="2" class="text-end">
            <v-menu>
              <template v-slot:activator="{ props }"
                ><v-icon icon size="medium" v-bind="props"
                  >mdi-dots-horizontal</v-icon
                >
              </template>
              <v-list></v-list
            ></v-menu>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Entity Details -->
        <v-row class="py-4">
          <v-col cols="6">
            <strong>Entity Name</strong>
            <div>DEPED NCR</div>
          </v-col>
          <v-col cols="6">
            <strong>Fund Cluster</strong>
            <div>GF-01</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <strong>Serial No.</strong>
            <div>-</div>
          </v-col>
          <v-col cols="6">
            <strong>Date</strong>
            <div>1234567</div>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <!-- Table Header -->
        <v-row class="mt-5">
          <v-col cols="12">
            <v-table class="" color="primary">
              <thead class="table-header font-weight-medium text-primary-text">
                <tr>
                  <th class="text-left">RIS No.</th>
                  <th class="text-left">RCC</th>
                  <th class="text-left">Stock No.</th>
                  <th class="text-left">Item</th>
                  <th class="text-left">Unit</th>
                  <th class="text-left">Quantity Issued</th>
                  <th class="text-left">Unit Cost</th>
                  <th class="text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>-</td>
                  <td>123456</td>
                  <td>123456</td>
                  <td>123456</td>
                  <td>-</td>
                  <td>123456</td>
                  <td>0.00</td>
                  <td>0.00</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>

        <!-- Footer section with names and signatures -->
        <v-row class="mt-6 text-primary-text">
          <v-col cols="6">
            <strong>
              I hereby certify to the correctness of the above information.
            </strong>
            <div>Tanya Hill</div>
            <div class="text-caption">
              Name of Supply and/or Property Custodian
            </div>
          </v-col>
          <v-col cols="6">
            <strong>Posted by</strong>
            <div>Name</div>
            <div class="text-caption">Name of Designated Accounting Staff</div>
            <div>Date</div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup></script>

<style scoped>
.table-header {
  background-color: #e1e1f0;
}
</style>
