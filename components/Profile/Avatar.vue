<template>
  <v-avatar :size="size" class="custom-avatar">
    <v-img
      v-if="imgSrc && imgSrc !== ''"
      class="rounded-pill"
      :src="imgSrc"
      :style="{ objectFit: 'contain', width: '100%', height: '100%' }"
      contain
    />

    <span
      v-else
      :style="{ fontSize: `calc(${size}px / 2)` }"
      class="font-weight-regular"
    >
      {{ initials }}
    </span>
  </v-avatar>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: string | number;
  imgSrc?: string;
  firstName?: string;
  lastName?: string;
  attachment?: string;
}>();

const { getOrigin } = useUtils();

const initials = computed(() => {
  const first = props.firstName ? props.firstName[0] : "";
  const last = props.lastName ? props.lastName[0] : "";
  return (first + last).toUpperCase();
});

const imgSrc = computed(() => {
  if (props.imgSrc) {
    return props.imgSrc;
  }
  if (props.attachment) {
    return `${getOrigin()}/api/public/${props.attachment}`;
  }
  return "";
});
</script>

<style scoped>
.custom-avatar {
  background-color: #373941;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}
</style>
