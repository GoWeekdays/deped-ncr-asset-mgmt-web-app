<template>
  <v-list-group v-if="children && children.length" density="compact">
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        :prepend-icon="icon"
        class="text-body-2"
        :class="isActive(route) ? 'deped-color rounded-e-pill ' : ''"
      >
        <span :class="isActive(route) ? 'text-primary-text' : ''">
          {{ title }}
        </span>
      </v-list-item>
    </template>

    <NavigationItem
      v-for="(child, childIndex) in children"
      :key="childIndex"
      :title="child.title"
      :route="child.route"
      :icon="child.icon"
      :children="child.children"
    >
    </NavigationItem>
  </v-list-group>

  <v-list-item
    v-else
    :prepend-icon="icon"
    :to="route"
    density="compact"
    class="text-body-2"
    :class="isActive(route) ? 'deped-color  rounded-e-pill' : ''"
  >
    <span :class="isActive(route) ? 'text-primary-text' : ''">
      {{ title }}
    </span>
  </v-list-item>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

interface TNavigationItem {
  title: string;
  icon?: string;
  route: Record<string, any>;
  children?: TNavigationItem[];
}

const currentRoute = useRoute();

defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: "mdi-folder-outline",
  },
  route: {
    type: Object,
    default: () => ({ name: "", params: {} }),
  },
  children: {
    type: Array as () => TNavigationItem[],
    default: () => [],
  },
});

const isActive = (itemRoute: Record<string, any>) =>
  currentRoute.name === itemRoute.name;
</script>
