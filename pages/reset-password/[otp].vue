<template>
  <v-row v-if="isOTPValid" align="center" justify="center" no-gutters>
    <v-col
      cols="12"
      xs="12"
      sm="6"
      md="4"
      lg="4"
      xl="3"
      class="d-flex flex-column justify-center align-center"
    >
      <v-card class="rounded-lg text-center py-3 px-5" width="100%">
        <v-img
          src="/asset-management-logo.png"
          alt="Logo"
          class="mb-4"
          contain
          max-height="120"
          width="100%"
        />

        <p class="headline mb-1 text-primary-text font-weight-bold text-h5">
          Reset Password
        </p>
        <p class="mb-3 text-subtitle-2 text-grey">
          Must be at least 8 characters.
        </p>

        <v-form ref="form" @submit.prevent="resetPassword">
          <v-row dense>
            <v-col class="text-start" cols="12">
              <InputLabel for="newPassword" title="New Password" />
              <v-text-field
                v-model="newPassword"
                :rules="[passwordRule]"
                variant="outlined"
                density="comfortable"
                required
                placeholder="New Password"
                type="password"
                :error-messages="newPasswordError"
              />
            </v-col>
            <v-col class="text-start" cols="12">
              <InputLabel for="confirmPassword" title="Confirm Password" />
              <v-text-field
                v-model="confirmPassword"
                :rules="[confirmPasswordRule]"
                variant="outlined"
                density="comfortable"
                required
                placeholder="Confirm Password"
                type="password"
                :error-messages="confirmPasswordError"
              /> </v-col
          ></v-row>
          <v-btn
            class="mt-4 pa-4 py-6 rounded-lg text-button text-capitalize font-weight-medium"
            block
            color="primary"
            type="submit"
            :loading="loading"
          >
            Reset Password
          </v-btn>

          <p v-if="errorMessage" type="error" class="mb-4 mt-2 text-error">
            {{ errorMessage }}
          </p>
        </v-form>

        <v-card-actions class="justify-center mt-3">
          <v-btn
            variant="text"
            class="text-capitalize font-weight-regular"
            :ripple="false"
            @click="goBackToLogin"
          >
            <v-icon color="grey" size="24" class="mr-1">
              mdi-arrow-left-circle-outline
            </v-icon>
            Back to Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <DialogPasswordConfirmation v-model="passwordConfirmationVisible" />
  </v-row>

  <v-row v-else class="fill-height" align="center" justify="center" no-gutters>
    <v-col
      :class="isMobile ? 'px-4' : 'px-0'"
      cols="12"
      lg="7"
      md="8"
      sm="8"
      xs="5"
    >
      <OtpLinkExpired />
    </v-col>
  </v-row>
</template>

<script setup>
import { useDisplay } from "vuetify";

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);
definePageMeta({
  layout: "plain",
});
usePageTitle("Reset Password");

let isOTPValid = ref(true);
let errorMessage = ref("");
try {
  await useNuxtApp().$api("/api/auth/verify-otp", {
    method: "POST",
    body: { otp: useRoute().params.otp || "" },
  });
} catch (error) {
  isOTPValid.value = false;
}

const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const form = ref(null);
const passwordConfirmationVisible = ref(false);

const { resetPasswordRequest } = useLocalAuth();
const {
  passwordRule: basePasswordRule,
  confirmPasswordRule: baseConfirmPasswordRule,
} = useUtils();

const passwordRule = (v) => {
  const result = basePasswordRule(v);
  return result === true ? true : result;
};

const confirmPasswordRule = (v) => {
  if (v !== newPassword.value) {
    return "Passwords must match";
  }
  return true;
};

const newPasswordError = computed(() => {
  if (newPassword.value && newPassword.value.length < 8) {
    return "Password must be at least 8 characters long";
  }
  return "";
});

const confirmPasswordError = computed(() => {
  if (confirmPassword.value && confirmPassword.value !== newPassword.value) {
    return "Passwords must match";
  }
  return "";
});

async function resetPassword() {
  if (!form.value || !form.value.validate()) {
    return;
  }

  loading.value = true;
  const otp = useRoute().params.otp;

  try {
    const response = await resetPasswordRequest(
      otp,
      newPassword.value,
      confirmPassword.value
    );
    console.log("Password reset successful:", response);
    passwordConfirmationVisible.value = true;
  } catch (error) {
    console.error("Error resetting password:", error);
    errorMessage.value = "Failed to reset password. Please try again.";
  } finally {
    loading.value = false;
  }
}

function goBackToLogin() {
  navigateTo({ name: "index" });
}
</script>

<style scoped>
.custom-card {
  border: 1px solid #889397;
  border-radius: 12px;
}
</style>
