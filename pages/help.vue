<template>
  <v-row class="mb-5 fill-height" justify="center" align="center">
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-row justify="center">
        <v-col cols="12" lg="12">
          <v-card class="pa-4 d-flex align-center">
            <v-img
              src="/asset-management-logo.png"
              alt="Admin Manual"
              contain
              width="130"
              height="130"
              class="mr-4 rounded"
            />
            <div>
              <h2 class="text-h6 font-weight-medium">Admin User Manual</h2>
              <p class="text-subtitle-2 text-fontgray font-weight-regular">
                A complete guide for administrators on system management, user
                access, and request approvals. Covers asset handling, inventory
                tracking, report generation, and best practices for efficient
                administration.
              </p>
              <v-btn
                color="primary"
                variant="flat"
                class="mt-2 text-capitalize"
                @click="downloadManual('ams-admin-manual.pdf')"
              >
                Download PDF
              </v-btn>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" lg="12">
          <v-card class="pa-4 d-flex align-center">
            <v-img
              src="/asset-management-logo.png"
              alt="Personnel Manual"
              contain
              width="130"
              height="130"
              class="mr-4 rounded"
            />
            <div>
              <h2 class="text-h6 font-weight-medium">Personnel User Manual</h2>
              <p class="text-subtitle-2 text-fontgray font-weight-regular">
                Step-by-step guide for personnel on submitting requisitions,
                tracking requests, and using system features efficiently.
                Includes instructions on form submissions, status updates, and
                essential functions.
              </p>
              <v-btn
                color="primary"
                variant="flat"
                class="mt-2 text-capitalize"
                @click="downloadManual('ams-personnel-manual.pdf')"
              >
                Download PDF
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Help");

const downloadManual = (filename) => {
  const pdfUrl = `/${filename}`;
  window.open(pdfUrl, "_blank");
};
</script>
