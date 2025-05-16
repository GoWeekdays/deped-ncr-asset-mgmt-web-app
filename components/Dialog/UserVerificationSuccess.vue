<template>
  <v-dialog v-model="visible" persistent max-width="518px">
    <v-card elevation="1" :style="{ padding: '60px 39px' }" class="rounded-lg">
      <v-card-text class="text-center d-flex flex-column align-center gap-6">
        <v-icon class="icon-background mb-6" size="54">
          mdi-checkbox-marked-circle-outline
        </v-icon>
        <h2 class="text-32px font-700 mb-4">Verification Successful!</h2>
        <p class="font-weight-400 text-fontgray text-subtitle-1">
          Your account has been verified. You are now granted access to the
          system’s resources.
        </p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-icon
          color="grey"
          size="24"
          class="mr-1"
          icon="mdi-arrow-left-circle-outline"
        ></v-icon>
        <v-btn class="text-grey text-body-1" text @click="goBackToLogin">
          Back to login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
});
const emit = defineEmits(["update:modelValue"]);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function goBackToLogin() {
  navigateTo({ name: "index" });
}
</script>

<style scoped>
.icon-background {
  background-color: #d9ebd2;
  color: #66af4b;
  border-radius: 15px;
  padding: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
