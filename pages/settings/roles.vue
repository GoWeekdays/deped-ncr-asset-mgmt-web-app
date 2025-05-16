<template>
  <v-row class="mb-5 fill-height" justify="center" align="center">
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-row class="mb-5" justify="center">
        <v-col cols="12" class="text-center">
          <h1>Settings Roles</h1>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "personnel"],
});
</script>

<style scoped></style>