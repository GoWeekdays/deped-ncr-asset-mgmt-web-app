<template>
  <MaitenancePage :id="id" mode="complete" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const id = useRoute().params._id as string;
</script>
