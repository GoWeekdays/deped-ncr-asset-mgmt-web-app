<template>
  <v-row class="fill-height ma-0 vh-10 pa-0" align="center">
    <v-col
      v-if="!isMobile"
      cols="12"
      md="8"
      lg="8"
      class="fill-height d-flex align-center justify-center"
    >
      <v-img
        class="rounded"
        src="/login-page.png"
        :max-height="isMobile ? '333px' : '60%'"
        width="100%"
        object-fit="contain"
      />
    </v-col>

    <v-col
      cols="12"
      sm="12"
      md="4"
      lg="4"
      class="fill-height d-flex align-center justify-center"
    >
      <v-card class="pa-2 mx-auto elevation-4 rounded-lg" max-width="400px">
        <v-card-text>
          <v-row justify="center">
            <v-col cols="auto">
              <v-img
                src="/asset-management-logo.png"
                alt="Logo"
                contain
                :height="100"
                width="120"
                class="mb-2"
              />
            </v-col>
          </v-row>

          <h2 class="text-h6 text-center font-weight-medium text-primary-text">
            Welcome Back!
          </h2>
          <p class="text-primary-text text-center font-weight-regular mb-6">
            Please enter your account details.
          </p>
          <v-form ref="loginForm" v-model="isFormValid" class="w-100">
            <v-row dense>
              <v-col cols="12">
                <label
                  for="email"
                  class="subtitle-1 font-weight-medium text-primary-text"
                  >Email Address</label
                >
                <v-text-field
                  v-model="email"
                  :rules="[requiredRule, emailRule]"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  append-inner-icon="mdi-email-outline"
                  class="mt-2"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <label
                  for="password"
                  class="subtitle-1 font-weight-medium text-primary-text"
                  >Password</label
                >
                <v-text-field
                  v-model="password"
                  :rules="[requiredRule]"
                  placeholder="●●●●●●●●"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  class="mt-2"
                  variant="outlined"
                  @click:append-inner="showPassword = !showPassword"
                />
              </v-col>

              <v-col cols="12" class="text-right">
                <NuxtLink
                  :to="{ name: 'forget-password' }"
                  class="text-primary font-weight-medium"
                >
                  Forgot Password?
                </NuxtLink>
              </v-col>

              <v-col cols="12">
                <v-btn
                  color="primary"
                  class="pa-4 py-6 text-button text-capitalize font-weight-medium"
                  rounded="lg"
                  block
                  :disabled="!isFormValid || isLoading"
                  :loading="isLoading"
                  @click="submit"
                >
                  Sign In
                </v-btn>
              </v-col>

              <v-col cols="12" v-if="formError">
                <p type="error" class="text-center text-error subtitle-1">
                  {{ formError }}
                </p>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

definePageMeta({
  layout: "login",
});

useHead({
  title: "DepEd AMS"
})

const display = useDisplay();
const isMobile = computed(() => display.smAndDown.value);
const showPassword = ref(false);
const isLoading = ref(false);
const email = ref("");
const password = ref("");
const isFormValid = ref(false);
const formError = ref<string | null>(null);

const { requiredRule, emailRule } = useUtils();
const { login, setToken } = useLocalAuth();

const loginForm = ref();

async function submit() {
  formError.value = null;
  isLoading.value = true;

  const isValid = await loginForm.value.validate();

  if (isValid && email.value && password.value) {
    try {
      const token = await login({
        email: email.value,
        password: password.value,
      });

      setToken({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: token.id,
      });

      useRouter().push({ name: "dashboard" });
    } catch (error: any) {
      if (error.data && error.data.message) {
        formError.value = error.data.message;
      }
    }
  }

  isLoading.value = false; // Stop loading after process completes
}
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
}
</style>
