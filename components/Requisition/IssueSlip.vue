<template>
  <v-row v-if="isCreate" justify="center" align="start">
    <v-col cols="12">
      <v-card class="border-b-sm rounded-lg" elevation="1">
        <v-row class="py-5 px-5" align="center" justify="space-between">
          <!-- Back button -->
          <v-col
            v-if="!isCreate"
            cols="12"
            class="align-items-center mb-3 ml-5"
          >
            <BackButton />
          </v-col>

          <!-- Main Content -->
          <v-col cols="6" class="pa-3">
            <v-row align="center" no-gutters>
              <v-col cols="auto">
                <h4
                  class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
                >
                  REQUISITION AND ISSUE SLIP
                </h4>
              </v-col>

              <v-col cols="auto">
                <v-chip
                  v-if="requisition?.status && !isCreate"
                  :color="getStatusColor(requisition.status)"
                  class="ml-2 text-capitalize"
                  small
                >
                  {{ requisition?.status }}
                </v-chip>
              </v-col>
            </v-row>
            <p class="text-fontgray text-caption">
              Request for consumable items. Please fill out all required fields
              to submit your request.
            </p>
          </v-col>

          <!-- Button Components -->
          <v-col cols="6" class="text-end">
            <RequisitionButtons
              v-if="isCreate"
              :buttons="createButtons"
              @action="handleButtonAction"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>

  <v-row dense no-gutter class="mt-2">
    <v-col cols="12">
      <v-card class="pb-2 position-relative rounded-lg">
        <v-row no-gutters class="pa-4">
          <v-col cols="12">
            <v-row v-if="!isCreate" no-gutters>
              <!-- Back button -->
              <v-col cols="4" class="align-center">
                <v-btn
                  v-if="!(isCreate || isEvaluating || isIssued)"
                  icon
                  class="me-10 text-fontgray text-capitalize"
                  elevation="0"
                  @click="goBack()"
                >
                  <v-icon>mdi-chevron-left</v-icon>Back
                </v-btn>
              </v-col>

              <v-col cols="4" class="text-center">
                <v-row align="center" justify="center" no-gutters>
                  <v-col cols="auto">
                    <h4
                      class="text-h4 font-weight-regular text-primary text-uppercase mb-0"
                    >
                      REQUISITION AND ISSUE SLIP
                    </h4>
                  </v-col>
                </v-row>

                <p
                  class="text-caption text-secondary py-2"
                  v-if="requisition?.status === 'cancelled' && isRead"
                >
                  <span class="font-weight-medium">Remarks:</span>
                  {{ requisition?.remarks }}
                </p>
              </v-col>

              <v-col cols="4" class="text-end">
                <RequisitionButtons
                  v-if="isCreate"
                  :buttons="createButtons"
                  @action="handleButtonAction"
                />
                <RequisitionButtons
                  v-if="isEvaluating"
                  :buttons="evaluatingButtons"
                  @action="handleButtonAction"
                />
                <RequisitionButtons
                  v-if="isReview"
                  :buttons="reviewButtons"
                  @action="handleButtonAction"
                />
                <RequisitionButtons
                  v-if="isIssued"
                  :buttons="issuedButtons"
                  @action="handleButtonAction"
                />
                <v-menu v-if="isAdmin && requisition?.status === 'issued'">
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
                        name: 'requisition-and-issue-slips-print-id',
                      }"
                      link
                    >
                      <v-icon size="medium" class="me-2">mdi-eye-outline</v-icon
                      >Preview
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12" v-if="isCreate">
            <v-row no-gutters>
              <v-col cols="12" class="mt-3">
                <input-label for="RCC" title="Purpose" required />
                <v-textarea
                  v-model="requisition.purpose"
                  :rules="[requiredRule]"
                  no-resize
                />
              </v-col>

              <v-row class="mt-1" justify="center" align="start">
                <v-col cols="12">
                  <v-row>
                    <v-col>
                      <label class="text-primary font-weight-regular text-h5"
                        >Request Items</label
                      >
                    </v-col>
                  </v-row>
                  <v-form class="text-primary-text font-weight-medium">
                    <!-- Request Items -->
                    <v-row class="mt-2" v-if="showAddListItem">
                      <v-col cols="12">
                        <v-form
                          v-model="isItemValid"
                          class="text-primary-text font-weight-medium text-subtitle-2"
                          ref="stockManagementForm"
                        >
                          <v-row dense align="center">
                            <v-col cols="12" sm="4">
                              <input-label for="assetItem" title="Item Name" />
                              <v-autocomplete
                                v-model="selectedItem"
                                :items="itemOptions"
                                variant="outlined"
                                density="compact"
                                class="mt-0 text-capitalize"
                                placeholder="Select an Item"
                                hide-no-data
                                hide-selected
                                return-object
                                :search="search"
                                @keydown.enter="searchItem(search)"
                                @update:search="setSearch"
                                @update:model-value="
                                  setSelectedItem($event.value)
                                "
                                item-value="value"
                                item-title="title"
                              />
                            </v-col>
                            <v-col cols="12" sm="3">
                              <label class="">Stock No. </label>
                              <v-text-field
                                v-model="item.stockNumber"
                                variant="outlined"
                                density="compact"
                                disabled
                                hint=""
                                placeholder="Stock Number"
                              />
                            </v-col>
                            <v-col cols="12" sm="3">
                              <input-label
                                for="assetQuantity"
                                title="Quantity"
                              />
                              <v-text-field
                                v-model.number="item.requestQty"
                                variant="outlined"
                                density="compact"
                                class="mt-0"
                                type="number"
                                min="1"
                                :value="item.requestQty || 1"
                                placeholder="Quantity"
                              />
                            </v-col>
                            <v-col cols="12" sm="2">
                              <v-btn
                                color="primary"
                                block
                                class="py-5 mb-2 d-flex justify-center align-center"
                                @click="addItem(item)"
                                :disabled="!(isItemValid && item.requestQty)"
                              >
                                Add To List
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-form>
                      </v-col>
                    </v-row>

                    <!-- Stock List Table -->
                    <v-row>
                      <v-col cols="12">
                        <v-data-table
                          :headers="headers"
                          hide-default-footer
                          max-height="400"
                          fixed-header
                          class="border-thin text-capitalize"
                          density="compact"
                          :items="items"
                        >
                          <template v-slot:item.action="{ item }">
                            <v-icon
                              @click="removeItem(items.indexOf(item))"
                              color="text-primary-text"
                            >
                              mdi-minus-box-outline
                            </v-icon>
                          </template>

                          <template #no-data>
                            <div
                              class="text-center py-3 text-primary-text text-subtitle-2"
                            >
                              There are no items in the stock list. Click 'Add
                              to List' to get started.
                            </div>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>

                    <v-divider class="py-1"></v-divider>
                  </v-form>
                </v-col>
              </v-row>
            </v-row>
          </v-col>

          <!-- For readonly -->
          <v-col cols="12" v-if="isRead" class="pa-5">
            <v-row no-gutters>
              <RequisitionDetails
                :requisition="requisition"
                :getDivisionName="getDivisionName"
                :getOfficeName="getOfficeName"
                mode="view"
                id="requisition-id"
              />

              <v-data-table
                :items="_stocks"
                :headers="headers"
                hide-default-footer
                max-height="400"
                fixed-header
                class="border-thin"
              >
                <template #item.isAvailable="{ item }">
                  <span class="text-capitalize">{{ item.isAvailable }}</span>
                </template>
              </v-data-table>

              <v-row class="mt-5">
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Requested by"
                    :name="requisition?.requestedByName"
                    :designation="requisition?.requestedByDesignation"
                    :formattedDate="requisition?.createdAt"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Approved by"
                    :name="requisition?.approvedByName"
                    :designation="requisition?.approvedByDesignation"
                    :formattedDate="requisition?.approvedAt"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Issued by"
                    :name="requisition?.issuedByName"
                    :designation="requisition?.issuedByDesignation"
                    :formattedDate="requisition?.completedAt"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Received by"
                    :name="requisition?.receivedByName"
                    :designation="requisition?.receivedByDesignation"
                    :formattedDate="requisition?.completedAt"
                    :status="requisition?.status"
                  />
                </v-col>
              </v-row>
            </v-row>
          </v-col>

          <!-- For Evaluating -->
          <v-col cols="12" v-if="isEvaluating" class="pa-5">
            <v-row no-gutters>
              <RequisitionDetails
                :requisition="requisition"
                :getDivisionName="getDivisionName"
                :getOfficeName="getOfficeName"
                mode="evaluating"
                id="requisition-id"
              />

              <v-snackbar
                v-model="showErrorSnackbar"
                color="error"
                timeout="3000"
                top
                center
              >
                Max issue quantity is {{ errorStock }}

                <template v-slot:actions>
                  <v-btn
                    color="white"
                    variant="text"
                    @click="showErrorSnackbar = false"
                  >
                    Close
                  </v-btn>
                </template>
              </v-snackbar>

              <v-data-table
                v-model:expanded="expanded"
                :items="_stocks"
                :headers="headers"
                hide-default-footer
                max-height="400"
                fixed-header
                item-value="name"
                class="border-thin text-capitalize"
                show-expand
              >
                <template v-slot:[`item.issueQty`]="{ item }">
                  <v-row align="center" class="pa-0 ma-0">
                    <v-col>
                      <v-text-field
                        v-if="isEvaluating"
                        v-model.number="item.issueQty"
                        variant="outlined"
                        density="compact"
                        placeholder="Enter Issued Qty"
                        type="number"
                        min="0"
                        :max="item.stockQty"
                        :disabled="item.stockQty === 0"
                        :error="item.issueQty > item.stockQty"
                        class="my-auto"
                        @input="checkIssueQty(item)"
                      />
                      <span v-else class="my-auto">{{
                        item.issueQty || ""
                      }}</span>
                    </v-col>
                  </v-row>
                </template>

                <template v-slot:expanded-row="{ columns, item }">
                  <tr>
                    <td :colspan="columns.length">
                      <v-row align="center" class="pa-0 ma-0">
                        <v-col>
                          <v-text-field
                            v-if="isEvaluating"
                            v-model="item.remarks"
                            variant="outlined"
                            density="compact"
                            placeholder="Enter Remarks"
                            class="my-auto"
                          />
                          <span v-else class="my-auto">{{ item.remarks }}</span>
                        </v-col>
                      </v-row>
                    </td>
                  </tr>
                </template>
              </v-data-table>

              <v-row class="mt-5">
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Requested by"
                    :name="requisition?.requestedByName"
                    :designation="requisition?.requestedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Approved by"
                    :name="requisition?.approvedByName"
                    :designation="requisition?.approvedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Issued by"
                    :name="requisition?.issuedByName"
                    :designation="requisition?.issuedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Received by"
                    :name="requisition?.receivedByName"
                    :designation="requisition?.receivedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
              </v-row>

              <!-- Confirmation Evaluate Dialog -->
              <v-dialog v-model="confirmDialog" max-width="500">
                <v-card class="pa-8 rounded-lg" elevation="2">
                  <v-row justify="center" align="center">
                    <v-col cols="auto">
                      <h4 class="text-h4 text-primary-text">
                        Complete Request
                      </h4>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center" class="">
                    <v-col cols="auto">
                      <p
                        class="text-subtitle-2 text-center text-primary-text"
                        style="
                          white-space: normal;
                          overflow: visible;
                          text-overflow: initial;
                        "
                      >
                        Do you want to proceed with issuing with this items?
                        Ensure all details are correct before confirming.
                      </p>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="6">
                      <v-btn
                        color="primary"
                        class="py-5"
                        @click="confirmEvaluate"
                        block
                        :loading="isConfirmingEvaluate"
                      >
                        Confirm
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="fontgray"
                        class="py-5"
                        variant="outlined"
                        @click="closeEvaluateDialog"
                        block
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>
            </v-row>
          </v-col>

          <!-- For Review -->
          <v-col v-if="isReview">
            <v-row no-gutters>
              <RequisitionDetails
                :requisition="requisition"
                :getDivisionName="getDivisionName"
                :getOfficeName="getOfficeName"
                mode="review"
                id="requisition-id"
              />

              <v-data-table
                :items="_stocks"
                :headers="headers"
                hide-default-footer
                max-height="400"
                fixed-header
                class="border-thin text-capitalize"
              >
              </v-data-table>

              <v-row class="mt-5">
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Requested by"
                    :name="requisition?.requestedByName"
                    :designation="requisition?.requestedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Approved by"
                    :name="requisition?.approvedByName"
                    :designation="requisition?.approvedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Issued by"
                    :name="requisition?.issuedByName"
                    :designation="requisition?.issuedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Received by"
                    :name="requisition?.receivedByName"
                    :designation="requisition?.receivedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
              </v-row>

              <v-dialog v-model="confirmReviewDialog" max-width="500">
                <v-card class="pa-8 rounded-lg" elevation="2">
                  <v-row justify="center" align="center">
                    <v-col cols="auto">
                      <h4 class="text-h4 text-primary-text">Approve Request</h4>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center" class="">
                    <v-col cols="auto">
                      <p
                        class="text-subtitle-2 text-primary-text"
                        style="
                          white-space: normal;
                          overflow: visible;
                          text-overflow: initial;
                        "
                      >
                        Do you want to proceed with issuing this item? Ensure
                        all details are correct before confirming.
                      </p>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="6">
                      <v-btn
                        color="primary"
                        class="py-5"
                        @click="confirmReview"
                        block
                        :loading="isConfirminReview"
                      >
                        Confirm
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="fontgray"
                        class="py-5"
                        variant="outlined"
                        @click="closeReviewDialog"
                        block
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>
            </v-row></v-col
          >

          <!-- For Issued -->
          <v-col v-if="isIssued">
            <v-row no-gutters>
              <RequisitionDetails
                :requisition="requisition"
                :getDivisionName="getDivisionName"
                :getOfficeName="getOfficeName"
                mode="issued"
                id="requisition-id"
              />

              <v-data-table
                :items="_stocks"
                :headers="headers"
                hide-default-footer
                max-height="400"
                fixed-header
                class="border-thin text-capitalize"
              >
              </v-data-table>

              <v-row class="mt-5">
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Requested by"
                    :name="requisition?.requestedByName"
                    :designation="requisition?.requestedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3">
                  <RequisitionStatusDetails
                    label="Approved by"
                    :name="requisition?.approvedByName"
                    :designation="requisition?.approvedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Issued by"
                    :name="requisition?.issuedByName"
                    :designation="requisition?.issuedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
                <v-col cols="3" v-if="requisition?.status === 'issued'">
                  <RequisitionStatusDetails
                    label="Received by"
                    :name="requisition?.receivedByName"
                    :designation="requisition?.receivedByDesignation"
                    :formattedDate="formattedDate"
                    :status="requisition?.status"
                  />
                </v-col>
              </v-row>

              <!-- Confirmation Issued Dialog -->
              <v-dialog v-model="confirmIssuedDialog" max-width="500">
                <v-card class="pa-9 rounded-lg text-center" elevation="2">
                  <v-row justify="center" align="center">
                    <v-col cols="auto">
                      <h4 class="text-h4 text-primary-text">
                        Confirm Issuance
                      </h4>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center" class="">
                    <v-col cols="auto">
                      <p class="text-subtitle-2 text-primary-text">
                        This request has been distributed. Confirming issuance
                        will mark all items as officially 'Issued' in the
                        system. Please ensure all items have been successfully
                        received by the designated office before proceeding.
                      </p>
                    </v-col>
                  </v-row>

                  <v-row justify="center" align="center">
                    <v-col cols="6">
                      <v-btn
                        color="primary"
                        class="py-6"
                        @click="confirmIssued"
                        block
                        :loading="isConfirmingIssued"
                      >
                        Confirm
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="fontgray"
                        class="py-6"
                        variant="outlined"
                        @click="closeIssuedDialog()"
                        block
                      >
                        Cancel
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-dialog>
            </v-row></v-col
          >
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps({
  id: { type: String, default: "" },
  mode: { type: String, default: "view" },
});

const { requiredRule, isAdmin, isPersonnel, isOfficeChief, isAdminHead } =
  useUtils();

const isCreate = computed(() => props.mode === "create");
const isRead = computed(() => props.mode === "view");
const isEvaluating = computed(() => props.mode === "evaluating");
const isReview = computed(() => props.mode === "review");
const isIssued = computed(() => props.mode === "issued");

const isAllIssueQtyValid = computed(() => {
  if (!requisition.value?.itemStocks) return false;

  return requisition.value.itemStocks.every((item) => {
    const stock = (item as any).stock ?? 0;
    return (
      item.issueQty !== undefined &&
      item.issueQty <= stock &&
      item.issueQty >= 0
    );
  });
});

const createButtons = [
  { label: "Submit", color: "primary", action: "submit" },
  { label: "Cancel", color: "fontgray", variant: "outlined", action: "goBack" },
];

const isAnyIssueQtyInvalid = computed(() => {
  return requisition.value?.itemStocks?.some(
    (item) => item.issueQty > item.stockQty
  );
});

const evaluatingButtons = computed(() => [
  {
    label: "Submit",
    color: "primary",
    action: "openEvaluateDialog",
    disabled: isAnyIssueQtyInvalid.value,
  },
  {
    label: "Cancel",
    color: "fontgray",
    variant: "outlined",
    action: "goBack",
  },
]);

const reviewButtons = [
  { label: "Approve", color: "primary", action: "openReviewDialog" },
];

const issuedButtons = [
  { label: "Mark as Issued", color: "primary", action: "openIssuedDialog" },
  { label: "Cancel", color: "fontgray", variant: "outlined", action: "goBack" },
];

// Action handler
function handleButtonAction(action: string) {
  const actionsMap: Record<string, Function> = {
    submit: () => submit(),
    goBack: () => goBack(),
    openEvaluateDialog: () => openEvaluateDialog(requisition.value),
    openReviewDialog: () => openReviewDialog(),
    openIssuedDialog: () => openIssuedDialog(requisition.value),
  };

  if (actionsMap[action]) {
    actionsMap[action]();
  } else {
    console.warn(`Unhandled action: ${action}`);
  }
}

const showAddListItem = computed(() => props.mode === "create");
const { debounce } = useUtils();
const { getDivisions, divisions } = useDivision();
const { getAssets, search } = useAsset();
const isItemValid = ref(false);
// const items = ref<Array<TRequisition>>([]);

function addItem(value: Partial<TAsset & { requestQty?: number }>) {
  const _items = items.value.filter((i) => i._id === value._id);
  if (!_items.length && value.requestQty) {
    items.value.push({
      ...JSON.parse(JSON.stringify(value)),
      assetId: value._id,
      requestQty: value.requestQty,
    });
    setSelectedItem();
    selectedItem.value = " ";

    item.requestQty = 1;
  }
}

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

type TSearchItem = {
  title: string;
  value: TKeyValuePair;
};
const itemOptions = ref<Array<TSearchItem>>([]);
function setSearch(value: string) {
  search.value = value;
}

// Debounced search for assets
const searchItem = debounce(async (_search = "") => {
  itemOptions.value = [];
  try {
    const res = await getAssets({ search: _search, limit: 20 });
    const _items = res.items;
    itemOptions.value = _items.map((i) => ({
      title: `${i.name}`,
      value: {
        _id: i._id,
        name: i.name,
        stockNumber: i.stockNumber,
        description: i.description,
        unitOfMeasurement: i.unitOfMeasurement,
        quantity: i.quantity,
      },
    }));
  } catch (error) {
    throw error;
  }
}, 500);

watch(isCreate, async (newVal) => {
  if (newVal) {
    requisition.value = {
      purpose: "",
      requestedBy: "",
      requestedByName: "",
      itemStocks: [],
    };

    await nextTick();
  }
});

searchItem();

const item = reactive<Partial<TAssetWithRequest>>({
  _id: "",
  name: "",
  stockNumber: "",
  description: "",
  unitOfMeasurement: "",
  article: "",
  type: "",
  requestQty: 1,
  issueQty: 0,
  remarks: "",
});

function setSelectedItem(value = {} as TAsset) {
  if (!value) return;
  item._id = value._id ?? "";
  item.name = value.name ?? "";
  item.description = value.description ?? "";
  item.unitOfMeasurement = value.unitOfMeasurement ?? "";
  item.stockNumber = value.stockNumber ?? "";

  item.quantity =
    value.quantity !== undefined && value.quantity !== null
      ? value.quantity
      : undefined;
}

// Get current user
const { getCurrentUser } = useLocalAuth();
const selectedItem = ref();
const { goBack } = useUtils();

const items = ref<Array<{ _id: string; requestQty: number }>>([]);

async function submit() {
  const isLoading = ref(false);
  const errorMessage = ref("");
  const showErrorDialog = ref(false);

  isLoading.value = true;

  try {
    if (items.value.length === 0) {
      throw new Error("At least one item must be added.");
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Unable to identify the current user.");
    }

    requisition.value.requestedBy = currentUser._id;
    requisition.value.requestedByName = currentUser.fullName;

    requisition.value.itemStocks = items.value.map((item) => {
      if (item.requestQty == null) {
        throw new Error(
          `Item with ID ${item._id} is missing a request quantity.`
        );
      }
      return {
        assetId: item._id,
        requestQty: Number(item.requestQty),
      };
    });

    const cleanRequisition = (requisition: any) => {
      const fieldsToRemove = [
        "_id",
        "division",
        "divisionId",
        "officeId",
        "risNo",
        "risId",
        "status",
        "isAvailable",
        "issuedByDesignation",
        "requestedByDesignation",
        "requestedByInfo",
        "approvedByInfo",
        "issuedByInfo",
        "receivedByInfo",
        "approvedBy",
        "issuedBy",
        "rcc",
        "receivedBy",
        "issueQty",
        "issuedByName",
        "createdAt",
        "updatedAt",
        "office",
        "deletedAt",
        "remarks",
        "approvedByName",
        "approvedByDesignation",
        "receivedByName",
        "receivedByDesignation",
        "entityName",
        "fundCluster",
        "approvedAt",
        "completedAt",
      ];
      const clonedRequisition = JSON.parse(JSON.stringify(requisition));
      fieldsToRemove.forEach((field) => delete clonedRequisition[field]);
      return clonedRequisition;
    };

    const cleanedRequisition = cleanRequisition(requisition.value);

    await createRequistion(cleanedRequisition);

    closeDialog();
    await goBack();
  } catch (error: any) {
    errorMessage.value =
      error?.message || error?.data?.message || "An unexpected error occurred.";
    showErrorDialog.value = true;
    console.error("Submission Error:", error);
  } finally {
    isLoading.value = false;
  }
}

const dialog = ref(false);
const closeDialog = () => {
  dialog.value = false;
};

const formattedDate = computed(() => {
  if (requisition.value?.createdAt) {
    const date = new Date(requisition.value.createdAt);
    return date.toDateString().slice(4);
  }
  return "";
});

const {
  createRequistion,
  getRequisitionById,
  updateForReviewStatus,
  updateIssuedStatus,
  updatePendingStatus,
  requisition,
} = useRequisition();

const { stocks } = useStock();

const _stocks = computed(() => {
  if (isCreate.value && isRead.value) {
    return stocks.value;
  } else {
    return requisition.value.itemStocks;
  }
});

if (
  isRead.value ||
  isReview.value ||
  isIssued.value ||
  (isEvaluating.value && props.id)
) {
  const _id = props.id;
  const _getRequisition = async () => {
    try {
      requisition.value = await getRequisitionById(_id);
    } catch (error) {
      throw error;
    }
  };

  _getRequisition();
}

const headers: {
  title: string;
  value: string;
  align?: "start" | "end" | "center";
  width?: string;
}[] = [];

if (isCreate.value && isAdmin.value) {
  headers.push(
    { title: "Stock No.", value: "stockNumber" },
    { title: "Unit", value: "unitOfMeasurement", align: "center" },
    { title: "Description", value: "description", align: "center" },
    { title: "Stock Balance", value: "quantity", align: "center" },
    { title: "Quantity", value: "requestQty", align: "center" },
    { title: "Action", value: "action", align: "center" }
  );
}

if (isCreate.value && isPersonnel.value) {
  headers.push(
    { title: "Stock No.", value: "stockNumber" },
    { title: "Unit", value: "unitOfMeasurement", align: "center" },
    { title: "Description", value: "description", align: "center" },
    { title: "Quantity", value: "requestQty", align: "center" },
    { title: "Action", value: "action", align: "center" }
  );
}

if (isRead.value) {
  headers.push(
    { title: "Stock No.", value: "stockNumber", align: "start", width: "200" },
    { title: "Unit", value: "unitOfMeasurement", align: "start", width: "140" },
    {
      title: "Description",
      value: "description",
      align: "start",
      width: "150",
    },
    { title: "Quantity", value: "requestQty", align: "center", width: "80" },
    ...(!isPersonnel.value
      ? [
          {
            title: "Stock Available",
            value: "isAvailable",
            align: "center" as "center",
            width: "80",
          },
        ]
      : []),
    { title: "Issue Qty", value: "issueQty", align: "center", width: "120" },
    { title: "Remarks", value: "remarks", align: "center", width: "250" }
  );
}

if (isEvaluating.value) {
  headers.push(
    { title: "Stock No.", value: "stockNumber", align: "center" },
    { title: "Unit", value: "unitOfMeasurement", align: "center" },
    { title: "Description", value: "description", align: "center" },
    { title: "Stock Qty", value: "stockQty", align: "center" },
    { title: "Request Qty", value: "requestQty", align: "center" },
    { title: "Stock Available", value: "isAvailable", align: "center" },
    { title: "Issue Qty", value: "issueQty", align: "center", width: "120" }
  );
}

if (isReview.value) {
  headers.push(
    { title: "Stock No.", value: "stockNumber", align: "center" },
    { title: "Unit", value: "unitOfMeasurement", align: "center" },
    { title: "Description", value: "description", align: "center" },
    { title: "Quantity", value: "requestQty", align: "center" },
    { title: "Stock Available", value: "isAvailable", align: "center" },
    { title: "Issue Qty", value: "issueQty", align: "center", width: "120" },
    { title: "Remarks", value: "remarks", align: "center", width: "180" }
  );
}

if (isIssued.value) {
  headers.push(
    { title: "Stock No.", value: "stockNumber", align: "center" },
    { title: "Unit", value: "unitOfMeasurement", align: "center" },
    { title: "Description", value: "description", align: "center" },
    { title: "Quantity", value: "requestQty", align: "center" },
    { title: "Stock Available", value: "isAvailable", align: "center" },
    { title: "Issue Qty", value: "issueQty", align: "center", width: "120" },
    { title: "Remarks", value: "remarks", align: "center", width: "180" }
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case "for-evaluation":
      return "purple";
    case "for-review":
      return "blue";
    case "pending":
      return "orange";
    case "issued":
      return "green";
    case "cancelled":
      return "secondary";
    default:
      return "grey";
  }
}

const expanded = ref<string[]>([]);

const confirmDialog = ref(false);
const dialogItem = ref<any>(null);
const isConfirmingEvaluate = ref(false);

const openEvaluateDialog = (item: any) => {
  dialogItem.value = item;
  confirmDialog.value = true;
};

const closeEvaluateDialog = () => {
  confirmDialog.value = false;
  dialogItem.value = null;
};

const confirmEvaluate = async () => {
  isConfirmingEvaluate.value = true;

  try {
    const itemStocks = requisition.value.itemStocks.map((stock) => ({
      assetId: stock.assetId,
      issueQty: stock.issueQty || 0,
      remarks: stock.remarks || "",
    }));

    await updateForReviewStatus(dialogItem.value._id, { itemStocks });

    await useRouter().push({
      name: "requisition-and-issue-slips",
    });

    closeEvaluateDialog();
  } catch (error) {
    console.error("Error updating requisition status:", error);
  } finally {
    isConfirmingEvaluate.value = false;
  }
};

function evaluate(value: TRequisition) {
  if (value.status === "evaluating") {
    openEvaluateDialog(value);
  } else {
    useRouter().push({
      name: "requisition-and-issue-slips",
    });
  }
}

// Evaluation dialog control
const confirmIssuedDialog = ref(false);
const dialogIssuedItem = ref<any>(null);
const isConfirmingIssued = ref(false);
const closeIssuedDialog = () => {
  confirmIssuedDialog.value = false;
};
const openIssuedDialog = (item: any) => {
  dialogIssuedItem.value = item;
  confirmIssuedDialog.value = true;
};

const confirmIssued = async () => {
  isConfirmingIssued.value = true;

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    if (!requisition.value?._id) throw new Error("Requisition ID is undefined");

    const receivedBy = currentUser?._id;

    if (!receivedBy) throw new Error("ReceivedBy user ID is undefined");

    await updateIssuedStatus(
      requisition.value._id,
      "issued",
      currentUser._id,
      receivedBy
    );

    await useRouter().push({
      name: "requisition-and-issue-slips",
    });
  } catch (error) {
    console.error("Error updating requisition status:", error);
  } finally {
    isConfirmingIssued.value = false;
    closeIssuedDialog();
  }
};

const confirmReviewDialog = ref(false);
const isConfirminReview = ref(false);

const openReviewDialog = () => {
  confirmReviewDialog.value = true;
};

const closeReviewDialog = () => {
  confirmReviewDialog.value = false;
};

const confirmReview = async () => {
  isConfirminReview.value = true;

  try {
    const requisitionId = requisition.value?._id;
    if (!requisitionId) {
      console.error("Requisition ID is missing.");
      return;
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Unable to identify the approver.");
    }

    const approverId = currentUser._id;

    await updatePendingStatus(requisitionId, "pending", approverId);

    closeReviewDialog();

    await useRouter().push({
      name: "requisition-and-issue-slips",
    });
  } catch (error) {
    console.error("Error confirming the requisition issue:", error);
  } finally {
    isConfirminReview.value = false;
  }
};

const fetchingDivisions = ref(false);
const _getDivisions = debounce(async (search = "") => {
  fetchingDivisions.value = true;
  try {
    await getDivisions({ limit: 20, search });
  } catch (error) {
    console.log(error);
  }
  fetchingDivisions.value = false;
}, 500);

_getDivisions();

const { getOffices, offices } = useOfficeCodes();
const fetchingOffices = ref(false);

const _getOffices = debounce(async (_search = "") => {
  fetchingOffices.value = true;
  try {
    await getOffices({ search: _search, limit: 50 });
  } catch (error) {
    console.error("Error fetching offices:", error);
  }
  fetchingOffices.value = false;
}, 500);

_getOffices();

// Functions to get division and office names
function getDivisionName(id?: string) {
  if (!id) return "Not Assigned";
  const division = divisions.value.find((i) => i._id === id);
  return division?.name || "Division not found";
}

function getOfficeName(id?: string) {
  if (!id) return "Not Assigned";
  const office = offices.value.find((i) => i._id === id);
  return office?.name || "Office not found";
}

const showErrorSnackbar = ref(false);
const errorStock = ref(0);

function checkIssueQty(item: any) {
  if (item.issueQty > item.stock) {
    showErrorSnackbar.value = true;
    errorStock.value = item.stock;
  } else {
    showErrorSnackbar.value = false;
  }
}
</script>
