<template>
  <div>
    <label
      :for="props.for"
      class="text-subtitle-2 font-weight-medium text-primary-text"
    >
      {{ props.title }} <span v-if="props.required" class="text-error">*</span>
    </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  for: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
});
</script>
