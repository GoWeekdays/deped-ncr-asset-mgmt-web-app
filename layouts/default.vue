<template>
  <v-app>
    <v-app-bar elevation="0" color="background" class="px-4">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

        <h1
          v-if="!$vuetify.display.mdAndDown"
          class="text-primary-text text-h6"
        >
         Asset Management System
        </h1>
      </template>

      <template v-slot:append>
        <PrimaryLayoutHeader />
      </template>
    </v-app-bar>

    <v-navigation-drawer
      floating
      width="300"
      v-model="drawer"
      color="background"
    >
      <v-list open-strategy="single" color="deped-color" density="compact">
        <v-row class="px-2 mb-1">
          <v-img
            src="/stronger-together-logo.png"
            alt="Logo"
            contain
            :height="120"
            style="padding: 6px"
          />
        </v-row>
        <NavigationItem
          v-for="(navigationItem, navigationIndex) in navigationItems"
          :key="navigationIndex"
          :title="navigationItem.title"
          :icon="navigationItem.icon"
          :route="navigationItem.route"
          :children="navigationItem.children"
        ></NavigationItem>
      </v-list>
    </v-navigation-drawer>

    <v-main :class="backgroundColor" class="">
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from "vuetify";
const { navigationItems, drawer } = useLocal();
const theme = useTheme();

const backgroundColor = computed(
  () => `bg-${theme.global.current.value.colors.background}`
);
</script>
