<template>
  <v-col cols="12">
    <v-row no-gutters>
      <v-dialog v-model="visible" persistent max-width="518px">
        <v-card elevation="1" class="rounded-lg pa-8">
          <v-card-text class="text-center d-flex flex-column align-center gap-6">
            <v-icon class="icon-background mb-6" size="54">
              mdi-checkbox-marked-circle-outline
            </v-icon>
            <h2 class="text-h4 font-weight-black text-fontcolor mb-4">
              All Done!
            </h2>
            <p class="font-weight-regular text-fontgray text-subtitle-1">
              Your password has been reset! You can now log in with your new
              password.
            </p>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn class="font-weight-regular text-capitalize" text @click="goBackToLogin">
              <v-icon icon="mdi-arrow-left-circle-outline mr-2"></v-icon>Back to login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-col>
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
  navigateTo("/");
}
</script>

<style scoped>
.icon-background {
  background-color: rgba(8, 70, 131, 0.25);
  color: #084683;
  border-radius: 15px;
  padding: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
