<template>
  <v-form
    ref="form"
    v-model="isFormValid"
    @submit.prevent="submit(stock)"
    class="text-primary-text text-subtitle-2"
  >
    <v-row dense justify="center" align="start">
      <v-col cols="12">
        <v-card class="border-b-sm rounded-lg" elevation="1">
          <v-row class="py-5 px-5" align="center" justify="space-between">
            <v-col cols="auto" class="text-start text-primary-text">
              <h4
                class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
              >
                Add Stock
              </h4>
            </v-col>

            <v-col cols="auto" class="d-flex justify-end">
              <v-btn
                color="primary"
                class="pa-4 px-6 rounded-lg mr-2 d-flex text-capitalize align-center text-button font-weight-medium"
                type="submit"
                :disabled="!isFormValid || isLoading"
                :loading="isLoading"
              >
                Add
              </v-btn>
              <v-btn
                color="fontgray"
                class="pa-4 px-6 rounded-lg d-flex text-capitalize align-center text-button font-weight-medium"
                variant="outlined"
                @click="goBack"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card></v-col
      >
    </v-row>

    <v-row dense class="py-2" fill-height justify="center" align="start">
      <v-col cols="12" lg="12" md="10">
        <v-row dense>
          <v-col cols="12" lg="8" md="7" class="mb-2">
            <v-card class="pa-5 rounded-lg mb-4" elevation="3">
              <label
                for="itemInfo"
                class="text-uppercase text-fontgray text-subtitle-2"
              >
                Item Info
              </label>

              <v-divider class="mt-2"></v-divider>

              <!-- stock no. -->
              <v-row dense class="align-center mt-2">
                <v-col
                  cols="3"
                  class="text-fontgray font-weight-regular text-subtitle-2"
                >
                  Stock No
                </v-col>

                <v-col
                  cols="9"
                  class="text-primary-text font-weight-medium text-subtitle-2"
                >
                  {{ asset.stockNumber || "N/A" }}
                </v-col>
              </v-row>

              <!-- item -->
              <v-row dense class="align-center">
                <v-col
                  cols="3"
                  class="text-fontgray font-weight-regular text-subtitle-2"
                >
                  Item:
                </v-col>

                <v-col
                  cols="9"
                  class="text-primary-text font-weight-medium text-subtitle-2"
                >
                  {{ asset.name || "N/A" }}
                </v-col>
              </v-row>

              <!-- description -->
              <v-row dense class="align-center">
                <v-col
                  cols="3"
                  class="text-fontgray font-weight-regular text-subtitle-2"
                >
                  Description:
                </v-col>

                <v-col
                  cols="9"
                  class="text-primary-text font-weight-medium text-subtitle-2"
                >
                  {{ asset.description || "N/A" }}
                </v-col>
              </v-row>
            </v-card>

            <v-card class="pa-5 rounded-lg" elevation="3">
              <label
                for="itemInfo"
                class="text-capitalize text-fontgray text-subtitle-2"
              >
                Delivery Info
              </label>

              <v-row dense class="mt-5" justify="center" align="start">
                <v-col cols="12">
                  <v-row dense align="center">
                    <v-col cols="6">
                      <InputLabel for="referenceNo" title="Reference Number" />
                      <v-text-field
                        v-model="stock.reference"
                        :rules="[requiredRule]"
                        required
                        clearable
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="3">
                      <InputLabel for="quantity" title="Quantity" />
                      <v-text-field
                        v-model.number="stock.ins"
                        type="number"
                        :rules="[requiredRule]"
                        required
                        clearable
                        min="1"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="3">
                      <label
                        class="text-subtitle-2 font-weight-medium text-primary-text"
                        >Consumable Days</label
                      >
                      <v-text-field
                        v-model.number="stock.numberOfDaysToConsume"
                        type="number"
                        required
                        clearable
                        hint="No of Days to Consume"
                        min="0"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4" md="5" class="mb-4">
            <v-card class="pa-5 rounded-lg" elevation="3">
              <label
                for="itemInfo"
                class="text-capitalize text-fontgray text-subtitle-2"
              >
                Add Attachment
              </label>
              <v-row dense class="mt-2">
                <v-col cols="12">
                  <v-row no-gutters>
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

                    <!-- Add Attachment Button -->
                    <v-col cols="12">
                      <label
                        class="mb-2 text-heading-blue-text font-weight-medium"
                      >
                        <v-btn
                          block
                          @click="selectAttachment()"
                          variant="tonal"
                          class="pa-4 px-6 mt-3 rounded-lg d-flex align-center text-capitalize text-button font-weight-medium"
                          :loading="isUploading"
                        >
                          Click here to browse
                        </v-btn>
                      </label>
                    </v-col>

                    <!-- Hidden File Input -->
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
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const assetId = Array.isArray(route.params.id)
  ? route.params.id[0]
  : route.params.id;

const { getById } = useAsset();
const asset = await getById(assetId);

const { requiredRule, getOrigin, goBack } = useUtils();
const { stock, setStock, createStock } = useStock();

const isFormValid = ref(true);
const isLoading = ref(false);

setStock();
stock.value.assetId = assetId;
stock.value.ins = 1;
const attachment = ref(null);

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
    stock.value.attachment = res?.id;
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
const { currentUser } = useLocalAuth();

async function submit(value: TStock) {
  const user = currentUser?.value;
  if (!user || !user.officeId) {
    throw new Error("User's officeId is missing.");
  }

  const {
    assetId,
    reference,
    attachment,
    ins,
    outs,
    cost,

    numberOfDaysToConsume,
  } = value;

  isLoading.value = true;
  try {
    await createStock({
      assetId,
      reference,
      attachment,
      officeId: user.officeId,
      ins,
      outs,
      numberOfDaysToConsume,
    });
    await goBack();
  } catch (error) {
    isLoading.value = false;
    console.error(error);
  }
}

const { getStocksByAssetId, stocks } = useStock();

try {
  const _stocks = await getStocksByAssetId({ asset: assetId });
  const items = _stocks.items as Array<TStock>;
  stocks.value = items.map((i) => {
    return {
      ...i,
      createdAt: i.createdAt
        ? new Date(i.createdAt as string).toDateString().slice(4)
        : "",
    };
  });
} catch (error) {
  console.log(error);
}
</script>
