<template>
  <v-dialog :model-value="isDialogOpen" max-width="500" @update:model-value="updateModelValue">
    <v-card class="pa-8 rounded-lg" elevation="2">
      <v-card-title class="text-center mb-2">
        <v-avatar size="50" class="mx-auto">
          <v-icon size="32" color="secondary" class="icon-background">mdi-alert-outline</v-icon>
        </v-avatar>
      </v-card-title>
      <div class="text-center my-1">
        <h2 class="text-h5 font-weight-bold text-primary-text">Are you sure?</h2>
      </div>
      <v-card-text class="text-center">
        <p class="text-subtitle-2 text-gray font-weight-regular">
          This action cannot be undone. All files associated with this field
          will be lost.
        </p>
      </v-card-text>
      <v-row class="justify-center pa-4">
        <v-btn color="primary" @click="confirmDeleteStock" class="mx-2">Delete</v-btn>
        <v-btn color="primary" variant="outlined" text @click="closeDialog" class="mx-2">Cancel</v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  isDialogOpen: Boolean,
  stockToDelete: Object,
});

const emit = defineEmits(["update:isDialogOpen", "deleteStock"]);

const consumables = useAsset();

function closeDialog() {
  emit("update:isDialogOpen", false);
}

async function confirmDeleteStock() {
  try {
    if (!props.stockToDelete || !props.stockToDelete._id) {
      console.error("Stock to delete is not defined or ID is missing");
      return;
    }
    await consumables.deleteAsset(props.stockToDelete._id); // Call the delete function
    emit("deleteStock"); // Emit the deletion event
    closeDialog(); // Close the dialog
  } catch (error) {
    console.error("Error deleting stock:", error);
  }
}

function updateModelValue(value) {
  emit("update:isDialogOpen", value);
}
</script>

<style scoped>
.icon-background {
  background-color: #bd333360;
  /* Red with 0.25 opacity */
  border-radius: 50%;
  padding: 40px;
  /* Adjust padding to fit the icon properly */
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-primary-text {
  color: #031c34;
}
</style>
