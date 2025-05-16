<template>
  <WastePage :id="id" mode="view" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const id = useRoute().params._id as string;
</script>
