<template>
  <AssetSupply type="Update" :assetId="asset" />"
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
});

const asset = useRoute().params.id as string;
</script>
