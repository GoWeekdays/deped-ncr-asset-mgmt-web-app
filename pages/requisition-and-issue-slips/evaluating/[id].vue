<template>
  <RequisitionIssueSlip :id="id" mode="evaluating" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const id = useRoute().params.id as string;
</script>
