<template>
    <TransferPage mode="create" />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth"],
});
</script>