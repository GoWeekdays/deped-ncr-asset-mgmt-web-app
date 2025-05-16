<template>
  <v-row class="py-4">
    <v-col cols="12">
      <v-row>
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium">
            Entity Name
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            {{ requisition?.entityName }}
          </div>
        </v-col>
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium">
            Fund Cluster
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            {{ requisition?.fundCluster }}
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium">
            Division
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            {{ getDivisionName(requisition?.divisionId) }}
          </div>
        </v-col>
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium">
            Responsibility Center Code
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            {{ requisition?.rcc }}
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium">
            Office
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            {{ getOfficeName(requisition?.officeId) }}
          </div>
        </v-col>
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium">
            RIS No.
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            {{ requisition?.risNo }}
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-2 text-capitalize">
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium text-capitalize">
            Purpose
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            {{ requisition?.purpose }}
          </div>
        </v-col>
        <v-col cols="6">
          <label class="text-fontgray text-body-2 font-weight-medium">
            Status
          </label>
          <div class="text-subtitle-1 text-primary-text font-weight-regular mt-1">
            <v-chip v-if="requisition?.status" :color="getStatusColor(requisition.status)" class="text-capitalize"
              small>
              <v-icon size="small" class="me-1">mdi-circle</v-icon>{{ requisition?.status }}
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  requisition: { type: Object, required: true },
  getDivisionName: { type: Function, required: true },
  getOfficeName: { type: Function, required: true },
  mode: { type: String, default: "view" },
  id: { type: String, default: "" },
});

const { getStatusColor } = useUtils();
</script>
