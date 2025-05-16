<template>
  <v-alert
    v-if="modelValue"
    class="custom-success-alert alert-top-right"
    dismissible
    closable
    @click:close="closeAlert"
    icon="mdi-check-circle"
  >
    <v-row no-gutters align="center" class="ma-0">
      <v-col class="pa-0">
        <p class="font-weight-bold">Asset added successfully.</p>
      </v-col>
    </v-row>
    <div class="countdown-timer" :style="{ width: timerWidth + '%' }"></div>
  </v-alert>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});

const emit = defineEmits(["update:modelValue"]);
const timerWidth = ref(100);
let countdown = ref(5);
let interval;

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
  }, 100); // 100ms interval
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
</script>

<style scoped>
.custom-success-alert {
  background-color: #66af4b;
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
