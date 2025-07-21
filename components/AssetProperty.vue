<template>
  <v-form
    v-model="isValid"
    @submit.prevent="submit"
    class="text-primary-text font-weight-medium"
  >
    <v-row justify="center" align="start">
      <v-col cols="12">
        <v-card class="border-b-sm rounded-lg" elevation="1">
          <v-row class="py-5 px-5" align="center" justify="space-between">
            <v-col cols="auto" class="text-start text-primary-text">
              <h4
                class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
              >
                {{ title }} CARD
              </h4>
            </v-col>

            <v-col cols="auto" class="d-flex justify-end">
              <v-btn
                color="primary"
                type="submit"
                :disabled="!isValid"
                class="pa-4 px-6 rounded-lg mr-2 d-flex text-capitalize align-center text-button font-weight-medium"
              >
                {{ props.mode === "create" ? "Add" : "Update" }}
              </v-btn>

              <v-btn
                color="fontgray"
                variant="outlined"
                class="pa-4 px-6 rounded-lg d-flex text-capitalize align-center text-button font-weight-medium"
                @click="goBack"
                >Cancel</v-btn
              >
            </v-col>
          </v-row>
        </v-card></v-col
      >
    </v-row>

    <v-row dense class="py-2" fill-height justify="center" align="start">
      <v-col cols="12" lg="12s" md="12">
        <v-row dense>
          <v-col cols="12" lg="8" md="7" class="mb-4">
            <v-card class="pa-5 rounded-lg mb-4" elevation="3">
              <label
                for="itemInfo"
                class="text-capitalize text-fontgray text-subtitle-2"
              >
                Property Info
              </label>
              <v-row dense class="mt-2">
                <v-col cols="12">
                  <input-label for="name" :title="`${name} `" />
                  <v-text-field
                    v-model="asset.name"
                    :rules="[requiredRule]"
                    variant="outlined"
                    density="compact"
                    class="mt-0"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row dense class="mt-2">
                <v-col cols="12">
                  <input-label for="description" title="Description" />
                  <v-text-field
                    v-model="asset.description"
                    :rules="[requiredRule]"
                    variant="outlined"
                    density="compact"
                    class="mt-0"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row v-if="mode === 'create'" dense class="mt-2">
                <v-col>
                  <input-label for="year" title="Year" />
                  <v-select
                    v-model="asset.propNumAttrib.year"
                    :items="yearOptions"
                    :rules="[requiredRule, yearValidation]"
                    variant="outlined"
                    density="compact"
                    :error="yearError"
                    :error-messages="
                      yearError ? ['Please select a valid year'] : []
                    "
                  />
                </v-col>

                <v-col>
                  <input-label
                    for="serialNumber"
                    :title="`${propertyType} Code`"
                  />

                  <v-select
                    v-model="asset.propNumAttrib.propertyCode"
                    :item-props="itemProps"
                    :items="items"
                    :rules="[requiredRule]"
                    variant="outlined"
                    placeholder="Select"
                    density="compact"
                  ></v-select>
                </v-col>

                <v-col>
                  <input-label for="serialNumber" title="Serial Number" />
                  <v-select
                    v-model="asset.propNumAttrib.serialNumber"
                    :item-props="itemProps"
                    :items="serialCodes"
                    :rules="[requiredRule]"
                    variant="outlined"
                    placeholder="Select"
                    density="compact"
                  ></v-select>
                </v-col>

                <v-col>
                  <input-label for="location" title="Location" />
                  <v-select
                    v-model="asset.propNumAttrib.location"
                    :item-props="itemProps"
                    :items="locationCodes"
                    :rules="[requiredRule]"
                    placeholder="Select"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card>

            <v-card
              v-if="mode === 'create'"
              class="pa-5 rounded-lg mb-4"
              elevation="3"
            >
              <label
                for="itemInfo"
                class="text-capitalize text-fontgray text-subtitle-2"
              >
                Manage Stock
              </label>
              <v-row dense class="mt-2">
                <v-col cols="6">
                  <label
                    class="text-subtitle-2 font-weight-medium text-primary-text"
                    >Date Acquired</label
                  >
                  <v-text-field
                    v-model="formattedCreatedAt"
                    type="date"
                    :rules="[requiredRule]"
                    variant="outlined"
                    density="compact"
                    class="mt-0"
                  >
                  </v-text-field>
                </v-col>

                <v-col cols="6">
                  <label
                    class="text-subtitle-2 font-weight-medium text-primary-text"
                    >Reference
                  </label>
                  <v-text-field
                    v-model="stock.reference"
                    :rules="[requiredRule]"
                    variant="outlined"
                    density="compact"
                    class="mt-0"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <input-label
                    for="modeOfAcquisition"
                    title="Mode of Acquisition"
                  />
                  <v-select
                    v-model="asset.modeOfAcquisition"
                    :items="modeOfAcquisition"
                    :item-title="'title'"
                    :item-value="'value'"
                    :rules="[requiredRule]"
                    placeholder="Select"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row dense class="mt-2">
                <v-col cols="6" v-if="shouldShowProcurementType">
                  <input-label for="procurement" title="Procurement Type" />
                  <v-select
                    v-model="asset.procurementType"
                    :items="procurementType"
                    :item-title="'title'"
                    :item-value="'value'"
                    :rules="[requiredRule]"
                    placeholder="Select"
                    variant="outlined"
                    density="compact"
                  ></v-select>
                </v-col>

                <v-col cols="6" v-if="shouldShowSupplierName">
                  <input-label for="nameOfSupplier" title="Name of Supplier" />
                  <v-text-field
                    v-model="asset.supplier"
                    :rules="[requiredRule]"
                    placeholder="Enter Supplier Name"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" md="5" class="mb-4">
            <v-card
              v-if="mode === 'create'"
              class="pa-5 rounded-lg mb-4"
              elevation="3"
            >
              <label
                for="itemInfo"
                class="text-capitalize text-fontgray text-subtitle-2"
              >
                Add Attachment
              </label>
              <v-row dense class="mt-2">
                <v-col cols="12">
                  <v-row no-gutters>
                    <!-- Dotted Frame -->
                    <v-col cols="12">
                      <div
                        class="dotted-frame d-flex align-center justify-center"
                        style="
                          border: 2px dotted #888;
                          padding: 8px;
                          border-radius: 8px;
                          width: 100%;
                          height: 150px;
                          overflow: hidden;
                          position: relative;
                          text-align: center;
                        "
                      >
                        <template v-if="attachment">
                          <v-img
                            :src="`${getOrigin()}/api/public/${attachment}`"
                            alt="Attachment"
                            contain
                            style="max-width: 100%; max-height: 100%"
                          />
                          <v-btn
                            size="md"
                            variant="text"
                            icon="mdi-close"
                            class="delete-btn"
                            @click="deleteFile(attachment)"
                            style="
                              position: absolute;
                              top: 8px;
                              right: 8px;
                              z-index: 10;
                            "
                          ></v-btn>
                        </template>
                        <template v-else>
                          <p
                            class="text-subtitle-2 text-fontgray"
                            style="margin: 0; color: #888"
                          >
                            Click the browse button to upload an image
                          </p>
                        </template>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <label
                        class="mb-2 text-heading-blue-text font-weight-medium"
                      >
                        <v-btn
                          block
                          @click="selectAttachment()"
                          variant="tonal"
                          class="pa-4 px-6 rounded-lg mr-2 mt-3 d-flex text-capitalize align-center text-button font-weight-medium"
                          :loading="isUploading"
                        >
                          Click here to browse
                        </v-btn>
                      </label>
                    </v-col>

                    <v-file-input
                      v-show="false"
                      v-model="file"
                      class="attachment-input"
                      @change="onFileChange"
                      accept=".jpg, .jpeg, .png, .pdf"
                    />
                  </v-row>
                </v-col>
              </v-row>
            </v-card>

            <v-card class="pa-5 rounded-lg" elevation="3">
              <v-row dense class="mt-2">
                <v-col v-if="mode === 'create'" cols="12">
                  <input-label for="article" title="Article" />
                  <v-text-field
                    v-model.number="asset.article"
                    :rules="[requiredRule]"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
                <v-col v-if="mode === 'create'" cols="12">
                  <input-label for="quantity" title="Quantity" />
                  <v-text-field
                    v-model.number="stock.ins"
                    :rules="[requiredRule]"
                    min="1"
                    type="number"
                    variant="outlined"
                    density="compact"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <input-label for="cost" title="Unit of Measurement" />
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

                <v-col cols="12" v-if="isSEP && mode === 'create'">
                  <input-label for="cost" title="Unit Cost" />
                  <v-text-field
                    v-model.number="asset.cost"
                    :rules="[requiredRule, costRangeSEP]"
                    type="number"
                    min="0"
                    max="49999"
                    variant="outlined"
                    density="compact"
                    :error="costErrorSEP"
                    :error-messages="
                      costErrorSEP ? ['Cost must be between 0 and 49,999'] : []
                    "
                  />
                </v-col>

                <v-col cols="12" v-if="isPPE && mode === 'create'">
                  <input-label for="cost" title="Unit Cost" />
                  <v-text-field
                    v-model.number="asset.cost"
                    :rules="[requiredRule, costRangePPE]"
                    type="number"
                    min="0"
                    max="50000"
                    variant="outlined"
                    density="compact"
                    :error="costErrorSEP"
                    :error-messages="
                      costErrorSEP ? ['Cost must be above 50,000'] : []
                    "
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
  <!-- dialogs -->

  <DialogPropertyError v-model="errorDialog" :error-message="errorMessage" />
</template>

<script setup lang="ts">
const props = defineProps({
  mode: {
    type: String,
    default: () => "create",
  },
  assetId: {
    type: String,
    default: () => "",
  },
});

const { goBack, requiredRule } = useUtils();

const {
  getLocationCodes,
  getSepCodes,
  getPpeCodes,
  getSerialCodes,
  serialCodes,
  SEPCodes,
  PPECodes,
  locationCodes,
  itemProps,
  search,
} = useAssetCodes();

async function getAssetCodes() {
  try {
    await getSerialCodes();
  } catch (error) {
    console.error(error);
  }

  try {
    await getLocationCodes();
  } catch (error) {
    console.error(error);
  }

  if (isSEP) {
    try {
      await getSepCodes();
    } catch (error) {
      console.error(error);
    }
  }

  if (isPPE) {
    try {
      await getPpeCodes();
    } catch (error) {
      console.error(error);
    }
  }
}

getAssetCodes();

const {
  asset,
  setAsset,
  createProperty,
  name,
  isPPE,
  isSEP,
  propertyType,
  title,
  getById,
  updatePropertyById,
} = useAsset();
setAsset();

if (props.mode === "update") {
  try {
    const _asset = await getById(props.assetId);
    setAsset(_asset);
  } catch (error) {
    console.log(error);
  }
}

const items = computed(() => {
  return isPPE ? PPECodes.value : isSEP ? SEPCodes.value : [];
});

const { stock, setStock, modeOfAcquisition, procurementType } = useStock();
setStock();

if (!stock.value.ins) {
  stock.value.ins = 1;
}

const reference = ref("");
const attachment = ref(null);

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

const {
  file,
  uploadFile,
  deleteFile: _deleteFile,
  isUploading,
} = useFileUpload();

file.value = null;

function selectAttachment() {
  const input = document.querySelector(
    ".attachment-input input"
  ) as HTMLInputElement;
  input.click();
}

async function onFileChange() {
  try {
    const res = await uploadFile();
    attachment.value = res?.id;
  } catch (error) {
    console.log(error);
  }
}

async function deleteFile(value: string) {
  try {
    await _deleteFile(value);
    attachment.value = null;
  } catch (error) {
    console.log(error);
  }
}

const shouldShowProcurementType = computed(() => {
  return asset.value.modeOfAcquisition === "procurement";
});

const shouldShowSupplierName = computed(() => {
  return ["bidding", "quotation"].includes(
    asset.value.procurementType as string
  );
});

const { getOrigin } = useUtils();

const errorDialog = ref(false);
const errorMessage = ref("");
const loading = ref(false);

const { currentUser } = useLocalAuth();

async function _createAsset() {
  try {
    const user = currentUser?.value;

    if (!user || !user.officeId) {
      throw new Error("User's officeId is missing.");
    }

    const quantity = stock.value.ins || 1;

    if (typeof asset.value.unitOfMeasurement !== "string") {
      throw new Error("Invalid unitOfMeasurement. Expected a string value.");
    }

    await createProperty({
      createdAt: asset.value.createdAt,
      name: asset.value.name,
      article: asset.value.article,
      description: asset.value.description,
      year: asset.value.propNumAttrib.year.toString(),
      propertyCode: asset.value.propNumAttrib.propertyCode,
      serialCode: asset.value.propNumAttrib.serialNumber,
      locationCode: asset.value.propNumAttrib.location,
      quantity: quantity,
      cost: asset.value.cost,
      reference: stock.value.reference,
      attachment:
        typeof attachment.value === "string" ? attachment.value : undefined,
      type: propertyType.value,
      modeOfAcquisition: asset.value.modeOfAcquisition,
      procurementType: asset.value.procurementType,
      supplier: asset.value.supplier,
      officeId: user.officeId,
      unitOfMeasurement: asset.value.unitOfMeasurement,
    });

    await goBack();
  } catch (error: any) {
    console.error("API Error:", error);

    errorMessage.value = "Asset name already exists.";

    errorDialog.value = true;
  }
}

async function _updateAsset() {
  try {
    await updatePropertyById({
      _id: asset.value._id,
      name: asset.value.name,
      description: asset.value.description,
      year: asset.value.propNumAttrib.year.toString(),
      propertyCode: asset.value.propNumAttrib.propertyCode,

      serialCode: asset.value.propNumAttrib.serialNumber,
      locationCode: asset.value.propNumAttrib.location,
    });
    await goBack();
  } catch (error: any) {
    console.error(error);

    errorMessage.value = "Asset name already exists.";

    errorDialog.value = true;
  }
}

const formattedCreatedAt = computed({
  get() {
    return asset.value.createdAt
      ? new Date(asset.value.createdAt).toISOString().split("T")[0]
      : "";
  },
  set(value: string) {
    asset.value.createdAt = value ? new Date(value).toISOString() : "";
  },
});

async function submit() {
  loading.value = true;

  if (props.mode === "create") {
    await _createAsset();
  }

  if (props.mode === "update") {
    await _updateAsset();
  }
  loading.value = false;
}

const yearError = ref(false);

const yearOptions = ref<string[]>(generateYearOptions());

function generateYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = 2010; year <= currentYear; year++) {
    years.push(year.toString());
  }
  return years;
}

const currentYear = new Date().getFullYear().toString();
if (!asset.value.propNumAttrib.year) {
  asset.value.propNumAttrib.year = currentYear;
}

// Validation function
const yearValidation = (value: string | null) => {
  const year = Number(value);
  const currentYearNum = new Date().getFullYear();

  if (!value || year < 2010 || year > currentYearNum) {
    yearError.value = true;
    return false;
  }
  yearError.value = false;
  return true;
};

const isValid = ref(false);

const costErrorSEP = ref(false);
const costErrorPPE = ref(false);

const costRangeSEP = (value: number) => {
  if (value < 0 || value > 49999) {
    costErrorSEP.value = true;
    return false;
  }
  costErrorSEP.value = false;
  return true;
};

const costRangePPE = (value: number) => {
  if (value < 50000) {
    costErrorPPE.value = true;
    return false;
  }
  costErrorPPE.value = false;
  return true;
};

const unitOfMeasurementItems = ["Pieces", "Bundles", "Boxes"];
</script>

<style scoped>
.table-header {
  background-color: #e1e1f0;
}
</style>
