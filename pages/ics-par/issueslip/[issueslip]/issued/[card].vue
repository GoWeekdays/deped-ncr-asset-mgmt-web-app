<template>
  <IssuanceSlip :id="id" mode="issued" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const id = useRoute().params._id as string;
</script>
