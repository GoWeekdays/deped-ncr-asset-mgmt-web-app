<template>
    <ReturnPage :id="id" mode="complete" />
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["auth"],
});

const id = useRoute().params._id as string;
</script>