<template>
  <v-dialog v-model="localDialog" max-width="400px" @click:outside="closeDialog">
    <v-card class="py-3 px-4 rounded-lg" elevation="2">
      <v-card-title class="text-h5 font-weight-regular text-primary-text">
        Add Stock
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="confirm" class="text-primary-text text-subtitle-2">
          <v-row>
            <v-col cols="12">
              <!-- Reference Number -->
              <label class="mb-2 text-heading-blue-text font-weight-medium">
                Reference Number
              </label>
              <v-text-field v-model="formData.referenceNumber" :rules="[requiredRule]" required clearable
                variant="outlined" density="compact" class="mb-4" />

              <!-- Quantity -->
              <label class="mb-2 text-heading-blue-text font-weight-medium">
                Quantity
              </label>
              <v-text-field v-model.number="formData.quantity" type="number" :rules="[requiredRule, isNumber]" required
                clearable variant="outlined" density="compact" class="mb-4" />

              <!-- Attachment -->
              <label class="mb-2 text-heading-blue-text font-weight-medium">
                Attachment
              </label>
              <v-file-input :rules="[requiredRule]" accept=".jpg,.jpeg,.png,.pdf" required variant="outlined"
                density="compact" class="mb-4" @change="handleFileChange" />
            </v-col>
          </v-row>

          <!-- Buttons in Grid -->
          <v-row>
            <v-col cols="6" class="d-flex justify-center align-center">
              <v-btn color="primary" class="px-9 py-5 d-flex align-center" @click="confirm"
                :disabled="!valid || loading" :loading="loading">
                Confirm
              </v-btn>
            </v-col>
            <v-col cols="6" class="d-flex justify-center align-center">
              <v-btn color="gray" class="px-9 py-5 d-flex align-center" variant="outlined" @click="closeDialog">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-alert v-if="errorMessage" type="error" class="mx-3 mb-3">
        {{ errorMessage }}
      </v-alert>
    </v-card>
  </v-dialog>
</template>
<script setup>
const { requiredRule, isNumber } = useUtils();
const { createStock } = useAsset();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  assetId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "stock-added"]);

const form = ref(null);
const valid = ref(false);
const loading = ref(false);
const errorMessage = ref("");

const formData = ref({
  referenceNumber: "",
  quantity: null,
  attachment: null, // This will hold the file name string
});

const localDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      resetForm();
    }
  }
);

const resetForm = () => {
  if (form.value) {
    form.value.reset();
  }
  formData.value = {
    referenceNumber: "",
    quantity: null,
    attachment: null,
  };
  errorMessage.value = "";
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value.attachment = file.name;
  } else {
    formData.value.attachment = null;
  }
};

const confirm = async () => {
  if (!valid.value) return;

  try {
    loading.value = true;
    errorMessage.value = "";

    // Create the payload
    const stockData = {
      assetId: props.assetId,
      referenceNumber: formData.value.referenceNumber,
      quantity: formData.value.quantity.toString(),
      attachment: formData.value.attachment,
    };

    const response = await createStock(stockData);
    if (response && response.message) {
      emit("stock-added");
      closeDialog();
    }
  } catch (error) {
    console.error("Error adding stock:", error);
    errorMessage.value =
      error.message || "Failed to add stock. Please try again.";
  } finally {
    loading.value = false;
  }
};

const closeDialog = () => {
  localDialog.value = false;
  resetForm();
};
</script>
