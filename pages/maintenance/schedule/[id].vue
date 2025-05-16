<template>
  <MaitenancePage :id="id" mode="schedule" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const id = useRoute().params._id as string;
</script>
