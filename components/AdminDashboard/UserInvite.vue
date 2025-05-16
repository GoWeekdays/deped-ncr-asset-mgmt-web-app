<template>
  <v-row no-gutters class="text-primary-text">
    <v-col cols="12">
      <!-- Title Row -->
      <v-row no-gutters align="center" justify="start">
        <v-col class="text-primary-text" cols="auto">
          <h1 class="text-h4 font-weight-regular">
            {{ title }}
          </h1>
        </v-col>
      </v-row>

      <!-- Button Row -->
      <v-row
        class="font-weight-medium py-5 rounded-md"
        no-gutters
        align="center"
        justify="start"
      >
        <v-btn
          :class="[
            'tab-button',
            { 'tab-button--active': activeTab === 'userList' },
            'font-weight-medium',

            'px-10',
            'py-6 ',
            'me-3',
            'rounded-lg',
            'd-flex',
            'justify-center',
            'align-center',
          ]"
          color="primary"
          variant="flat"
          :to="{ name: 'settings-users-user-list' }"
          :for="props.for"
          @click="changeTab('userList')"
        >
          USER LIST
        </v-btn>
        <v-btn
          :class="[
            'tab-button',
            { 'tab-button--active': activeTab === 'inviteUser' },
            'font-weight-medium',
            'px-10',
            'py-5',
            'rounded-lg',
            'd-flex',
            'justify-center',
            'align-center',
          ]"
          tile
          color="primary"
          variant="text"
          :to="{ name: 'settings-users-invite-user' }"
          :for="props.for"
          @click="changeTab('inviteUser')"
        >
          INVITE USER
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  activeTab: {
    type: [String, Number],
    required: true,
  },

  for: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["update:activeTab"]);

const changeTab = (newTab: string) => {
  emit("update:activeTab", newTab);
};
</script>
