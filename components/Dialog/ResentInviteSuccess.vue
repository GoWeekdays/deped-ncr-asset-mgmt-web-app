<template>
  <v-alert
    v-if="localShowResentDialog"
    class="custom-success-alert alert-top-right"
    dismissible
    @click:close="close"
    icon="mdi-check-circle"
    closable
  >
    <v-row no-gutters align="center" class="ma-0">
      <v-col class="pa-0">
        <p class="font-weight-bold">
          Invitation resent to <strong>{{ truncatedEmail }}</strong
          >.
        </p>
      </v-col>
    </v-row>
    <div class="countdown-timer" :style="{ width: timerWidth + '%' }"></div>
  </v-alert>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  showResentDialog: Boolean,
  invitedEmail: String,
});

const emit = defineEmits(["update:showResentDialog"]);

const localShowResentDialog = ref(props.showResentDialog);

watch(
  () => props.showResentDialog,
  (newValue) => {
    localShowResentDialog.value = newValue;
    if (newValue) {
      startCountdown();
    }
  }
);

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
  localShowResentDialog.value = false;
  emit("update:showResentDialog", false);
}

const truncatedEmail = computed(() => {
  return props.invitedEmail.length > 15
    ? props.invitedEmail.slice(0, 15) + "..."
    : props.invitedEmail;
});

// Cleanup interval on component unmount
onUnmounted(() => {
  clearInterval(interval);
});
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

.v-icon {
  font-size: 24px;
}

.v-alert .v-alert__wrapper {
  display: flex;
  align-items: center;
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
