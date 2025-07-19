<template>
  <v-row class="fill-height header-row" justify="center" align="center">
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-card class="pa-7 rounded-lg">
        <v-row dense no-gutters>
          <BackButton />
        </v-row>
        <v-row dense class="" align="center" justify="center">
          <v-col cols="12" class="text-center text-primary-text">
            <h4
              class="text-h4 font-weight-regular text-primary text-capitalize mb-0"
            >
              Maintenance Report
            </h4>
            <h5
              class="text-h5 font-weight-regular text-primary-text text-uppercase mb-0"
            >
              {{ maintenance?.assetName }}
            </h5>
            <h6
              class="text-subtitle-1 font-weight-regular text-fontgray text-uppercase mb-0"
            >
              {{ maintenance?.assetDescription }}
            </h6>
          </v-col>
        </v-row>

        <v-row dense align="center" justify="center">
          <v-col cols="12" lg="5">
            <v-row dense align="stretch" justify="space-between">
              <!-- Status Card -->
              <v-col cols="12" lg="12" class="mb-3">
                <v-card
                  class="rounded-lg pa-10 border-md border-color"
                  elevation="0"
                >
                  <v-row class="text-h6 d-flex align-center justify-start">
                    <span>Status</span>
                    <v-chip
                      :color="getStatusColor(maintenance.status)"
                      class="text-capitalize px-2 ms-1 font-weight-regular"
                      size="small"
                    >
                      <v-icon size="small" class="me-1">mdi-circle</v-icon>
                      {{ maintenance?.status }}
                    </v-chip>
                  </v-row>
                  <v-row>
                    <p
                      v-if="maintenance?.status == 'pending'"
                      class="text-body-2 text-fontgray mt-2 font-weight-regular"
                    >
                      The maintenance request form has been submitted and is
                      awaiting acknowledgement from the head officer.
                    </p>
                    <p
                      v-if="
                        maintenance?.status == 'scheduled' ||
                        maintenance?.status == 'rescheduled'
                      "
                      class="text-body-2 text-fontgray mt-2 font-weight-regular"
                    >
                      The maintenance has been scheduled by the maintenance
                      process is underway.
                      <span v-if="isAdmin"
                        >Please remember to click the "Mark as Completed" button
                        to submit a report once the maintenance is
                        completed.</span
                      >
                    </p>

                    <p
                      v-if="maintenance?.status == 'completed'"
                      class="text-body-2 text-fontgray mt-2 font-weight-regular"
                    >
                      The maintenance request has been marked as completed by
                      {{ maintenance.completedByName }} .
                    </p>
                  </v-row>
                </v-card>
              </v-col>

              <!-- Details Card -->
              <v-col cols="12" lg="12" class="mb-3">
                <v-card
                  class="rounded-lg pa-5 border-md border-color"
                  elevation="0"
                >
                  <v-row
                    class="text-h6 mb-2 font-weight-medium text-primary-text"
                  >
                    <v-col cols="12">Details</v-col>
                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px">mdi-pound</v-icon>
                        <span>Maintenance Code:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6"
                      ><v-row align="center" no-gutters
                        ><span
                          class="text-primary-text text-body-2 font-weight-regular"
                          >{{ maintenance.code }}</span
                        ></v-row
                      >
                    </v-col>

                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px"
                          >mdi-account-circle-outline</v-icon
                        >
                        <span>Assignee:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6"
                      ><v-row align="center" no-gutters
                        ><span
                          class="text-primary-text text-body-2 font-weight-regular"
                          >{{ maintenance.assigneeName }}</span
                        ></v-row
                      >
                    </v-col>

                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px"
                          >mdi-office-building</v-icon
                        >
                        <span>Office:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6"
                      ><v-row align="center" no-gutters
                        ><span
                          class="text-primary-text text-capitalize text-body-2 font-weight-regular"
                          >{{ maintenance.officeName }}</span
                        ></v-row
                      >
                    </v-col>

                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px"
                          >mdi-calendar-month-outline</v-icon
                        >
                        <span>Date Requested:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6">
                      <v-row align="center" no-gutters>
                        <span
                          class="text-primary-text text-capitalize text-body-2 font-weight-regular"
                        >
                          {{
                            new Date(maintenance.createdAt)
                              .toDateString()
                              .slice(4)
                          }}
                        </span>
                      </v-row>
                    </v-col>

                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px"
                          >mdi-calendar-month-outline</v-icon
                        >
                        <span>Date of Maintenance:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6"
                      ><v-row align="center" no-gutters
                        ><span
                          class="text-primary-text text-capitalize text-body-2 font-weight-regular"
                          >{{ maintenance.scheduledAt || "TBA" }}</span
                        ></v-row
                      >
                    </v-col>

                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px"
                          >mdi-alert-circle-outline</v-icon
                        >
                        <span>Issue:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6"
                      ><v-row align="center" no-gutters
                        ><span
                          class="text-primary-text text-capitalize text-body-2 font-weight-regular"
                          >{{ maintenance.issue }}</span
                        ></v-row
                      >
                    </v-col>

                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px"
                          >mdi-hammer-wrench</v-icon
                        >
                        <span>Maintenance Type:</span>
                      </v-row>
                    </v-col>

                    <v-col cols="6"
                      ><v-row align="center" no-gutters
                        ><span
                          class="text-primary-text text-capitalize text-body-2 font-weight-regular"
                          >{{ maintenance.type }}</span
                        ></v-row
                      >
                    </v-col>

                    <v-col cols="6" v-if="maintenance?.status == 'rescheduled'">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px"
                          >mdi-hammer-wrench</v-icon
                        >
                        <span>Reason for Rescheduling:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6" v-if="maintenance?.status == 'rescheduled'">
                      <v-row align="center" no-gutters>
                        <span
                          class="text-primary-text text-capitalize text-body-2 font-weight-regular"
                        >
                          {{ maintenance.rescheduleReason || "N/A" }}
                        </span>
                      </v-row>
                    </v-col>
                    <v-col cols="6" v-if="maintenance?.status == 'completed'">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-icon class="mr-2" size="18px">mdi-scroll</v-icon>
                        <span>Remarks:</span>
                      </v-row>
                    </v-col>
                    <v-col cols="6" v-if="maintenance?.status == 'completed'"
                      ><v-row align="center" no-gutters
                        ><span
                          class="text-primary-text text-capitalize text-body-2 font-weight-regular"
                          >{{ maintenance.remarks }}</span
                        ></v-row
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- Attachment Card -->
              <v-col
                v-if="maintenance?.status !== 'pending'"
                cols="12"
                lg="12"
                class="mb-3"
              >
                <v-card
                  class="rounded-lg pa-5 border-md border-color"
                  elevation="0"
                >
                  <v-row
                    class="text-h6 mb-2 font-weight-medium text-primary-text"
                  >
                    <v-col cols="12">Attachment</v-col>
                    <v-col cols="6">
                      <v-row
                        align="center"
                        no-gutters
                        class="text-subtitle-2 text-fontgray font-weight-medium"
                      >
                        <v-btn
                          v-if="maintenance?.attachment"
                          :href="`${getOrigin()}/api/public/${maintenance?.attachment}`"
                          target="_blank"
                          color="primary"
                          outlined
                        >
                          Preview
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row dense align="center" justify="center" class="mt-4">
          <v-btn
            v-if="isScheduling && maintenance.status !== 'scheduled' && isAdmin"
            color="primary"
            @click="openScheduleMaintenanceDialog"
            class="text-button px-5 mx-2"
            size="large"
            min-width="200px"
          >
            Schedule Maintenance
          </v-btn>
          <v-btn
            v-if="
              (isPersonnel || isOfficeChief) &&
              isCompleted &&
              maintenance.status !== 'completed'
            "
            color="primary"
            @click="openCompleteMaintenanceDialog"
            class="text-button px-5 mx-2"
            size="large"
            min-width="200px"
          >
            Mark as Completed
          </v-btn>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <!-- schedule maintenance dialog -->
  <v-dialog v-model="scheduleMaintenanceDialog" max-width="600">
    <v-card class="rounded-lg pa-2">
      <v-form v-model="valid" @submit.prevent="submit">
        <v-row no-gutters class="pa-8">
          <v-col cols="12" class="pb-5">
            <v-row justify="start">
              <span class="font-weight-regular text-h5">
                Schedule Maintenance
              </span>
            </v-row>
          </v-col>

          <v-col cols="12" class="mt-5">
            <InputLabel for="type" title="Maintenance Type" />
            <v-text-field
              v-model="maintenance.type"
              density="compact"
              variant="outlined"
              :rules="[requiredRule]"
              placeholder="Enter issue description"
            />
          </v-col>

          <v-col cols="12" class="mt-5">
            <InputLabel for="type" title="Maintenance Date" />
            <v-text-field
              v-model="maintenance.scheduledAt"
              type="date"
              density="compact"
              variant="outlined"
              :rules="[requiredRule]"
              placeholder="Enter issue description"
            />
          </v-col>

          <v-col cols="12" class="mt-2">
            <InputLabel for="attachment" title="Attachment" />
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
                        class="mt-3"
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
          </v-col>

          <v-col v-if="errorMessage" cols="12">
            <span class="text-error">{{ errorMessage }}</span>
          </v-col>

          <v-col cols="12" class="mt-6">
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn type="submit" color="primary" block :disabled="!valid">
                  Submit
                </v-btn>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn block @click="closeScheduleMaintenanceDialog"
                  >Cancel</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>

  <!-- mark as completed dialog -->
  <v-dialog v-model="completeMaintenanceDialog" max-width="600">
    <v-card class="rounded-lg pa-2">
      <v-form v-model="valid" @submit.prevent="submit">
        <v-row no-gutters class="pa-8">
          <v-col cols="12" class="pb-5">
            <v-row justify="start">
              <span class="font-weight-regular text-h5"> Remarks </span>
            </v-row>
          </v-col>

          <v-col cols="12" class="mt-5">
            <InputLabel for="remarks" title="Remarks" />
            <v-textarea
              v-model="maintenance.remarks"
              density="compact"
              variant="outlined"
              :rules="[requiredRule]"
              placeholder="Enter Remarks"
            />
          </v-col>

          <v-col v-if="errorMessage" cols="12">
            <span class="text-error">{{ errorMessage }}</span>
          </v-col>

          <v-col cols="12" class="mt-6">
            <v-row>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn
                  @click="completeSubmit()"
                  color="primary"
                  block
                  :disabled="!valid"
                >
                  Submit
                </v-btn>
              </v-col>
              <v-col cols="12" lg="6" md="6" sm="6">
                <v-btn block @click="closeCompleteMaintenanceDialog"
                  >Cancel</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  _id: { type: String, default: "" },
  mode: { type: String, default: "view" },
  id: { type: String },
});
const errorMessage = ref("");
const {
  getStatusColor,
  isAdminHead,
  isPersonnel,
  isAdmin,
  isOfficeChief,
  goBack,
  requiredRule,
} = useUtils();

const isRead = computed(() => props.mode === "view");
const isScheduling = computed(() => props.mode === "schedule");
const isCompleted = computed(() => props.mode === "complete");
const isCreate = computed(() => props.mode === "create");

const id = computed(() => {
  return !isCreate.value ? (useRoute().params.id as string) || "" : "";
});

const {
  getMaintenanceById,
  scheduleMaintenance,
  maintenance,
  completeMaintenance,
} = useMaintenance();

const _getMaintenanceById = async () => {
  if (isCreate.value) {
    return;
  }

  try {
    const result = await getMaintenanceById(id.value);
    maintenance.value = result;
  } catch (error) {
    console.error("Error fetching transfer details:", error);
  }
};

_getMaintenanceById();

const { currentUser } = useLocalAuth();
const { getOrigin } = useUtils();
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
    maintenance.value.attachment = res?.id;
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

const scheduleMaintenanceDialog = ref(false);
const completeMaintenanceDialog = ref(false);

const valid = ref(false);

function openScheduleMaintenanceDialog() {
  scheduleMaintenanceDialog.value = true;
}

function closeScheduleMaintenanceDialog() {
  scheduleMaintenanceDialog.value = false;
}

function openCompleteMaintenanceDialog() {
  completeMaintenanceDialog.value = true;
}

function closeCompleteMaintenanceDialog() {
  completeMaintenanceDialog.value = false;
}

const submit = async () => {
  try {
    if (!maintenance.value || !id.value) return;

    await scheduleMaintenance(
      {
        type: maintenance.value.type,
        scheduledAt: maintenance.value.scheduledAt,
        attachment: maintenance.value.attachment || "",
      } satisfies TScheduleCreate,
      id.value
    );

    maintenance.value = {
      ...maintenance.value,
      scheduledAt: "",
      attachment: "",
    };

    errorMessage.value = "";
    closeScheduleMaintenanceDialog();
    _getMaintenanceById();
  } catch (error) {
    console.error("Error scheduling maintenance:", error);
  }
};

const completeSubmit = async () => {
  try {
    if (!maintenance.value || !id.value || !currentUser.value) return;

    const payload: TCompleteCreate = {
      remarks: maintenance.value.remarks,
      completedBy: currentUser.value._id,
    };

    await completeMaintenance(payload, id.value);

    maintenance.value = {
      ...maintenance.value,
      remarks: "",
    };

    errorMessage.value = "";
    closeCompleteMaintenanceDialog();
    _getMaintenanceById();
  } catch (error) {
    console.error("Error scheduling maintenance:", error);
  }
};
</script>
