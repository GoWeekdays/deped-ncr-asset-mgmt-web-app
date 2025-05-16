<template>
  <!-- <v-btn @click="toggleTheme">
    <v-icon size="25">{{ themeIcon }}</v-icon>
  </v-btn> -->
  <v-menu transition="slide-y-transition" v-model="menuOpen" :close-on-content-click="false" class="rounded-lg">
    <div class="mb-3"></div>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" size="large" class="font-400 text-uppercase">
        <v-row align="center" no-gutters class="d-flex">
          <!-- Profile Avatar -->
          <v-col cols="auto">
            <ProfileAvatar :firstName="currentUser?.firstName" :lastName="currentUser?.lastName"
              :img-src="`${getOrigin()}/api/public/${currentUser?.attachment}`" size="40" />
          </v-col>

          <v-col class="ml-2 d-flex flex-column" cols="auto">
            <span class="text-caption font-weight-bold text-left">
              {{ currentUser?.firstName }} {{ currentUser?.lastName }}
            </span>

            <span class="text-caption text-left mt-n1 text-capitalize" style="color: grey">
              {{ currentUser?.type }}
            </span>
          </v-col>

          <v-col cols="auto" class="ml-1 d-flex align-center">
            <v-icon>
              {{ menuOpen ? "mdi-chevron-up" : "mdi-chevron-down" }}
            </v-icon>
          </v-col>
        </v-row>
      </v-btn>
    </template>

    <div style="width: 450px; position: relative" class="rounded-xl overflow-hidden">
      <!-- Close Button -->
      <v-btn icon variant="plain" @click="menuOpen = false"
        style="position: absolute; top: 5px; right: 10px; z-index: 10">
        <v-icon size="20">mdi-close</v-icon>
      </v-btn>

      <v-list class="py-2 px-3" :style="{ backgroundColor: menuBackgroundColor, color: textColor }">
        <v-list-item>
          <v-row align="center" justify="center" class="w-100">
            <!-- Email Section -->
            <v-col cols="auto" class="text-center">
              <v-list-item-subtitle class="pa-2 mb-3 font-weight-medium">
                {{ currentUser?.email }}
              </v-list-item-subtitle>
            </v-col>
          </v-row>
        </v-list-item>

        <div class="d-flex justify-center mb-1">
          <ProfileAvatar :firstName="currentUser?.firstName" :lastName="currentUser?.lastName"
            :img-src="`${getOrigin()}/api/public/${currentUser?.attachment}`" size="100" />
        </div>
        <v-list-item-title class="text-h6 font-weight-medium mb-1 text-center">
          Hi, {{ currentUser?.firstName }} !
        </v-list-item-title>
        <v-list-item-subtitle class="mb-3 text-capitalize text-center">
          {{ currentUser?.type }}
        </v-list-item-subtitle>

        <v-row justify="center" align="center">
          <v-col cols="auto">
            <v-btn :to="`/profile`" color="primary" class="py-5 rounded-lg text-center" variant="outlined" style="
                display: flex;
                align-items: center;
                justify-content: center;
              ">
              <span :class="buttonTextClass">Manage Your Account</span>
            </v-btn>
          </v-col>
        </v-row>

        <v-list-item class="mt-2">
          <v-btn block @click="handleLogout" :loading="isLoggingOut" color="secondary" variant="plain">
            Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </div>
  </v-menu>
</template>

<script setup lang="ts">
const { currentUser, getCurrentUser, logout } = useLocalAuth();
const { user } = useUser();
const { getOrigin } = useUtils();
const router = useRouter();
const menuOpen = ref(false);
const isLoggingOut = ref(false);

onMounted(() => {
  if (!currentUser.value) {
    getCurrentUser().catch((error) => {
      console.error("Failed to fetch current user:", error);
    });
  }
});

async function handleLogout() {
  isLoggingOut.value = true;
  try {
    console.log("Attempting to log out...");
    await logout();
    console.log("Logout successful.");
    currentUser.value = null;
    await router.push("/logout");
    console.log("Redirected to /logout");

    menuOpen.value = false;
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    isLoggingOut.value = false;
  }
}

import { useTheme } from "vuetify";

const theme = useTheme();

const themeIcon = computed(() =>
  theme.global.current.value.dark
    ? "mdi-white-balance-sunny"
    : "mdi-weather-night"
);

function toggleTheme() {
  const newTheme = theme.global.current.value.dark ? "light" : "dark";
  theme.global.name.value = newTheme;

  sessionStorage.setItem("theme", newTheme);
}
const menuBackgroundColor = computed(() =>
  theme.global.current.value.dark ? "#282a2c" : "#e9eef6"
);

const buttonTextClass = computed(() => {
  return theme.global.current.value.dark ? "text-primary-text" : "textwhite";
});

const textColor = computed(() =>
  theme.global.current.value.dark ? "#ffffff" : "#000000"
);
</script>
