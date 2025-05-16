<template>
  <v-alert
    v-if="showSuccessModal"
    class="custom-success-alert alert-top-right"
    dismissible
    @click:close="close"
    icon="mdi-check-circle"
    closable
  >
    <v-row no-gutters align="center" class="ma-0">
      <v-col class="pa-0">
        <p class="font-weight-bold">
          Profile for <strong>{{ userEmail }}</strong> updated successfully!
        </p>
      </v-col>
    </v-row>
    <div class="countdown-timer" :style="{ width: timerWidth + '%' }"></div>
  </v-alert>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed } from "vue";

const props = defineProps({
  showSuccessModal: Boolean,
  userEmail: String,
});

const emit = defineEmits(["update:showSuccessModal"]);
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
      close();
    }
  }, 100);
}

function close() {
  emit("update:showSuccessModal", false);
}

watch(
  () => props.showSuccessModal,
  (newValue) => {
    if (newValue) {
      startCountdown();
    }
  }
);
</script>

<style scoped>
.custom-success-alert {
  background-color: #66af4bde;
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

.countdown-timer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: width 0.1s linear;
}
</style>
