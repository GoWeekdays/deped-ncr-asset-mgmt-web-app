<template>
  <v-btn icon class="me-10 text-fontgray text-capitalize" elevation="0" @click="goBack()">
    <v-icon>mdi-chevron-left</v-icon>Back
  </v-btn>
</template>

<script setup lang="ts">
const { goBack } = useUtils();
</script>
