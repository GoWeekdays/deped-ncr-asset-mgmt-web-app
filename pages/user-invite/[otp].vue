<template>
  <v-col v-if="isOTPValid" cols="12" fluid class="pa-0 fill-height">
    <v-row
      no-gutters
      class="fill-height"
      justify="center"
      align-content="center"
    >
      <v-col cols="12" xs="12" sm="8" md="6" lg="10" xl="8">
        <v-card width="100%" elevation="3" class="rounded-lg">
          <v-row no-gutters class="px-12 py-8">
            <v-col cols="12" class="text-center">
              <v-img
                src="/asset-management-logo.png"
                width="140"
                height="120"
                class="mb-2 mx-auto"
              ></v-img>
            </v-col>

            <v-col cols="12" class="text-center mb-10">
              <h2 class="mb-1 text-h4 font-weight-medium text-primary-text">
                User Verification
              </h2>
              <p class="text-body-2" style="color: #889397">
                Please enter your name and create a password to set up your
                account and get started.
              </p>
            </v-col>

            <v-col cols="12">
              <v-form ref="formRef">
                <v-row dense>
                  <v-col cols="12">
                    <h5 class="font-weight-medium text-h6 text-primary-text">
                      User Information
                    </h5>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <p
                      class="text-subtitle-2 font-weight-medium text-primary-text"
                    >
                      Title
                      <span
                        class="text-fontgray font-weight-regular text-caption"
                        >(Optional)</span
                      >
                    </p>
                    <v-text-field
                      v-model="userInfo.title"
                      outlined
                      variant="outlined"
                      density="compact"
                      hint="e.g. Dr, Engr"
                      placeholder="Enter Title"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <InputLabel for="lastName" title="Last Name" />
                    <v-text-field
                      v-model="userInfo.lastName"
                      outlined
                      variant="outlined"
                      density="compact"
                      :rules="[requiredRule]"
                      placeholder="Enter Last Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <InputLabel for="firstName" title="First Name" />
                    <v-text-field
                      v-model="userInfo.firstName"
                      outlined
                      variant="outlined"
                      density="compact"
                      :rules="[requiredRule]"
                      placeholder="Enter First Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <p
                      class="text-subtitle-2 font-weight-medium text-primary-text"
                    >
                      Middle Name
                      <span
                        class="text-fontgray font-weight-regular text-caption"
                        >(Optional)</span
                      >
                    </p>
                    <v-text-field
                      v-model="userInfo.middleName"
                      outlined
                      variant="outlined"
                      density="compact"
                      placeholder="Enter Middle Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <p
                      class="text-subtitle-2 font-weight-medium text-primary-text"
                    >
                      Suffix
                      <span
                        class="text-fontgray font-weight-regular text-caption"
                        >(Optional)</span
                      >
                    </p>
                    <v-text-field
                      v-model="userInfo.suffix"
                      outlined
                      variant="outlined"
                      density="compact"
                      placeholder="Enter Suffix"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <InputLabel for="designation" title="Designation" />
                    <v-text-field
                      v-model="userInfo.designation"
                      outlined
                      variant="outlined"
                      :rules="[requiredRule]"
                      density="compact"
                      placeholder="Enter DepEd Designation"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row class="mt-4">
                  <v-col cols="12">
                    <h5 class="font-weight-medium text-h6 text-primary-text">
                      Create Password
                    </h5>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <InputLabel for="password" title="Password" />
                    <v-text-field
                      v-model="passwordInfo.password"
                      outlined
                      variant="outlined"
                      density="compact"
                      :rules="[requiredRule, passwordRule]"
                      type="password"
                      placeholder="Enter Password"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <InputLabel
                      for="confirmPassword"
                      title="Confirm Password"
                    />
                    <v-text-field
                      v-model="passwordInfo.confirmPassword"
                      outlined
                      variant="outlined"
                      density="compact"
                      :rules="[confirmPasswordValidation]"
                      type="password"
                      placeholder="Confirm Password"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="end" class="mt-3">
                  <v-btn
                    append-icon="mdi-arrow-right"
                    color="primary"
                    class="pa-4 py-5 d-flex text-button text-capitalize font-weight-medium"
                    @click="submitForm"
                    >Create Account</v-btn
                  >
                </v-row>
              </v-form>
            </v-col>
          </v-row>
        </v-card>

        <v-dialog
          v-model="dialogVisible"
          persistent
          max-width="518px"
          :retain-focus="false"
        >
          <v-card elevation="1" class="rounded-lg pa-10">
            <v-card-text
              class="text-center d-flex flex-column align-center gap-6"
            >
              <v-icon color="success" class="icon-background mb-6" size="54">
                mdi-checkbox-marked-circle-outline
              </v-icon>
              <h2 class="text-h4 font-weight-bold mb-4">
                Verification Successful!
              </h2>
              <p class="text-subtitle-1 text-grey-darken-1">
                Your account has been verified. You are now granted access to
                the system's resources.
              </p>
            </v-card-text>
            <v-card-actions class="justify-center">
              <v-btn
                prepend-icon="mdi-arrow-left-circle-outline"
                variant="text"
                color="grey"
                @click="goBackToLogin"
              >
                Back to login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-col>

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

const isOTPValid = ref(true);

try {
  await useNuxtApp().$api("/api/auth/verify-otp", {
    method: "POST",
    body: { otp: useRoute().params.otp || "" },
  });
} catch (error) {
  isOTPValid.value = false;
}

definePageMeta({
  layout: "plain",
});

usePageTitle("User Verification");

const route = useRoute();
const router = useRouter();
const formRef = ref(null);

const { requiredRule, passwordRule, confirmPasswordRule } = useUtils();

const userInfo = ref({
  title: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  designation: "",
});

const passwordInfo = ref({
  password: "",
  confirmPassword: "",
});

const dialogVisible = ref(false);

const confirmPasswordValidation = computed(() => {
  return [
    (value) => {
      return confirmPasswordRule(passwordInfo.value.password, value);
    },
  ];
});

const submitForm = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    console.error("Form validation failed");
    return;
  }

  const otp = route.params.otp;
  if (!otp) {
    router.push("/error");
    return;
  }

  try {
    const result = await useInvite().acceptUserInvite({
      ...userInfo.value,
      password: passwordInfo.value.password,
      passwordConfirmation: passwordInfo.value.confirmPassword,
      otp,
    });

    console.log("Form submission result:", result);

    dialogVisible.value = true;

    setTimeout(() => {
      dialogVisible.value = false;
      router.push("/");
    }, 3000);
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};

const otp = route.params.otp;
if (!otp) {
  router.push("/error");
} else {
  try {
    await useNuxtApp().$api("/api/auth/verify-otp", {
      method: "POST",
      body: { otp },
    });
  } catch (error) {
    isOTPValid.value = false;
  }
}

function goBackToLogin() {
  router.push({ name: "index" });
}
</script>

<style scoped>
.icon-background {
  background-color: #d9ebd2;
  color: #66af4b;
  border-radius: 15px;
  padding: 40px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
