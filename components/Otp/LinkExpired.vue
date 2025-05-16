<template>
  <v-card class="pa-16">
    <v-row no-gutters align="center" :justify="isMobile ? 'center' : 'start'">
      <v-col :class="isMobile ? 'text-center' : 'text-start'" cols="12" md="7">
        <v-img
          src="/deped-ncr-logo.png"
          width="200"
          class="mb-3"
          :class="isMobile ? 'mx-auto' : ''"
        />

        <h3 class="font-weight-bold text-h4 mt-3 mb-2">Link Expired</h3>

        <v-row :justify="isMobile ? 'center' : 'start'">
          <v-col cols="10">
            <p class="text-paragraph text-fontgray font-weight-regular mb-4">
              The verification link has expired. Please contact the
              administration to request a new invitation.
            </p>
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          class="text-uppercase text-button font-weight-regular"
          :to="{ name: 'index' }"
        >
          Back to Login
        </v-btn>
      </v-col>

      <v-col v-if="!isMobile" cols="12" md="5" class="text-center">
        <v-img src="/otp-expired.png" width="100%" height="auto" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);
</script>
