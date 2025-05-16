<template>
  <v-row justify="center" align="start" class="fill-height header-row">
    <v-col cols="12" sm="10" md="11" lg="12">
      <v-card class="pa-4 responsive-card position-relative rounded-lg">
        <!-- Header Section -->
        <v-row class="pt-2" align="center" justify="space-between">
          <v-col cols="12" sm="8" md="9" class="text-primary-text mb-2">
            <h4
              class="font-bold text-h4 font-weight-regular text-start text-sm-left"
            >
              Personnel Stock Cards
            </h4>
          </v-col>
        </v-row>

        <v-row no-gutters justify="space-between" align="center" class="">
          <v-col cols="12" sm="6" md="4" class="">
            <v-text-field
              v-model="search"
              class="text-body-2"
              placeholder="Search here..."
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              variant="outlined"
              rounded="lg"
              @keydown.enter="_getUsers(search)"
            />
          </v-col>
          <v-col
            cols="12"
            sm="auto"
            class="d-flex justify-end justify-sm-end align-center"
          >
            <span class="mr-2 text-caption text-fontgray">{{ pageRange }}</span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getUsers(search)"
            />
          </v-col>
        </v-row>
        <v-col cols="12">
          <v-data-table
            :items="users"
            :headers="headers"
            hide-default-footer
            item-value="data"
            fixed-header
            :loading="loading"
            class="table-container overflow-y"
          >
            <template v-slot:item.type="{ item }">
              <label color="primary" class="text-capitalize" size="small">
                {{ item.type }}
              </label>
            </template>
            <template v-slot:item.action="{ item }">
              <NuxtLink
                :to="{
                  name: 'office-personnel-records-personnel-stock-card-view-id',
                  params: { id: item._id },
                }"
                class="text-primary font-weight-medium cursor-pointer text-decoration-none"
              >
                View
              </NuxtLink>
            </template>
          </v-data-table>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

usePageTitle("Personnel Stock Card");
const { getUsers, search, users, page, pages, pageRange } = useUser();
const loading = ref(false);

const headers = computed<
  { title: string; value: string; align?: "start" | "end" | "center" }[]
>(() => [
  { title: "Name", value: "name" },
  { title: "Email Address", value: "email" },
  { title: "Role", value: "type" },
  {
    title: "Action",
    value: "action",
    align: "end",
  },
]);

async function _getUsers(search = "") {
  loading.value = true;

  try {
    await getUsers({
      search: search,
      page: page.value,
    });
  } catch (error) {
    console.error("Error fetching issue slips:", error);
  } finally {
    loading.value = false;
  }
}

_getUsers();
</script>
