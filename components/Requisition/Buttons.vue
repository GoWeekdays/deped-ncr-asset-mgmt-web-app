<template>
  <v-row no-gutters class="fill-height" justify="end" align="center">
    <v-col
      cols="auto"
      v-for="(button, index) in buttons"
      :key="button.label"
      :class="{ 'ml-2': index > 0 }"
    >
      <v-tooltip
        v-if="button.disabled && button.tooltipText"
        :text="button.tooltipText"
        location="top"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            :color="button.color"
            :variant="button.variant"
            :disabled="button.disabled || loading[button.action]"
            :loading="loading[button.action]"
            @click="handleAction(button.action)"
            class="pa-4 px-6 rounded-lg mr-2 d-flex text-capitalize align-center text-button font-weight-medium"
          >
            {{ button.label }}
          </v-btn>
        </template>
      </v-tooltip>

      <v-btn
        v-else
        :color="button.color"
        :variant="button.variant"
        :disabled="button.disabled || loading[button.action]"
        :loading="loading[button.action]"
        @click="handleAction(button.action)"
      >
        {{ button.label }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface ButtonProps {
  label: string;
  color: string;
  variant?: string;
  action: string;
  disabled?: boolean;
  tooltipText?: string;
}

const props = defineProps({
  buttons: {
    type: Array as () => ButtonProps[],
    required: true,
  },
});

const emit = defineEmits(["action"]);
const loading = ref<{ [key: string]: boolean }>({});

async function handleAction(action: string) {
  loading.value[action] = true;
  emit("action", action);

  setTimeout(() => {
    loading.value[action] = false;
  }, 2000);
}
</script>
