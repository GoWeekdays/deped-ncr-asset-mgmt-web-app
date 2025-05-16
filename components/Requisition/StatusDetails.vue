<template>
  <v-row align="start" class="d-flex flex-column">
    <v-col class="py-0">
      <label class="text-primary">{{ label }}</label>
    </v-col>

    <template v-if="name || designation">
      <v-col class="py-0">
        <div>{{ name }}</div>
      </v-col>
      <v-col class="py-0">
        <div class="text-caption text-capitalize">{{ designation }}</div>
      </v-col>
      <v-col class="py-0">
        <div class="text-caption text-capitalize">{{ displayDate }}</div>
      </v-col>
    </template>

    <template v-else>
      <v-col class="py-0 text-caption">
        <div>{{ emptyMessage }}</div>
      </v-col>
    </template>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  label: { type: String, required: true },
  name: { type: String, default: "" },
  designation: { type: String, default: "" },
  formattedDate: { type: String, default: "" },
  emptyMessage: {
    type: String,
    default: "Request is pending approval from the admin. Please wait.",
  },
});

const displayDate = computed(() => {
  return props.formattedDate
    ? new Date(props.formattedDate).toDateString().slice(4)
    : "";
});
</script>
