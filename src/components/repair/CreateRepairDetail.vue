<script>
import { useInvoicestore } from "@/stores/apps/invoice";
import { format } from "date-fns";
import { CirclePlusIcon, TrashIcon } from "vue-tabler-icons";
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { toThaiDateString, toThaiDateTimeString } from "@/utils/functions";

export default {
  name: "CreateRepair",

  // 1. ลงทะเบียนคอมโพเนนต์ที่ import เข้ามา
  components: {
    CirclePlusIcon,
    TrashIcon,
  },

  // 2. data() จะ return state ทั้งหมดของคอมโพเนนต์
  data() {
    return {
      store: null, // จะกำหนดค่าใน created() hook
      valid: false,
      statuses: ["Pending", "Shipped", "Delivered"],
      rules: [(v) => !!v || "This field is required"],
      vatRate: 0.1,
      invoice: {
        id: null, // กำหนดค่าเริ่มต้นเป็น null แล้วจะคำนวณใน created() hook
        billFrom: "",
        billTo: "",
        billFromAddress: "",
        billToAddress: "",
        totalCost: 0,
        status: "Pending",
        orderDate: new Date(),
        orders: [{ itemName: "", unitPrice: 0, units: 0, unitTotalPrice: 0 }],
      },
      // NutCha Data
      selectedItems: [],
      RepairItems: {},
      newRepairItems: {},
      refItems: [],
      showPresetDetail: null,
      headers: [
        { title: "รหัสอุปกรณ์", align: "start", key: "part.PartNumber" },
        { title: "ชื่ออุปกรณ์", align: "start", key: "part.PartName_th" },
        { title: "จำนวนที่ต้องใช้", align: "end", key: "NumOfUse" },
        { title: "จำนวนในคลัง", align: "end", key: "part.PartAmount" },
      ],
      // dialog
      dialogAddPart: false,
      // test Data
      accordions: [
        {
          name: "Accordion 1",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
        },
        {
          name: "Accordion 2",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
        },
        {
          name: "Accordion 3",
          text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
        },
      ],
    };
  },

  // 3. computed ใช้สำหรับข้อมูลที่ต้องคำนวณจาก state
  computed: {
    nextInvoiceId() {
      if (this.store && this.store.invoice.length > 0) {
        return Math.max(...this.store.invoice.map((i) => i.id)) + 1;
      }
      return 1;
    },
    subtotal() {
      return (this.invoice.orders ?? []).reduce((sum, order) => {
        return sum + (order.unitPrice ?? 0) * (order.units ?? 0);
      }, 0);
    },
    vat() {
      return this.subtotal * this.vatRate;
    },
    grandTotal() {
      return this.subtotal + this.vat;
    },
    repairID() {
      return this.$route.params.repairID;
    },
    selectableItems() {
      return this.showPresetDetail.presetDetails.filter(
        (item) => item.NumOfUse <= item.part.PartAmount
      );
    },
    isAllSelectableSelected() {
      return this.selectableItems.length > 0 && this.selectedItems.length === this.selectableItems.length;
    },
    isSomeSelectableSelected() {
      return this.selectedItems.length > 0 && !this.isAllSelectableSelected;
    },
  },

  // 4. methods ใช้สำหรับฟังก์ชันต่างๆ ที่จะเรียกใช้ในคอมโพเนนต์
  methods: {
    // สร้าง method ห่อหุ้ม `format` เพื่อให้ template เรียกใช้ได้
    formatDate(date) {
      return date ? toThaiDateString(new Date(date), "E, MMM dd, yyyy") : "N/A";
    },
    formatDateTime(date) {
      return date ? toThaiDateTimeString(new Date(date)) : "N/A";
    },

    submitInvoice() {
      // สามารถใช้ this.valid เพื่อเข้าถึงค่าใน data
      if (this.valid) {
        this.invoice.id = this.nextInvoiceId; // ใช้ค่าจาก computed
        this.invoice.orderDate = new Date();
        this.invoice.totalCost = this.grandTotal; // ใช้ค่าจาก computed

        this.store.addInvoice(this.invoice);

        // ใช้ this.$router ใน Options API เพื่อเข้าถึง router
        this.$router.push("/apps/invoice");
      } else {
        console.log("Form is invalid");
      }
    },

    addOrderRow() {
      this.invoice.orders = this.invoice.orders ?? [];
      this.invoice.orders.push({
        itemName: "",
        unitPrice: 0,
        units: 0,
        unitTotalPrice: 0,
      });
    },

    deleteOrderRow(index) {
      this.invoice.orders = this.invoice.orders ?? [];
      this.invoice.orders.splice(index, 1);
    },
    // NutCha methods
    async getRepairByID() {
      const response = await serverService.getRepairByID(this.repairID);
      // console.log(response.data)
      this.RepairItems = response.data;
    },
    async getRefModelCategoryPartByBrandID() {
      console.log(this.RepairItems.ModelID);
      const response = await serverService.getRefModelCategoryPartByModelID(
        this.RepairItems.ModelID
      );
      console.log(response.data);
      this.refItems = response.data;
    },
    setRowClass({ item }) {
      if (item.NumOfUse > item.part.PartAmount) {
        return { class: "high-fat-row" };
      }
      return { class: "" };
    },
    async submitAddRepairItem() {
      alert("submit add repair item");
      this.showPresetDetail = null;
      // this.closeDialogAddPart();
    },
    choosePreset(preset) {
      console.log(preset);
      this.showPresetDetail = preset;
    },
    closeDialogAddPart() {
      this.dialogAddPart = false;
      this.showPresetDetail = null;
    },
    initialize() {
      this.getRepairByID().then(() => this.getRefModelCategoryPartByBrandID());
    },
  },
  mounted() {
    //
  },

  // 5. created() เป็น lifecycle hook ที่จะทำงานเมื่อคอมโพเนนต์ถูกสร้างขึ้น
  created() {
    this.initialize();
    // กำหนดค่าให้กับ store ที่ประกาศไว้ใน data
    this.store = useInvoicestore();
    // คำนวณและกำหนด ID เริ่มต้นให้กับ invoice
    this.invoice.id = this.nextInvoiceId;
  },
};
</script>

<template>
  <v-card v-if="RepairItems.RepairID" elevation="10">
    <!-- {{ RepairItems }} -->
    <v-card-item>
      <v-row>
        <v-col>
          <p class="textSecondary text-14">#ID : {{ repairID }}</p>
          <p class="textSecondary text-14">
            วันที่ :
            {{ formatDate(RepairItems?.RepairDate) }}
          </p>
          <p class="textSecondary text-14">
            ยี่ห้อ/รุ่น :
            {{ RepairItems.car.brand.Brand }}
            ( {{ RepairItems.car.model.Model }} )
          </p>
          <p class="textSecondary text-14">
            ทะเบียน :
            {{ RepairItems.car.CarTitle }}
            {{ RepairItems.car.CarNumber }}
            {{ RepairItems.car.province.name_th }}
          </p>
          <p class="textSecondary text-14">
            ลูกค้า :
            {{ RepairItems.customer.customerTitle.CustomerTitle }}
            {{ RepairItems.customer.CustomerName }}
            {{ RepairItems.customer.CustomerSurname }}
          </p>
        </v-col>
        <v-col class="text-end">
          <p class="textSecondary text-14">
            สร้างเมื่อ :
            {{ formatDateTime(RepairItems.createdAt) }}
          </p>
          <p class="textSecondary text-14">
            สร้างโดย :
            {{ RepairItems.employee.FirstName }}
            {{ RepairItems.employee.LastName }}
          </p>
        </v-col>
      </v-row>

      <v-form ref="formRef" v-model="valid" lazy-validation>
        <div class="bg-hoverColor mt-6 pa-6 rounded-md">
          <v-row>
            <v-col cols="12" md="4">
              <v-label class="pb-2">หมายเลขทะเบียนรถยนต์</v-label>
              <v-text-field
                class="centered-input"
                :value="`${RepairItems.car.CarTitle} ${RepairItems.car.CarNumber} ${RepairItems.car.province.name_th}`"
                hide-details
                disabled
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-label class="pb-2">ชื่อลูกค้า</v-label>
              <v-text-field
                :value="`${RepairItems.customer.customerTitle.CustomerTitle} ${RepairItems.customer.CustomerName} ${RepairItems.customer.CustomerSurname}`"
                class="centered-input"
                hide-details
                disabled
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-label class="pb-2">สถานะ</v-label>
              <v-text-field
                :value="RepairItems.workStatus.WorkStatus_th"
                class="centered-input"
                hide-details
                :disabled="true"
              />
            </v-col>
          </v-row>
        </div>
        <v-row class="mt-3">
          <v-col>
            <div class="text-center">
              <v-btn
                color="secondary"
                class="w-100"
                @click="dialogAddPart = true"
                flat
              >
                <v-icon size="20">mdi-plus-circle-outline</v-icon>
                <span class="hidden-sm-and-down"> &nbsp;เพิ่มรายการ </span>
              </v-btn>
              <v-dialog
                v-model="dialogAddPart"
                class="dialog-mw"
                style="max-width: 1000px"
                persistent
              >
                <v-card>
                  <v-card-text>
                    <v-row>
                      <v-col>
                        <div class="overflow-y-auto" style="max-height: 250px">
                          <!-- Popout -->
                          <v-expansion-panels variant="popout">
                            <v-expansion-panel
                              v-for="(category, index) in refItems"
                              :key="category.PartCategoryID"
                              elevation="10"
                            >
                              <v-expansion-panel-title
                                class="text-h6"
                                color="info"
                                @click="showPresetDetail = null"
                              >
                                {{ index + 1 }}. {{ category.PartCategoryName }}
                              </v-expansion-panel-title>
                              <v-expansion-panel-text>
                                <v-btn
                                  v-for="preset in category.presets"
                                  :key="preset.PresetID"
                                  rounded="0"
                                  block
                                  variant="outlined"
                                  color=""
                                  class="mb-2"
                                  @click="choosePreset(preset)"
                                >
                                  {{ preset.Preset }}
                                </v-btn>
                              </v-expansion-panel-text>
                              <v-divider></v-divider>
                            </v-expansion-panel>
                          </v-expansion-panels>
                          <!-- Popout -->
                        </div>
                      </v-col>
                      {{ selectedItems }}
                      <v-col v-if="showPresetDetail" cols="12">
                        <hr />
                        <hr />
                        <div class="text-center mt-4 mb-3">
                          {{ showPresetDetail.Preset }}
                        </div>
                        <v-data-table
                          items-per-page="10"
                          :row-props="setRowClass"
                          :headers="headers"
                          :items="showPresetDetail.presetDetails"
                          v-model="selectedItems"
                          item-value="PartID"
                          show-select
                          return-object
                          class="border rounded-md"
                          density="compact"
                        >
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      color="primary"
                      block
                      @click="submitAddRepairItem"
                      flat
                      variant="tonal"
                      >เพิ่มอุปกรณ์</v-btn
                    >
                  </v-card-actions>
                  <v-card-actions>
                    <v-btn color="error" block @click="closeDialogAddPart" flat
                      >ยกเลิก</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-row>

        <v-table class="invoice-table mt-6">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-14 text-no-wrap"></th>
                <th class="text-14 text-no-wrap">Item Name</th>
                <th class="text-14 text-no-wrap">Unit Price</th>
                <th class="text-14 text-no-wrap">Units</th>
                <th class="text-14 text-no-wrap">Total Cost</th>
                <th class="text-14 text-no-wrap text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(inv, index) in invoice.orders" :key="index">
                <td class="text-no-wrap">
                  <v-btn
                    flat
                    icon
                    color="lightprimary"
                    size="x-small"
                    @click="addOrderRow"
                    class="ms-3"
                  >
                    <CirclePlusIcon class="text-primary" size="18" />
                    <v-tooltip activator="parent" location="bottom"
                      >Add Item</v-tooltip
                    >
                  </v-btn>
                </td>
                <td width="300" class="text-no-wrap">
                  <v-text-field
                    label="Item Name"
                    hide-details
                    v-model="inv.itemName"
                    :rules="rules"
                    required
                    class="py-4"
                    width="300"
                  />
                </td>
                <td width="150" class="text-no-wrap">
                  <v-text-field
                    v-model="inv.unitPrice"
                    label="Unit Price"
                    :rules="rules"
                    required
                    hide-details
                    width="150"
                    type="number"
                  />
                </td>
                <td width="150" class="text-no-wrap">
                  <v-text-field
                    v-model="inv.units"
                    label="Units"
                    :rules="rules"
                    required
                    hide-details
                    width="150"
                    type="number"
                  />
                </td>
                <td width="150" class="text-14 text-no-wrap">
                  {{ store.grandTotal(invoice) }}
                </td>
                <td class="text-end text-no-wrap">
                  <!-- <NuxtLink class="cursor-pointer me-lg-3"> -->
                  <v-avatar
                    color="lighterror"
                    size="32"
                    @click="deleteOrderRow(index)"
                  >
                    <TrashIcon class="text-error" size="18" />
                  </v-avatar>
                  <v-tooltip activator="parent" location="bottom"
                    >Delete Invoice</v-tooltip
                  >
                  <!-- </NuxtLink> -->
                </td>
              </tr>
            </tbody>
          </template>
        </v-table>

        <v-row class="d-flex justify-end border-t mt-1">
          <v-col cols="12" md="3" class="mt-3 ps-lg-16">
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4"
            >
              <p class="text-muted">Sub Total:</p>
              <p class="text-16">{{ subtotal }}</p>
            </div>
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4"
            >
              <p class="text-muted">Vat:</p>
              <p class="text-16">{{ vat }}</p>
            </div>
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold"
            >
              <p class="text-muted">Grand Total:</p>
              <p class="text-16">{{ grandTotal }}</p>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="primary" @click="submitInvoice" class="mt-6"
            >Create Invoice</v-btn
          >
          <v-btn flat color="error" to="/apps/invoice" class="mt-6"
            >Cancel</v-btn
          >
        </div>
      </v-form>
    </v-card-item>
  </v-card>
</template>

<style>
/* ... style เหมือนกับตัวอย่างแรก ... */
/* .high-fat-row {
  background-color: #ffebee !important;
} */

.high-fat-row {
  background-color: #ffcdd2 !important;
}

.high-fat-row:hover {
  background-color: #ffcdd2 !important;
}
</style>
