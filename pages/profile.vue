<template>
  <v-row no-gutters justify="center" align="center" class="fill-height">
    <v-col cols="12" md="9" lg="12">
      <!-- Account Card -->
      <v-row dense align="start" justify="start" class="pa-2">
        <v-col cols="12">
          <v-card class="pa-5 rounded-lg">
            <v-row class="pa-5" justify="space-between" align="center">
              <v-col cols="auto">
                <v-row>
                  <h3 class="text-primary-text text-h4 font-weight-regular">
                    ACCOUNT
                  </h3>
                  <v-chip
                    :color="getStatusColor(currentUser?.status)"
                    text-color="white"
                    class="ma-1 ml-4 text-capitalize"
                  >
                    <v-icon
                      size="12"
                      class="me-2"
                      :style="{ color: getStatusColor(currentUser?.status) }"
                    >
                      mdi-circle
                    </v-icon>
                    {{ currentUser?.status }}
                  </v-chip>
                </v-row>
              </v-col>

              <v-btn
                variant="outlined"
                color="fontgray"
                class
                @click="toggleEditMode('account')"
              >
                <v-icon left v-if="!isEditing.account" class="mr-1"
                  >mdi-pencil</v-icon
                >
                {{ isEditing.account ? "Cancel" : "Edit" }}
              </v-btn>
            </v-row>
            <v-form ref="accountForm" v-model="isValid" lazy-validation>
              <v-row dense align="center" justify="start">
                <v-row justify="start" align="center" class="pa-5">
                  <!-- ProfileAvatar Component -->
                  <ProfileAvatar
                    :firstName="currentUser?.firstName"
                    :lastName="currentUser?.lastName"
                    :img-src="`${getOrigin()}/api/public/${currentUser?.attachment}`"
                    size="100"
                  />
                  <v-row
                    v-if="isEditing.account"
                    justify="start"
                    align="center"
                    no-gutters
                    class="pl-5"
                  >
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      class="d-none"
                      @change="onFileChange"
                    />

                    <v-col class="d-flex align-center">
                      <v-btn
                        @click="selectAttachment()"
                        color="primary"
                        class="mt-3 mr-2"
                        :loading="isUploading"
                      >
                        Upload Photo
                      </v-btn>

                      <v-btn
                        variant="outlined"
                        color="fontgray"
                        class="mt-3"
                        v-if="currentUser?.attachment"
                        @click="deleteFile(currentUser?.attachment)"
                      >
                        Remove Photo
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-file-input
                    v-show="false"
                    v-model="file"
                    class="attachment-input"
                    @change="onFileChange"
                    accept=".jpg, .jpeg, .png, .pdf"
                  />
                </v-row>

                <v-col cols="12">
                  <v-row dense>
                    <v-col cols="2">
                      <label
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                      >
                        Title
                      </label>
                      <v-text-field
                        v-if="currentUser"
                        v-model="currentUser.title"
                        :disabled="!isEditing.account"
                        variant="outlined"
                        density="compact"
                        placeholder="e.g Dr, PhD, Engr..."
                      />
                    </v-col>
                    <v-col cols="5">
                      <label
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                      >
                        Last Name
                      </label>
                      <v-text-field
                        v-if="currentUser"
                        v-model="currentUser.lastName"
                        :disabled="!isEditing.account"
                        variant="outlined"
                        density="compact"
                        placeholder="Last Name"
                      />
                    </v-col>
                    <v-col cols="5">
                      <label
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                      >
                        First Name
                      </label>
                      <v-text-field
                        v-if="currentUser"
                        v-model="currentUser.firstName"
                        :disabled="!isEditing.account"
                        variant="outlined"
                        density="compact"
                        placeholder="First Name"
                      />
                    </v-col>
                  </v-row>

                  <v-row dense>
                    <v-col cols="6">
                      <label
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                      >
                        Middle Name
                      </label>
                      <v-text-field
                        v-if="currentUser"
                        v-model="currentUser.middleName"
                        :disabled="!isEditing.account"
                        variant="outlined"
                        density="compact"
                        placeholder="Middle Name"
                      />
                    </v-col>
                    <v-col cols="4">
                      <label
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                      >
                        Suffix
                      </label>
                      <v-text-field
                        v-if="currentUser"
                        v-model="currentUser.suffix"
                        :disabled="!isEditing.account"
                        variant="outlined"
                        density="compact"
                        placeholder="Suffix"
                      />
                    </v-col>
                    <v-col cols="2" class="text-capitalize">
                      <label
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                      >
                        Role
                      </label>
                      <v-text-field
                        v-if="currentUser"
                        v-model="currentUser.type"
                        :disabled="true"
                        variant="outlined"
                        density="compact"
                        placeholder="Role"
                      />
                    </v-col>
                  </v-row>
                  <v-row dense v-if="isEditing.account">
                    <v-btn color="primary" @click="saveUserUpdates">
                      Save Changes
                    </v-btn>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>

      <!-- Contact Email Card -->
      <v-row dense align="start" justify="start" class="pa-2">
        <v-col cols="12">
          <v-card class="pa-5 rounded-lg">
            <v-row class="pa-3" justify="space-between" align="center">
              <h3 class="text-primary-text text-h6 font-weight-medium">
                Contact Email
              </h3>
              <v-btn
                variant="outlined"
                color="fontgray"
                @click="toggleEditMode('email')"
              >
                <v-icon left v-if="!isEditing.email">mdi-pencil</v-icon>
                {{ isEditing.email ? "Cancel" : "Edit" }}
              </v-btn>
            </v-row>
            <v-row dense justify="start" align="center">
              <v-col cols="6">
                <label
                  class="text-subtitle-2 font-weight-medium text-primary-text"
                >
                  Email Address
                </label>
                <v-text-field
                  v-if="currentUser"
                  v-model="newEmail"
                  variant="outlined"
                  density="compact"
                  placeholder="Email"
                  :disabled="!isEditing.email"
                />
              </v-col>
              <v-col cols="3" v-if="isEditing.email">
                <v-btn
                  color="primary"
                  @click="sendInitialOtp"
                  :loading="isLoading"
                  :disabled="!isNewEmailValid"
                >
                  Send OTP
                </v-btn>
              </v-col>
            </v-row>
          </v-card>

          <!-- OTP Modal -->
          <v-dialog v-model="emailOtpDialog" width="500">
            <v-card class="rounded-lg" style="position: relative">
              <v-btn
                icon
                variant="text"
                color="black"
                @click="emailOtpDialog = false"
                style="position: absolute; top: 8px; right: 8px"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-form @submit.prevent="submit" lazy-validation>
                <v-row no-gutters class="pa-8">
                  <v-col cols="12" class="pb-5">
                    <v-row justify="center">
                      <span class="font-weight-medium text-h4"
                        >Email Verification</span
                      >
                    </v-row>
                    <v-row justify="center" class="text-center py-5">
                      <span
                        class="font-weight-regular text-h5 text-fontgray text-caption"
                      >
                        Please enter the 6-digit OTP sent to your email address:
                        <strong class="text-primary-text">{{
                          currentUser?.email
                        }}</strong>
                      </span>
                    </v-row>
                    <v-col cols="12" class="mt-2">
                      <v-row justify="center" align="center">
                        <v-otp-input
                          v-model="otp"
                          :length="6"
                          autofocus
                          finish
                          class="otp-field"
                          :style="otpStyle"
                        />
                      </v-row>
                    </v-col>
                    <v-row justify="center" align="center" class="pt-2">
                      <span class="text-error text-caption text-center">
                        {{ errorMessage }}
                      </span>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12">
                        <v-btn
                          color="primary"
                          block
                          @click="verifyUpdateEmail"
                          class="py-6"
                          :loading="isLoading"
                          :disabled="
                            otp.length !== 6 || isLoading || isSuccessful
                          "
                        >
                          <template v-if="!isSuccessful">Confirm</template>
                          <template v-else>
                            <v-icon left>mdi-check-circle</v-icon>
                            Verified
                          </template>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" class="mt-5">
                    <v-row align="center" justify="center">
                      <span
                        class="font-weight-regular text-h5 text-fontgray text-caption"
                      >
                        Didn't receive OTP?
                        <span
                          class="text-primary font-weight-medium"
                          @click="handleResend"
                          :style="{
                            cursor: isResendDisabled
                              ? 'not-allowed'
                              : 'pointer',
                          }"
                        >
                          {{
                            resendTimer > 0
                              ? `Resend in ${resendTimer} sec`
                              : "Resend"
                          }}
                        </span>
                      </span>
                    </v-row>
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>

      <!-- Password Card -->

      <v-row dense align="start" justify="start" class="pa-2">
        <v-col cols="12">
          <v-card class="pa-5 rounded-lg">
            <v-row class="pa-3" justify="space-between" align="center">
              <h3 class="text-primary-text text-h6 font-weight-medium">
                Password
              </h3>
              <v-btn
                variant="outlined"
                color="fontgray"
                @click="toggleEditMode('password')"
              >
                <v-icon left v-if="!isEditing.password">mdi-pencil</v-icon>
                {{ isEditing.password ? "Cancel" : "Edit" }}
              </v-btn>
            </v-row>
            <v-form ref="passwordForm" v-model="isValid" lazy-validation>
              <v-row dense justify="start" align="center">
                <v-col cols="5">
                  <label
                    class="text-subtitle-2 font-weight-medium text-primary-text"
                    >Current Password</label
                  >
                  <v-text-field
                    v-if="currentUser"
                    v-model="currentUser.oldPassword"
                    type="password"
                    :disabled="!isEditing.password"
                    variant="outlined"
                    density="compact"
                    placeholder="Current Password"
                  />
                </v-col>
              </v-row>

              <v-row dense justify="start" align="center">
                <v-col cols="5">
                  <label
                    class="text-subtitle-2 font-weight-medium text-primary-text"
                    >New Password</label
                  >
                  <v-text-field
                    v-if="currentUser"
                    v-model="currentUser.newPassword"
                    type="password"
                    :disabled="!isEditing.password"
                    variant="outlined"
                    density="compact"
                    placeholder="New Password"
                  />
                </v-col>
                <v-col cols="5">
                  <label
                    class="text-subtitle-2 font-weight-medium text-primary-text"
                    >Confirm Password</label
                  >
                  <v-text-field
                    v-if="currentUser"
                    v-model="currentUser.passwordConfirmation"
                    oldPassword
                    type="password"
                    :disabled="!isEditing.password"
                    variant="outlined"
                    density="compact"
                    placeholder="Confirm Password"
                  />
                </v-col>
              </v-row>

              <v-row dense justify="start" align="center">
                <v-col cols="3" v-if="isEditing.password">
                  <v-btn
                    color="primary"
                    @click="updateUserPassword"
                    :disabled="!isEditing.password"
                  >
                    Save Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <DialogUpdateProfile
      :modelValue="showUpdateDialog"
      :updateType="updateType"
      @update:modelValue="showUpdateDialog = $event"
    />
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Manage Profile")

const {
  getStatusColor,
  requiredRule,
  confirmPasswordRule,
  passwordRule,
  getOrigin,
} = useUtils();

const isEditing = ref({
  account: false,
  email: false,
  password: false,
});
const isValid = ref(false);
const showUpdateDialog = ref(false);

const { updateUserById } = useUser();
const { getCurrentUser, updatePassword, sendUpdateOtp, verifyUpdateEmailOtp } =
  useLocalAuth();

const { currentUser } = useLocalAuth();
const user = computed(() => currentUser.value || useUser());

const toggleEditMode = (section: "account" | "email" | "password") => {
  isEditing.value[section] = !isEditing.value[section];

  if (!isEditing.value[section] && fetchedUser.value) {
    Object.assign(user, fetchedUser.value);
  }
};

const fileInput = ref<HTMLInputElement | null>(null);
const isUploading = ref(false);
const attachment = ref(currentUser.value?.attachment || null);

const { file, uploadFile, deleteFile: _deleteFile } = useFileUpload();

file.value = null;

function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

function setUser(updatedUser: TUser) {
  Object.assign(currentUser.value, updatedUser);
}

const { data: fetchedUser } = await useAsyncData("currentUser", getCurrentUser);

if (fetchedUser.value) {
  Object.assign(user, fetchedUser.value);
  setUser(fetchedUser.value);
}

function selectAttachment() {
  const input = document.querySelector(
    ".attachment-input input"
  ) as HTMLInputElement;
  input.click();
}

async function onFileChange() {
  try {
    const res = await uploadFile();
    currentUser.value.attachment = res?.id;
    attachment.value = res?.id;
  } catch (error) {
    console.log(error);
  }
}

async function deleteFile(value: string) {
  try {
    await _deleteFile(value);
    attachment.value = null;
  } catch (error) {
    console.log(error);
  }
}

const updateType = ref("profile");

async function saveUserUpdates() {
  try {
    if (!currentUser.value) {
      throw new Error("No user data available for update");
    }

    await updateUserById(currentUser.value);
    updateType.value = "profile";
    showUpdateDialog.value = true;

    const updatedUser = await getCurrentUser();
    if (updatedUser) setUser(updatedUser);

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

const emailOtpDialog = ref(false);
const otp = ref("");
const isLoading = ref(false);
const isSuccessful = ref(false);
const errorMessage = ref("");
const formSubmitted = ref(false);

const dummyOtp = "123456";

const otpStyle = computed(() => ({
  borderColor: isSuccessful.value
    ? "green"
    : otp.value === dummyOtp
      ? "green"
      : "inherit",
  color: isSuccessful.value
    ? "green"
    : otp.value === dummyOtp
      ? "green"
      : "inherit",
}));

const valid = computed(() => otp.value === dummyOtp);

const submit = async () => {
  formSubmitted.value = true;
  if (!valid.value) {
    errorMessage.value = "Invalid OTP. Please try again.";
    return;
  }
  errorMessage.value = "";
  isLoading.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    isLoading.value = false;
    isSuccessful.value = true;

    setTimeout(() => {
      emailOtpDialog.value = false;
    }, 2000);
  } catch (error) {
    console.error("Error during OTP submission:", error);
    isLoading.value = false;
  }
};

watch(emailOtpDialog, (newValue) => {
  if (!newValue) {
    otp.value = "";
    isSuccessful.value = false;
    formSubmitted.value = false;
    errorMessage.value = "";
  }
});

const passwordForm = ref(null);

const updateUserPassword = async () => {
  if (!currentUser.value) {
    console.error("No current user data available");
    return;
  }

  const { oldPassword, newPassword, passwordConfirmation } = currentUser.value;

  if (!oldPassword || !newPassword || !passwordConfirmation) {
    console.error("All fields are required.");
    return;
  }

  if (newPassword !== passwordConfirmation) {
    console.error("Passwords do not match.");
    return;
  }

  try {
    const response = await updatePassword(
      currentUser.value._id,
      oldPassword,
      newPassword,
      passwordConfirmation
    );

    console.log("Password updated successfully:", response);
    isEditing.value.password = false;
    updateType.value = "password";
    showUpdateDialog.value = true;

    currentUser.value.oldPassword = "";
    currentUser.value.newPassword = "";
    currentUser.value.passwordConfirmation = "";

    setTimeout(() => {
      showUpdateDialog.value = false;
      updateType.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error updating password:", error);
  }
};

const resendTimer = ref(0);
const isResendDisabled = computed(() => resendTimer.value > 0);
const hasSentOtp = ref(false);

const newEmail = ref(currentUser.value?.email || "");

const isNewEmailValid = computed(() => {
  return newEmail.value && newEmail.value !== currentUser.value?.email;
});

const sendInitialOtp = async () => {
  if (!newEmail.value || newEmail.value === currentUser.value?.email) {
    console.error("Please enter a new email address.");
    return;
  }

  isLoading.value = true;

  try {
    await sendUpdateOtp(newEmail.value);
    emailOtpDialog.value = true;
    console.log("OTP sent successfully");
    hasSentOtp.value = true;
  } catch (error) {
    console.error("Failed to send OTP:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleResend = async () => {
  if (isResendDisabled.value) return;

  if (!currentUser.value?.email) {
    console.error("Email address is required.");
    return;
  }

  isLoading.value = true;

  try {
    await sendUpdateOtp(currentUser.value.email);
    console.log("OTP resent successfully");

    startResendTimer();
  } catch (error) {
    console.error("Failed to resend OTP:", error);
  } finally {
    isLoading.value = false;
  }
};

const startResendTimer = () => {
  resendTimer.value = 60;
  const timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--;
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
};

watch(emailOtpDialog, (newValue) => {
  if (!newValue) {
    otp.value = "";
    isSuccessful.value = false;
    formSubmitted.value = false;
    errorMessage.value = "";
    resendTimer.value = 0;
  }
});
const verifyUpdateEmail = async () => {
  if (!currentUser.value) {
    console.error("No user data available.");
    return;
  }

  if (otp.value.length !== 6) {
    errorMessage.value = "Please enter a valid 6-digit OTP.";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await verifyUpdateEmailOtp(currentUser.value, otp.value);
    isSuccessful.value = true;
    updateType.value = "email";
    showUpdateDialog.value = true;

    setTimeout(() => {
      isLoading.value = false;
      emailOtpDialog.value = false;
      otp.value = "";
      window.location.reload();
    }, 2000);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    errorMessage.value = "Failed to verify OTP. Please try again.";
    isSuccessful.value = false;
    isLoading.value = false;
  }
};
</script>
