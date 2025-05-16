<template>
    <asset-property mode="update" :asset-id="organization" />
</template>

<script setup lang="ts">
const organization = useRoute().params.id as string ?? "";
</script>