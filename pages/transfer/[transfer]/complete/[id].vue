<template>
    <TransferPage :_id="_id" mode="complete" />
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    middleware: ["auth"],
  });
  
  const _id = computed(() => useRoute().params.id as string);
  </script>