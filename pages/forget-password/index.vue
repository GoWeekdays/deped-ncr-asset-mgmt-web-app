<template>
  <v-row align="center" justify="center" no-gutters>
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
        <p class="headline mb-2 text-primary-text font-weight-bold text-h5">
          Forgot Password
        </p>
        <p class="mb-2 text-subtitle-2 text-grey">
          Enter your email for instructions.
        </p>

        <v-form ref="resetPasswordForm" class="pa-2">
          <div class="field-wrapper mb-4 text-start">
            <InputLabel for="email" title="Email" />
            <v-text-field
              v-model="email"
              :rules="[emailRule]"
              :error-messages="emailErrors"
              placeholder="Email Address"
              type="email"
              variant="outlined"
              density="comfortable"
              class="mb-2 mt-2"
              required
            ></v-text-field>
          </div>
          <v-btn
            block
            color="primary"
            class="pa-4 py-6 rounded-lg text-button text-capitalize font-weight-medium"
            @click="submit"
            :loading="isLoading"
            :disabled="isLoading"
          >
            Send Verification
          </v-btn>
          <p v-if="formError" class="mt-4 text-caption text-error">
            {{ formError }}
          </p>
        </v-form>

        <v-card-actions class="justify-center">
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

    <DialogForget v-model="forgotdialogVisible" :email="email" />
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "plain",
});

usePageTitle("Forget Password")

const forgotdialogVisible = ref(false);
const email = ref("");
const emailErrors = ref<string[]>([]);
const formError = ref<string | null>(null);
const isLoading = ref(false);

const { emailRule } = useUtils();
const { requestPasswordReset } = useLocalAuth();

const resetPasswordForm = ref();

function showDialog() {
  forgotdialogVisible.value = true;
}

async function submit() {
  emailErrors.value = [];
  formError.value = null;
  if (emailErrors.value.length === 0) {
    isLoading.value = true;
    try {
      await requestPasswordReset(email.value);
      showDialog();
    } catch (error: any) {
      formError.value = "An error occurred while processing your request.";
    } finally {
      isLoading.value = false;
    }
  }
}

function goBackToLogin() {
  navigateTo({ name: "index" });
}
</script>
