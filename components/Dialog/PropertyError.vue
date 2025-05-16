<template>
  <v-alert
    v-if="modelValue"
    class="custom-error-alert alert-top-right"
    dismissible
    closable
    @click:close="closeAlert"
    icon="mdi-alert-circle"
  >
    <p class="font-weight-bold">{{ formatErrorMessage(errorMessage) }}</p>
    <div class="countdown-timer" :style="{ width: timerWidth + '%' }"></div>
  </v-alert>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: Boolean,
  updateType: String,
  errorMessage: {
    type: [Object, String],
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const timerWidth = ref(100);
let countdown = ref(5);
let interval;

function formatErrorMessage(error) {
  if (typeof error === "string") {
    return error;
  }
  if (error && error.message) {
    return error.message;
  }
  return "An error occurred";
}

function startCountdown() {
  clearInterval(interval);
  countdown.value = 5;
  timerWidth.value = 100;

  interval = setInterval(() => {
    countdown.value -= 0.1;
    timerWidth.value = (countdown.value / 5) * 100;

    if (countdown.value <= 0) {
      clearInterval(interval);
      closeAlert();
    }
  }, 100);
}

function closeAlert() {
  emit("update:modelValue", false);
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      startCountdown();
    }
  }
);

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.custom-error-alert {
  background-color: #d32f2f;
  color: #fff;
}

.alert-top-right {
  position: fixed;
  top: 76px;
  right: 16px;
  width: 300px;
  z-index: 9999;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-icon {
  font-size: 24px;
}

.countdown-timer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: width 0.1s linear;
}
</style>
