<template>
  <LossesPage mode="create" />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});
</script>
