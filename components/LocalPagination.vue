<template>
  <div class="arrow-navigation">
    <button class="custom-btn" @click="decrement" :disabled="page <= 1">
      <v-icon>mdi-chevron-left</v-icon>
    </button>

    <button class="custom-btn" @click="increment" :disabled="page >= length">
      <v-icon>mdi-chevron-right</v-icon>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  length: {
    type: Number,
    required: true,
    default: 0,
  },
});

const page = defineModel({ type: Number, default: 1 });
const emit = defineEmits(["update:value"]);
const route = useRoute();

watch(page, () => {
  emit("update:value", page.value);
});

onMounted(() => {
  page.value = 1;
});

watch(
  () => props.length,
  () => {
    page.value = 1;
  }
);

watch(
  () => route.path,
  () => {
    page.value = 1;
  }
);

function increment() {
  if (page.value < props.length) {
    page.value++;
  }
}

function decrement() {
  if (page.value > 1) {
    page.value--;
  }
}
</script>

<style scoped>
.arrow-navigation {
  display: flex;
  align-items: center;
  gap: 5px;
}

.custom-btn {
  background: transparent;
  border: none;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  transition:
    background 0.2s ease-in-out,
    opacity 0.2s ease-in-out;
}

.custom-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.custom-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
