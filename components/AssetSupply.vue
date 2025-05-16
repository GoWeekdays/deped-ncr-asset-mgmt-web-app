<template>
  <v-row dense justify="center" align="start">
    <v-col cols="12">
      <v-card class="border-b-sm rounded-lg" elevation="1">
        <v-row class="py-5 px-5" align="center" justify="space-between">
          <v-col cols="auto" class="text-start text-primary-text">
            <h4
              class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
            >
              {{ type }} Supply
            </h4>
          </v-col>

          <v-col cols="auto" class="d-flex justify-end">
            <v-btn
              color="primary"
              @click="submitAsset(asset, props.type)"
              :disabled="!isFormValid"
              class="pa-4 px-6 rounded-lg mr-2 d-flex text-capitalize align-center text-button font-weight-medium"
            >
              {{ props.type.toLowerCase() === "update" ? "Update" : "Add" }}
            </v-btn>

            <v-btn
              color="fontgray"
              class="pa-4 px-6 rounded-lg d-flex text-capitalize align-center text-button font-weight-medium"
              @click="goBack"
              variant="outlined"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card></v-col
    >
  </v-row>

  <v-row dense class="py-2" fill-height justify="center" align="start">
    <v-col cols="12" lg="12" md="12">
      <v-form v-model="isFormValid">
        <v-row dense justify="center" align="start">
          <v-col cols="12" lg="8" class="mb-4">
            <v-card class="pa-5 rounded-lg" elevation="3">
              <label
                for="itemInfo"
                class="text-uppercase text-fontgray text-fontgray text-subtitle-2"
              >
                Item Info
              </label>

              <v-row dense>
                <v-col cols="6">
                  <InputLabel for="reOrderPoint" title="Re-order Point" />
                  <v-text-field
                    v-model="asset.reorderPoint"
                    variant="outlined"
                    :rules="[requiredRule]"
                    density="compact"
                    placeholder="-"
                    class="mt-0 font-weight-regular"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12">
                  <InputLabel for="item" title="Item" />

                  <v-text-field
                    v-model="asset.name"
                    variant="outlined"
                    :rules="[requiredRule]"
                    density="compact"
                    placeholder="e.g. Printer Paper (A4)"
                    class="mt-0 font-weight-regular"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="12">
                  <InputLabel for="description" title="Description" />
                  <v-text-field
                    v-model="asset.description"
                    variant="outlined"
                    :rules="[requiredRule]"
                    density="compact"
                    placeholder="e.g. Hardcopy Copy Paper A4 70gsm"
                    class="mt-0 font-weight-regular"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" class="mb-4">
            <v-card class="pa-5 rounded-lg" elevation="3">
              <v-row dense>
                <v-col v-if="props.type.toLowerCase() !== 'update'" cols="12">
                  <InputLabel for="cost" title="Unit Cost" />
                  <v-text-field
                    v-model.number="asset.cost"
                    :rules="[requiredRule]"
                    type="number"
                    min="1"
                    variant="outlined"
                    density="compact"
                  />
                </v-col>

                <v-col cols="12">
                  <input-label
                    for="unitOfMeasurement"
                    title="Unit of Measurement"
                  />
                  <v-combobox
                    v-model="asset.unitOfMeasurement"
                    v-model:search="search"
                    :hide-no-data="false"
                    :items="unitOfMeasurementItems"
                    :rules="[requiredRule]"
                    variant="outlined"
                    density="compact"
                    hide-selected
                    persistent-hint
                    small-chips
                  >
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          No results matching "<strong>{{ search }}</strong
                          >". Press <kbd>enter</kbd> to create a new one.
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-combobox>
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="12">
                  <InputLabel for="article" title="Article" />
                  <v-text-field
                    v-model="asset.article"
                    variant="outlined"
                    :rules="[requiredRule]"
                    density="compact"
                    placeholder="-"
                    class="mt-0 font-weight-regular"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "Add",
  },
  assetId: {
    type: String,
    default: "",
  },
});

const { asset, setAsset, createConsumable, updateAssetById, search } =
  useAsset();
setAsset();

const errorDialog = ref(false);
const errorMessage = ref("");

const showSuccessDialog = ref(false);

const isFormValid = ref(false);

const { goBack } = useUtils();
const { requiredRule } = useUtils();

async function _createAsset(asset: TAsset) {
  try {
    const consumable: TConsumableCreate = {
      createdAt: asset.createdAt || new Date().toISOString(),
      reorderPoint: asset.reorderPoint ?? "",
      name: asset.name,
      description: asset.description,
      unitOfMeasurement: asset.unitOfMeasurement,
      article: asset.article,
      cost: asset.cost,
    };

    await createConsumable(consumable);
    await navigateTo({ name: "assets-consumables" });
  } catch (error: any) {
    errorDialog.value = true;
    errorMessage.value = error.data?.message || "An error occurred.";
  }
}

async function _updateAssetById(asset: TAsset) {
  try {
    if (!asset._id) {
      throw new Error("Asset ID is missing");
    }

    // Extract only the fields relevant to TConsumableCreate
    const updatedAsset: TConsumableCreate = {
      // reorderPoint: asset.reorderPoint ?? "",
      name: asset.name,
      description: asset.description,
      unitOfMeasurement: asset.unitOfMeasurement,
      article: asset.article,
    };

    await updateAssetById(asset._id, updatedAsset);

    await navigateTo({ name: "assets-consumables" });
  } catch (error: any) {
    errorDialog.value = true;
    errorMessage.value = error.data?.message || "An error occurred.";
  }
}

const submitAsset = async (asset: TAsset, type = "") => {
  if (type.toLocaleLowerCase() === "add") {
    await _createAsset(asset);
  }

  if (type.toLocaleLowerCase() === "update") {
    await _updateAssetById(asset);
  }
};

const { getById } = useAsset();
if (props.assetId && props.type.toLocaleLowerCase() == "update") {
  const _asset = await getById(props.assetId);

  setAsset(_asset);
}

const unitOfMeasurementItems = ["Pieces", "Bundles", "Boxes"];
</script>
