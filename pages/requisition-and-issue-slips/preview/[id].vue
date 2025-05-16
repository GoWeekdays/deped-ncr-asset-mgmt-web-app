<template>
  <RequisitionIssueSlip :id="id" mode="view" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const id = useRoute().params.id as string;
</script>
