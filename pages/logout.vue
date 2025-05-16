<template>
  <v-row no-gutters align="center" justify="center" class="fill-height">
    <v-col cols="12" class="text-center">
      You have been successfully logged out.
      <NuxtLink :to="{ name: 'index' }" class="text-primary cursor-pointer">
        Log in Again
      </NuxtLink>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "plain",
});

const { logout } = useLocalAuth();
logout();
</script>
