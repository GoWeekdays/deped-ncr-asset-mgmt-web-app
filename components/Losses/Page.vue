<template>
  <v-row
    v-if="isCreate"
    class="py-5 fill-height"
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="12" md="12" lg="12">
      <v-row justify="center" align="start">
        <v-col cols="12">
          <v-card class="border-b-sm rounded-lg" elevation="1">
            <v-row class="py-5 px-5" align="center" justify="space-between">
              <v-col cols="auto" class="text-start text-primary-text">
                <h4
                  class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
                >
                  {{ lostMaterialCreateTitle }}
                </h4>
              </v-col>

              <v-col cols="auto" class="d-flex justify-end">
                <v-btn
                  color="primary"
                  class="me-2 text-button"
                  @click="submit()"
                  :disabled="!isValid"
                >
                  Submit
                </v-btn>

                <v-btn color="fontgray" variant="outlined" @click="goBack">
                  Cancel
                </v-btn>
              </v-col>
            </v-row>
          </v-card></v-col
        >
      </v-row>

      <v-form
        v-model="isValid"
        class="text-primary-text font-weight-medium text-subtitle-2"
        ref="generalInfoForm"
      >
        <v-row dense class="pt-4" fill-height justify="center" align="start">
          <v-col cols="12" lg="12" md="12">
            <v-row dense>
              <v-col cols="12" lg="12" md="12" class="mb-4">
                <v-card class="pa-5 rounded-lg" elevation="3">
                  <v-row dense>
                    <v-col class="mb-4">
                      <v-row dense class="mb-5">
                        <p
                          class="text-fontgray text-caption font-weight-regular"
                        >
                          {{ lostMaterialCreateSubtitle }}
                        </p>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <v-form
                        v-model="isItemValid"
                        class="text-primary-text font-weight-medium text-subtitle-2"
                        ref="stockManagementForm"
                      >
                        <v-row dense align="center" justify="center">
                          <v-col cols="6">
                            <InputLabel
                              v-if="isRLSDDSP"
                              for="icsNo"
                              title="ICS No"
                            />
                            <InputLabel
                              v-if="isRLSDDP"
                              for="icsNo"
                              title="PAR No"
                            />
                            <v-autocomplete
                              v-model="selectedItemNo"
                              :items="lost"
                              item-value="value"
                              item-title="title"
                              item-disabled="disabled"
                              variant="outlined"
                              density="compact"
                              class="mt-0"
                              placeholder="Select an Item"
                              hide-no-data
                              hide-selected
                              :rules="[requiredRule]"
                              :search="search"
                              @keydown.enter="_getAssetTransfer(search)"
                              @update:search="setSearch"
                              @update:modelValue="
                                setSelectedItem(selectedItemNo.value)
                              "
                              @change="onItemSelect"
                            />
                          </v-col>

                          <v-col cols="4">
                            <InputLabel for="itemNo" title="Item No." />
                            <v-autocomplete
                              v-model="selectedStock"
                              :items="itemOptions"
                              variant="outlined"
                              density="compact"
                              class="mt-0"
                              placeholder="Select an Item No"
                              hide-no-data
                              hide-selected
                              :rules="[requiredRule]"
                              :disabled="!selectedItemNo"
                              @change="onItemSelect"
                              item-value="stockId"
                              item-title="itemNo"
                            />
                          </v-col>

                          <v-col cols="2">
                            <v-btn
                              block
                              class="py-4"
                              color="primary"
                              @click="addItem()"
                              :disabled="
                                !!isItemValid === false || !!itemExists
                              "
                            >
                              Add To List
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-col>

                    <v-col cols="12" class="mt-2">
                      <div
                        style="
                          max-height: calc(100vh - 320px);
                          overflow-y: auto;
                        "
                      >
                        <v-data-table
                          :headers="headers"
                          :items="tableItems"
                          class="text-primary-text border-thin text-capitalize"
                          density="compact"
                          fixed-header
                          hide-default-footer
                        >
                          <template #item.cost="{ item }">
                            ₱&nbsp;{{ formatNumber(item.cost) }}
                          </template>

                          <template #item.issuedAt="{ item }">
                            {{
                              new Date(item.issuedAt).toDateString().slice(4)
                            }}
                          </template>

                          <template #item.actions="{ item, index }">
                            <v-row
                              align="center"
                              justify="center"
                              class="pa-0 ma-0"
                            >
                              <v-col>
                                <v-icon
                                  @click="removeItem(index)"
                                  color="text-primary-text"
                                  style="cursor: pointer"
                                >
                                  mdi-minus-box-outline
                                </v-icon>
                              </v-col>
                            </v-row>
                          </template>
                        </v-data-table>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" lg="8" md="7" class="mb-4">
                <v-card class="pa-5 rounded-lg" elevation="3">
                  <v-row dense justify="center" align="start">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <InputLabel
                          for="selectType"
                          title="Status of Property"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-radio-group
                          v-model="lostMaterial.lossStatus"
                          inline
                          :rules="[requiredRule]"
                        >
                          <v-radio label="Lost" value="lost"></v-radio>
                          <v-radio label="Stolen" value="stolen"></v-radio>
                          <v-radio label="Damaged" value="damaged"></v-radio>
                          <v-radio
                            label="Destroyed"
                            value="destroyed"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                    <v-col cols="12">
                      <InputLabel
                        for="policeNotified"
                        title="Police Notified?"
                      />
                      <v-radio-group
                        v-model="lostMaterial.policeNotified"
                        inline
                      >
                        <v-radio label="Yes" value="yes"></v-radio>
                        <v-radio label="No" value="no"></v-radio>
                      </v-radio-group>
                    </v-col>

                    <v-row v-if="lostMaterial?.policeNotified === 'yes'">
                      <v-col cols="8">
                        <InputLabel
                          for="policeStation"
                          title="Police Station"
                        />
                        <v-text-field
                          v-model="lostMaterial.policeStation"
                          density="compact"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <InputLabel for="date" title="Date" />
                        <v-text-field
                          v-model="lostMaterial.policeReportDate"
                          type="date"
                          density="compact"
                          variant="outlined"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-col cols="12">
                      <InputLabel for="circumstances" title="Circumstances" />
                      <v-textarea
                        v-model="lostMaterial.circumstances"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12" lg="4" md="5">
                <v-card
                  class="pa-5 mb-5 rounded-lg"
                  elevation="3"
                  v-if="lostMaterial?.policeNotified === 'yes'"
                >
                  <label
                    for="itemInfo"
                    class="text-uppercase text-fontgray text-subtitle-2"
                  >
                    add attachment of police report
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
                </v-card>
                <v-card class="pa-5 rounded-lg" elevation="3">
                  <v-row dense class="mt-2">
                    <v-col cols="12">
                      <InputLabel
                        for="governmentIssuedId"
                        title="Goverment Issued ID"
                      />
                      <v-text-field
                        v-model="lostMaterial.governmentId"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12">
                      <InputLabel for="IdNo" title="ID No." />
                      <v-text-field
                        v-model="lostMaterial.governmentIdNo"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>

                    <v-col cols="12">
                      <InputLabel for="dateIssued" title="Date Issued" />
                      <v-text-field
                        v-model="lostMaterial.governmentIdDate"
                        type="date"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-col>
  </v-row>

  <v-row
    v-if="!isCreate"
    class="py-5 fill-height"
    justify="center"
    align="center"
  >
    <v-col cols="12" sm="10" md="9" lg="11">
      <v-card class="pa-6 rounded-lg">
        <v-row no-gutters>
          <v-row no-gutters>
            <v-col cols="12" class="align-items-center mb-3 ml-5">
              <BackButton />
            </v-col>
          </v-row>

          <v-row no-gutters align="center" justify="space-between">
            <v-col cols="auto">
              <h4
                class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
              >
                Report of Lost, Stolen, Damaged or Destroyed Property
              </h4>
            </v-col>

            <v-col
              cols="auto"
              v-if="isOfficeChief && lostMaterial?.status !== 'approved'"
            >
              <v-btn
                color="primary"
                class="text-button px-5"
                size="large"
                @click="updateApprovedStatus"
                min-width="200px"
                large
              >
                Approve
              </v-btn>
            </v-col>
            <v-col
              cols="auto"
              v-if="
                isAdmin && isCompleted && lostMaterial?.status !== 'completed'
              "
            >
              <v-btn
                color="primary"
                class="text-button px-5"
                size="large"
                @click="updateCompletedStatus"
                min-width="200px"
                large
              >
                Mark as Complete
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-icon size="large" class="text-primary-text" v-bind="props">
                    mdi-dots-horizontal
                  </v-icon>
                </template>
                <v-list>
                  <v-list-item
                    :to="{
                      name: 'waste-and-losses-losses-print-id',
                    }"
                    link
                  >
                    <v-icon size="medium" class="me-2"
                      >mdi-printer-outline</v-icon
                    >Print
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-row>

        <v-divider></v-divider>

        <v-row class="py-4">
          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Entity Name</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.entityName }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Fund Cluster</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.fundCluster }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              Department/Office
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.officeName }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label
              v-if="label"
              class="text-fontgray text-body-2 font-weight-regular"
            >
              {{ label }} No.
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.lossNo }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              Accountable Officer
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.officerName }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >{{ label }} Date</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{
                lostMaterial?.createdAt
                  ? new Date(lostMaterial.createdAt).toDateString().slice(4)
                  : ""
              }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Designation</label
            >
            <div
              class="text-subtitle-1 text-primary-text text-capitalize font-weight-regular mt-1"
            >
              {{ lostMaterial?.officerDesignation }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <span class="text-fontgray font-weight-regular text-body-2"
              >{{ ParIcs }} No.</span
            >
            <div
              class="text-subtitle-1 text-primary-text text-capitalize font-weight-regular mt-1"
            >
              {{ lostMaterial?.issueSlipNo }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <span class="text-fontgray font-weight-regular text-body-2"
              >Status of Property</span
            >
            <div
              class="text-subtitle-1 text-primary-text text-capitalize font-weight-regular mt-1"
            >
              <v-chip
                :color="getStatusColor(lostMaterial.status || 'default')"
                size="small"
              >
                <v-icon size="small" class="me-1">mdi-circle</v-icon
                >{{ lostMaterial?.status || "N/A" }}
              </v-chip>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <span class="text-fontgray font-weight-regular text-body-2"
              >{{ ParIcs }} Date</span
            >
            <div
              class="text-subtitle-1 text-primary-text text-capitalize font-weight-regular mt-1"
            >
              {{
                lostMaterial?.issuedAt
                  ? new Date(lostMaterial.issuedAt).toDateString().slice(4)
                  : ""
              }}
            </div>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row class="py-4">
          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Police Notified</label
            >
            <div
              class="text-subtitle-1 text-capitalized text-primary-text font-weight-regular mt-1 text-capitalize"
            >
              {{ lostMaterial?.policeNotified }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular"
              >Date</label
            >
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.policeReportDate || "N/A" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              Police Station
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.policeStation || "N/A" }}
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              Attachment of Police Report
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              <nuxt-link
                v-if="lostMaterial?.attachment"
                :href="`${getOrigin()}/api/public/${lostMaterial?.attachment}`"
                target="__blank"
              >
                Preview
              </nuxt-link>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-data-table
              :items="tableItems"
              :headers="headers"
              density="compact"
              hide-default-footer
              class="border-thin"
            >
              <template #item.issuedAt="{ item }">
                {{ new Date(item.issuedAt).toDateString().slice(4) }}
              </template>

              <template v-slot:item.cost="{ item }">
                ₱&nbsp;{{ formatNumber(item.cost) }}
              </template>
              <template #item.actions="{ item, index }">
                <v-row align="center" justify="center" class="pa-0 ma-0">
                  <v-col>
                    <v-icon
                      @click="removeItem(index)"
                      color="text-primary-text"
                      style="cursor: pointer"
                    >
                      mdi-minus-box-outline
                    </v-icon>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-col>
          <v-col cols="12" md="6">
            <label class="text-fontgray text-body-2 font-weight-regular">
              Circumstances
            </label>
            <div
              class="text-subtitle-1 text-primary-text font-weight-regular mt-1"
            >
              {{ lostMaterial?.circumstances }}
            </div>
          </v-col>
          <v-divider class="pt-2"></v-divider>
        </v-row>

        <v-row
          class="my-5 text-primary-text"
          align="start"
          justify="space-between"
        >
          <v-col cols="12" lg="9">
            <v-row>
              <v-col cols="7" class="py-0">
                <label class="text-primary">
                  I hereby certify that the items/circumstances stated above are
                  true and correct.</label
                >

                <v-row>
                  <v-col cols="12" class="pt-5">
                    <!-- Display Name -->
                    <div>
                      {{ lostMaterial?.officerName || "N/A" }}
                    </div>
                  </v-col>

                  <v-col cols="12" class="py-0">
                    <!-- Display Designation -->
                    <div class="text-caption text-capitalize">
                      <!-- {{ lostMaterial?.officerDesignation || "N/A" }} -->
                      Accountable Officer
                    </div>
                  </v-col>

                  <v-col cols="12" class="py-0">
                    <!-- Display Date -->
                    <div class="text-caption text-capitalize">
                      {{
                        lostMaterial?.createdAt
                          ? new Date(lostMaterial.createdAt)
                              .toDateString()
                              .slice(4)
                          : ""
                      }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" lg="3">
            <v-row>
              <v-col cols="12" class="py-0">
                <label class="text-primary">Noted By</label>
              </v-col>

              <template v-if="lostMaterial?.supervisorName">
                <v-col cols="12" class="py-0">
                  <!-- Display Name -->
                  <div>
                    {{ lostMaterial?.supervisorName || "N/A" }}
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <div class="text-caption text-capitalize">
                    Immediate Supervisor
                  </div>
                </v-col>

                <v-col cols="12" class="py-0">
                  <!-- Display Date -->
                  <div class="text-caption text-capitalize">
                    {{
                      lostMaterial?.supervisorDate
                        ? new Date(lostMaterial.supervisorDate)
                            .toDateString()
                            .slice(4)
                        : ""
                    }}
                  </div>
                </v-col>
              </template>

              <template v-else>
                <v-col cols="12" class="py-0">
                  <div class="text-caption">
                    Request is pending approval from the admin. Please wait.
                  </div>
                </v-col>
              </template>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="py-0">
            <v-row dense class="text-caption text-capitalize">
              <v-col cols="12">
                Government Issued ID:
                <strong>{{ lostMaterial?.governmentId || "N/A" }}</strong>
              </v-col>
            </v-row>
            <v-row dense class="text-caption text-capitalize">
              <v-col cols="12">
                ID Issued:
                <strong>{{ lostMaterial?.governmentIdNo || "N/A" }}</strong>
              </v-col>
            </v-row>
            <v-row dense class="text-caption text-capitalize">
              <v-col cols="12">
                Date Issued:
                <strong>{{ lostMaterial?.governmentIdDate || "N/A" }}</strong>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
const props = defineProps({
  _id: { type: String, default: "" },
  mode: { type: String, default: "view" },
  id: { type: String },
});

const { formatNumber } = useUtils();
const errorMessage = ref("");

const {
  getStatusColor,
  isAdminHead,
  isAdmin,
  isOfficeChief,
  goBack,
  requiredRule,
} = useUtils();

const isRead = computed(() => props.mode === "view");
const isApproving = computed(() => props.mode === "approving");
const isCompleted = computed(() => props.mode === "completed");
const isCreate = computed(() => props.mode === "create");

const label = computed(() =>
  isRLSDDSP.value ? "RLSDDSP" : isRLSDDP.value ? "RLSDDP" : ""
);

const ParIcs = computed(() =>
  isRLSDDSP.value ? "ICS" : isRLSDDP.value ? "PAR" : ""
);

const id = computed(() => {
  return !isCreate.value ? (useRoute().params.id as string) || "" : "";
});

const {
  getLostMaterialById,
  createLossMaterial,
  updateApproveStatus,
  updateCompleteStatus,
  lostMaterialCreateTitle,
  lostMaterialCreateSubtitle,
  getAssetReturnedItemNo,
  lostMaterial,
  isRLSDDP,
  isRLSDDSP,
  issueSlips,
} = useLostMaterial();

const _getLostById = async () => {
  if (isCreate.value) return;

  try {
    const result = await getLostMaterialById(id.value);
    lostMaterial.value = { ...result };

    if (result.itemStocks) {
      tableItems.value = result.itemStocks.map((item: any) => ({
        itemNo: item.itemNo,
        stockId: item.stockId,
        stockNumber: item.stockNumber,
        description: item.description,
        cost: item.cost,
        issuedAt: item.issuedAt,
        issueSlipNo: item.issueSlipNo,
        issueSlipId: item.issueSlipId,
      }));
    }
  } catch (error) {
    console.error("Error fetching lost material:", error);
  }
};

_getLostById();

// const tableItems = computed(() => {
//   if (!lostMaterial.value) return [];

//   return [
//     {
//       stockId: lostMaterial.value.stockId,
//       stockNumber: lostMaterial.value.stockNumber,
//       description: lostMaterial.value.description,
//       cost: lostMaterial.value.cost,
//     },
//   ];
// });

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
    lostMaterial.value.attachment = res?.id;
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

const headers = computed<
  { title: string; value: string; align?: "start" | "end" | "center" }[]
>(() => {
  const items: {
    title: string;
    value: string;
    align?: "start" | "end" | "center";
  }[] = [];

  if (!isCreate.value) {
    items.push(
      { title: "Property No", value: "stockNumber" },
      { title: "Item No", value: "itemNo" },
      { title: "Description", value: "description" },
      { title: "Acquisition Cost", value: "cost", align: "center" }
    );
  }

  if (isCreate.value) {
    items.push(
      { title: "Property No", value: "stockNumber" },
      { title: "Item No", value: "itemNo" },
      { title: `${ParIcs.value} Date`, value: "issuedAt" },
      { title: "Description", value: "description" },
      { title: "Acquisition Cost", value: "cost", align: "center" },
      { title: "Actions", value: "actions" }
    );
  }

  return items;
});

const { getIssueSlipsByReceiver, search } = useLostMaterial();

async function submit() {
  const type = isRLSDDSP.value ? "RLSDDSP" : isRLSDDP.value ? "RLSDDP" : "";

  const itemStocks = tableItems.value.map((item) => ({
    stockId: item.stockId,
  }));

  const payload: TLostCreate = {
    type,
    lossStatus: lostMaterial.value.lossStatus || "",
    itemStocks,
    policeNotified: lostMaterial.value.policeNotified,
    policeStation: lostMaterial.value.policeStation || "",
    policeReportDate: lostMaterial.value.policeReportDate || "",
    attachment: attachment.value || "",
    circumstances: lostMaterial.value.circumstances || "",
    governmentId: lostMaterial.value.governmentId || "",
    governmentIdNo: lostMaterial.value.governmentIdNo || "",
    governmentIdDate: lostMaterial.value.governmentIdDate || "",
  };

  try {
    await createLossMaterial(payload);
    goBack();
  } catch (error) {
    console.error("Error creating loss material:", error);
  }
}

async function updateApprovedStatus() {
  if (!id.value) return;

  try {
    await updateApproveStatus(id.value);

    if (isRLSDDP.value) {
      useRouter().push("/waste-and-losses/rlsddp");
    } else if (isRLSDDSP.value) {
      useRouter().push("/waste-and-losses/rlsddsp");
    }
  } catch (error) {
    console.error("Error updating approval status:", error);
  }
}

async function updateCompletedStatus() {
  if (!id.value) return;

  try {
    await updateCompleteStatus(id.value);

    if (isRLSDDP.value) {
      useRouter().push("/waste-and-losses/rlsddp");
    } else if (isRLSDDSP.value) {
      useRouter().push("/waste-and-losses/rlsddsp");
    }
  } catch (error) {
    console.error("Error updating approval status:", error);
  }
}

const { debounce } = useUtils();

const isValid = ref(false);
const loading = ref(false);

const removeItem = (index: number) => {
  tableItems.value.splice(index, 1);
};
const isItemValid = ref(false);
const selectedItemNo = ref();
const selectedStock = ref<string | null>(null);
const items = ref();
const itemOptions = ref<TIssueLoss[]>([]);
const tableItems = ref<TIssueLoss[]>([]);
const lost = ref<Array<TSearchItem>>([]);

type TSearchItem = {
  title: string;
  value: TKeyValuePair;
};

const _getAssetTransfer = debounce(async (_search = "") => {
  try {
    const res = await getIssueSlipsByReceiver({
      page: 1,
      search: _search,
      limit: 20,
    });
    const _items = res.items;

    lost.value = _items.map((i) => ({
      title: `${i.issueSlipNo}`,
      value: i.issueSlipId,
    }));
  } catch (error) {
    console.error("Error fetching assets:", error);
  }
}, 300);

const _getAssetByItemNo = async (assetId: "") => {
  try {
    const res = await getAssetReturnedItemNo({
      assetId,
    });
    return res.items;
  } catch (error) {
    console.error("Error fetching stock items:", error);
    return [];
  }
};

function setSearch(value: "") {
  search.value = value;
}

const item = reactive<Partial<TIssueLoss>>({
  issueSlipNo: "",
  issueSlipId: "",
  issuedAt: "",
  itemNo: "",
  stockId: "",
  stockNumber: "",
  description: "",
  cost: 0,
});

function setSelectedItem(value = {} as TIssueLoss) {
  item.issueSlipId = value.issueSlipId ?? "";
  item.issueSlipNo = value.issueSlipNo ?? "";
  item.issuedAt = value.issuedAt ?? "";
  item.itemNo = value.itemNo ?? "";
  item.stockId = value.stockId ?? "";
  item.stockNumber = value.stockNumber ?? "";
  item.cost = 1;
  item.description = value.description ?? 0;
}

const onItemSelect = async () => {
  if (!selectedItemNo.value) {
    itemOptions.value = [];
    return;
  }

  const selectedId = selectedItemNo.value;
  loading.value = true;
  try {
    const response = await _getAssetByItemNo(selectedId);
    itemOptions.value = response;
  } catch (error) {
    console.error("Error fetching stock items:", error);
    itemOptions.value = [];
  } finally {
    loading.value = false;
  }
};

watch([selectedItemNo], async () => {
  if (selectedItemNo.value) {
    await onItemSelect();
  } else {
    items.value = [];
    lostMaterial.value.issuedAt = "";
  }
});

if (isCreate.value) {
  _getAssetTransfer();
}

const addItem = () => {
  if (!selectedItemNo.value || !selectedStock.value) {
    return;
  }

  const selectedItem = itemOptions.value.find(
    (item) => String(item.stockId) === String(selectedStock.value)
  );

  if (selectedItem) {
    const exists = tableItems.value.some(
      (item) => String(item.stockId) === String(selectedItem.stockId)
    );

    if (!exists) {
      tableItems.value.push({
        issueSlipId: selectedItem.issueSlipId,
        issueSlipNo: selectedItem.issueSlipNo,
        stockId: selectedItem.stockId,
        itemNo: selectedItem.itemNo,
        stockNumber: selectedItem.stockNumber,
        description: selectedItem.description,
        cost: selectedItem.cost,
        issuedAt: selectedItem.issuedAt,
      });

      selectedItemNo.value = null;
      selectedStock.value = null;
      isItemValid.value = false;
    } else {
      console.log("Item already exists in table");
    }
  } else {
    console.log("Selected item not found in options");
  }
};

const itemExists = computed(() => {
  return (
    selectedStock.value &&
    tableItems.value.some((item) => item.stockId === selectedStock.value)
  );
});
</script>
