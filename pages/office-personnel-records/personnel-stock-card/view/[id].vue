<template>
  <v-row justify="center">
    <v-col cols="12" class="">
      <v-card class="pa-7 position-relative rounded-lg">
        <v-row v-if="!isPersonnel" no-gutters class="mb-4">
          <v-col cols="12">
            <BackButton />
          </v-col>
        </v-row>

        <v-row class="d-flex flex-column flex-md-row align-start gap-4">
          <!-- Profile Avatar -->
          <v-col
            cols="12"
            md="auto"
            class="d-flex justify-center justify-md-start"
          >
            <ProfileAvatar
              :firstName="personnel?.name"
              :img-src="`${getOrigin()}/api/public/${personnel?.attachment}`"
              size="130"
            />
          </v-col>

          <!-- User Info & Status -->
          <v-col>
            <v-row
              no-gutters
              align="center"
              class="d-flex flex-column flex-md-row gap-2 mb-3"
            >
              <!-- Name -->
              <v-col cols="12" md="auto" class="text-center text-md-start">
                <span class="text-h5 font-weight-medium text-capitalize">
                  {{ personnel?.name }}
                </span>
              </v-col>

              <!-- Status Chip -->
              <v-col
                cols="12"
                md="auto"
                class="d-flex justify-center justify-md-start"
              >
                <v-chip
                  :color="getStatusColor(personnel?.status)"
                  text-color="white"
                  class="text-capitalize font-weight-regular"
                >
                  <v-icon size="12" class="me-2">mdi-circle</v-icon>
                  {{ personnel?.status }}
                </v-chip>
              </v-col>
            </v-row>

            <!-- User Details -->
            <v-row class="mt-2">
              <v-col
                v-for="(item, index) in userInfo"
                :key="index"
                cols="6"
                sm="4"
                md="3"
                class="py-2 d-flex flex-column align-center align-md-start"
              >
                <span class="text-body-2 text-primary text-capitalize">
                  {{ item.label }}
                </span>
                <div
                  class="d-flex align-center mt-1 text-wrap"
                  style="word-break: break-word; overflow-wrap: break-word"
                >
                  <v-icon
                    v-if="item.icon"
                    :icon="item.icon"
                    color="primary"
                    size="small"
                    class="me-2"
                  ></v-icon>
                  <span
                    class="text-body-1 font-weight-medium text-capitalize"
                    :class="{
                      'text-lowercase': item.label
                        .toLowerCase()
                        .includes('email'),
                    }"
                    style="
                      word-break: break-word;
                      overflow-wrap: break-word;
                      white-space: normal;
                    "
                  >
                    {{ item.value }}
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="mt-6">
          <v-col>
            <v-text-field
              v-model="search"
              class="text-body-2"
              placeholder="Search here..."
              prepend-inner-icon="mdi-magnify"
              clearable
              density="compact"
              variant="outlined"
              style="max-width: 400px"
              rounded="lg"
              @keydown.enter="_getPersonnelById(search)"
            />
          </v-col>

          <v-col cols="auto" class="d-flex justify-end align-center">
            <span class="mr-2 text-caption text-fontgray">
              {{ pageRange }}
            </span>
            <local-pagination
              v-model="page"
              :length="pages"
              @update:value="_getPersonnelById()"
            />
          </v-col>
        </v-row>

        <v-row class="mt-4">
          <v-col cols="12">
            <v-data-table
              :items="personnel?.items || []"
              :headers="headers"
              :loading="loading"
              hide-default-footer
              fixed-header
              class="text-capitalize"
              style="max-height: calc(100vh - 64px - 400px); overflow-y: auto"
            >
              <template #item.condition="{ item }">
                <v-chip
                  :color="getStatusColor(item.condition)"
                  size="small"
                  class="text-capitalize px-2 font-weight-regular"
                >
                  <v-icon size="small" class="me-1">mdi-circle</v-icon>
                  {{ item.condition || "" }}
                </v-chip>
              </template>

              <template #item.date="{ item }">
                {{ new Date(item.date).toDateString().slice(4) }}
              </template>

              <template #item.action="{ item }">
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-icon
                      size="large"
                      class="text-primary-text"
                      v-bind="props"
                    >
                      mdi-dots-horizontal
                    </v-icon>
                  </template>
                  <v-list>
                    <v-list-item
                      :to="{
                        name: 'assets-consumables-stock-card-id',
                        params: { id: item.assetId },
                      }"
                    >
                      <template v-slot:prepend>
                        <v-icon size="medium">mdi-eye-outline</v-icon>
                      </template>
                      Property Card
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ["auth", "personnel"],
});

const { getOrigin, getStatusColor, isPersonnel } = useUtils();

const { currentUser } = useLocalAuth();
const loading = ref(false);

const headers = computed<
  { title: string; value: string; align?: "start" | "end" | "center" }[]
>(() => {
  const items: {
    title: string;
    value: string;
    align?: "start" | "end" | "center";
  }[] = [
    { title: "Item Name", value: "name" },
    { title: "Qty", value: "quantity", align: "center" },
    { title: "Date", value: "date", align: "center" },
    { title: "Condition", value: "condition", align: "center" },
    { title: "Type", value: "type", align: "center" },
  ];

  if (!isPersonnel.value) {
    items.push({
      title: "Action",
      value: "action",
      align: "center" as "center",
    });
  }

  return items;
});

const id = computed(() => {
  const route = useRoute();
  return route.params.id as string;
});

const { getPersonnelById, personnel, search, page, pages, pageRange } =
  usePersonnelCard();

const _getPersonnelById = async (search = "") => {
  try {
    loading.value = true;
    const result = await getPersonnelById({
      personnelId: id.value,
      page: page.value,
      search,
    });

    pageRange.value = result.pageRange;
    pages.value = result.pages;

    personnel.value = result;
    personnel.value.items = result.items || [];

    userInfo.value = [
      {
        label: "Role:",
        value: result.type || "",
      },
      {
        label: "Office:",
        value: result.officeName || "",
      },
      {
        label: "Email:",
        value: result.email || "",
      },
      {
        label: "Total SEP:",
        value: result.sepCount || "",
        icon: "mdi-package-variant-closed",
      },
      {
        label: "Total PPE:",
        value: result.ppeCount || "",
        icon: "mdi-package-variant-closed",
      },
    ];
  } catch (error) {
    console.error("Error fetching office property details:", error);
  } finally {
    loading.value = false;
  }
};

_getPersonnelById();

const userInfo = ref([
  {
    label: "Division:",
    value: "32",
  },
  {
    label: "Office Chief:",
    value: "32",
  },
  {
    label: "Email:",
    value: "32",
  },
  {
    label: "Total Items Owned:",
    value: "totalItemsOwned",
    icon: "mdi-package-variant-closed",
  },
]);
</script>
