<script>
import { useInvoicestore } from "@/stores/apps/invoice";
import { CirclePlusIcon, TrashIcon } from "vue-tabler-icons";
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import {
  toThaiDateString,
  toThaiDateTimeString,
  formatCurrency,
} from "@/utils/functions";

export default {
  name: "CreateRepair",
  // 1. ลงทะเบียนคอมโพเนนต์ที่ import เข้ามา
  components: {
    CirclePlusIcon,
    TrashIcon,
  },

  // 2. data() จะ return state ทั้งหมดของคอมโพเนนต์
  data() {
    const invoiceStore = useInvoicestore();
    return {
      invoiceStore,
      valid: false,
      isVat: false,
      // statuses: ["Pending", "Shipped", "Delivered"],
      rules: [(v) => !!v || "This field is required"],
      vatRate: 0.07,
      selectedItems: [],
      RepairItems: {},
      newRepairItems: {},
      refItems: [],
      repairDetails: [],
      showPresetDetail: null,
      headers: [
        { title: "รหัสอุปกรณ์", align: "start", key: "part.PartNumber" },
        { title: "ชื่ออุปกรณ์", align: "start", key: "part.PartName_th" },
        { title: "จำนวนที่ต้องใช้", align: "end", key: "NumOfUse" },
        { title: "จำนวนในคลัง", align: "end", key: "part.PartAmount" },
      ],
      // dialog
      dialogAddPart: false,
    };
  },

  // 3. computed ใช้สำหรับข้อมูลที่ต้องคำนวณจาก state
  computed: {
    subtotalNutcha() {
      return (this.repairDetails ?? []).reduce((sum, obj) => {
        return (
          sum +
          (obj.repairParts ?? []).reduce((sum2, part) => {
            return sum2 + (part.PricePerUnit ?? 0) * (part.NumOfUse ?? 0);
          }, 0)
        );
      }, 0);
    },
    vatNutCha() {
      return this.subtotalNutcha * (this.isVat ? this.vatRate : 0);
    },
    grandTotalNutCha() {
      const total =
        parseFloat(this.subtotalNutcha) + parseFloat(this.vatNutCha);
      return total;
    },
    repairID() {
      return this.$route.params.repairID;
    },
    selectableItems() {
      // เพิ่มเงื่อนไข: ถ้า showPresetDetail เป็น null หรือไม่มี presetDetails ให้ return เป็น array ว่าง
      if (!this.showPresetDetail || !this.showPresetDetail.presetDetails) {
        return [];
      }
      // ถ้ามีค่า ถึงจะทำการ filter
      return this.showPresetDetail.presetDetails.filter(
        (item) => item.NumOfUse <= item.part.PartAmount
      );
    },
    isAllSelectableSelected() {
      return (
        this.selectableItems.length > 0 &&
        this.selectedItems.length === this.selectableItems.length
      );
    },
    isSomeSelectableSelected() {
      return this.selectedItems.length > 0 && !this.isAllSelectableSelected;
    },
    checkNotEnoughItems() {
      return (
        this.showPresetDetail.presetDetails.filter(
          (item) => item.NumOfUse > item.part.PartAmount
        ).length > 0
      );
    },
    notEnoughItems() {
      return this.showPresetDetail.presetDetails.filter(
        (item) => item.NumOfUse > item.part.PartAmount
      );
    },
    aviableItems() {
      return this.showPresetDetail.presetDetails.filter(
        (item) => item.NumOfUse <= item.part.PartAmount
      );
    },
  },

  // 4. methods ใช้สำหรับฟังก์ชันต่างๆ ที่จะเรียกใช้ในคอมโพเนนต์
  methods: {
    // สร้าง method ห่อหุ้ม `format` เพื่อให้ template เรียกใช้ได้
    formatSeperateCurrency(total) {
      return formatCurrency(total);
    },
    formatDate(date) {
      return date ? toThaiDateString(new Date(date), "E, MMM dd, yyyy") : "N/A";
    },
    formatDateTime(date) {
      return date ? toThaiDateTimeString(new Date(date)) : "N/A";
    },
    toggleSelectAll() {
      if (this.isAllSelectableSelected) {
        this.selectedItems = [];
      } else {
        this.selectedItems = [...this.selectableItems];
      }
    },

    submitSave() {
      alert("submit save");
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

    deletePart(index) {
      alert("delete : ", index);
    },
    // NutCha methods
    async getRepairByID() {
      const response = await serverService.getRepairByID(this.repairID);
      this.RepairItems = response.data;
    },
    async getRefModelCategoryPartByBrandID() {
      const response = await serverService.getRefModelCategoryPartByModelID(
        this.RepairItems.ModelID
      );
      this.refItems = response.data;
    },
    async getRepairDetail() {
      const response = await serverService.getRepairDetailByRepairID(
        this.repairID
      );
      this.repairDetails = response.data;
    },
    setRowClass({ item }) {
      if (item.NumOfUse > item.part.PartAmount) {
        return { class: "high-fat-row" };
      }
      return { class: "" };
    },
    async submitAddRepairItem() {
      if (this.selectedItems.length < 1) {
        Swal.fire({
          title: "Alert!",
          text: "กรุณาเลือกอย่างน้อย 1 รายการ",
          icon: "warning",
          confirmButtonText: "<span style='color:white;'>ตกลง</span>",
        });
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการเพิ่มรายละเอียดการซ่อม ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let payload = {
            RepairID: this.repairID,
            RepairCategoryID:
              this.showPresetDetail.repairCategory.RepairCategoryID,
            PresetID: this.showPresetDetail.PresetID,
            repairParts: [],
          };

          this.selectedItems.forEach((e) => {
            payload.repairParts.push({
              PartID: e.part.PartID,
              NumOfUse: e.NumOfUse,
              PricePerUnit: e.part.PricePerUnit,
            });
          });

          const response = await serverService.addRepairDetailWithPart(payload);
          if (response.data.result) {
            this.getRefModelCategoryPartByBrandID();
            this.getRepairDetail();
            this.removeObjectPresetAndSelectedItems();
            Swal.fire("Success!", "เพิ่มข้อมูลแล้ว", "success");
          }
        }
      });
    },
    choosePreset(preset) {
      this.showPresetDetail = preset;
      this.selectedItems = []; // เพิ่มบรรทัดนี้เพื่อล้างค่าที่เลือกไว้
    },
    openDialogAddPart() {
      this.dialogAddPart = true;
      this.getRefModelCategoryPartByBrandID();
    },
    removeObjectPresetAndSelectedItems() {
      this.showPresetDetail = null;
      this.selectedItems = []; // เพิ่มบรรทัดนี้เพื่อล้างค่าที่เลือกไว้
    },
    closeDialogAddPart() {
      this.dialogAddPart = false;
      this.removeObjectPresetAndSelectedItems();
    },
    initialize() {
      this.getRepairByID();
      this.getRepairDetail();
    },
  },
  mounted() {
    //
  },

  // 5. created() เป็น lifecycle hook ที่จะทำงานเมื่อคอมโพเนนต์ถูกสร้างขึ้น
  created() {
    this.initialize();
  },
};
</script>

<template>
  <v-card v-if="RepairItems.RepairID" elevation="10">
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
          <br />
          <p class="textSecondary text-14 mt-2 d-flex justify-end align-center">
            สถานะ : &nbsp;&nbsp;
            <v-chip color="primary">
              {{ RepairItems.workStatus.WorkStatus_th }}
            </v-chip>
          </p>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>

  <v-row class="mt-2">
    <v-col>
      <div class="text-center">
        <v-btn color="secondary" class="w-100" @click="openDialogAddPart" flat>
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
                          @click="
                            showPresetDetail = null;
                            selectedItems = [];
                          "
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
                            @click="
                              choosePreset(preset);
                              showPresetDetail.repairCategory =
                                category.repairCategory;
                            "
                          >
                            รหัส Preset #{{ preset.PresetID }} -
                            {{ preset.Preset }}
                          </v-btn>
                        </v-expansion-panel-text>
                        <v-divider></v-divider>
                      </v-expansion-panel>
                    </v-expansion-panels>
                    <!-- Popout -->
                  </div>
                </v-col>
                <v-col v-if="showPresetDetail" cols="12">
                  <hr />
                  <hr />
                  <div class="text-center mt-4 mb-3 font-weight-bold">
                    {{ showPresetDetail.Preset }}
                  </div>
                  <div v-if="checkNotEnoughItems">
                    <v-alert
                      density="compact"
                      type="error"
                      class="mb-4"
                      variant="tonal"
                    >
                      <span>อุปกรณ์ไม่เพียงพอ</span> <br />
                      <v-table
                        class="border rounded-md mt-2 mb-2"
                        density="compact"
                      >
                        <thead>
                          <tr>
                            <th class="text-start">รหัสอุปกรณ์</th>
                            <th class="text-start">ชื่ออุปกรณ์</th>
                            <th class="text-start">จำนวนที่ต้องใช้</th>
                            <th class="text-start">จำนวนที่มี</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="notItem in notEnoughItems">
                            <td class="text-start">
                              {{ notItem.part.PartNumber }}
                            </td>
                            <td class="text-start">
                              {{ notItem.part.PartName_th }}
                            </td>
                            <td class="text-end">
                              {{ notItem.NumOfUse }}
                              {{ notItem.part.unit.Unit }}
                            </td>
                            <td class="text-end">
                              {{ notItem.part.PartAmount }}
                              {{ notItem.part.unit.Unit }}
                            </td>
                          </tr>
                        </tbody>
                      </v-table>
                      <!-- </div> -->
                    </v-alert>
                  </div>
                  <v-data-table
                    items-per-page="10"
                    :row-props="setRowClass"
                    :headers="headers"
                    :items="aviableItems"
                    v-model="selectedItems"
                    item-value="PresetDetailID"
                    show-select
                    return-object
                    class="border rounded-md"
                    density="compact"
                  >
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
            <hr />
            <v-card-actions v-if="selectedItems.length > 0">
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
                >ปิดหน้าต่าง</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-col>
  </v-row>

  <v-card class="mt-5">
    <v-card-item>
      <v-form ref="formRef" v-model="valid" lazy-validation>
        <!--  -->
        <div
          v-for="(detail, index) in repairDetails"
          :key="detail.RepairDetailID"
          :title="detail.repairCategory.RepairCategory"
          class="mt-3"
          color="info"
          variant="outlined"
        >
          <!-- <span class="mt-10 font-weight-bold">{{ index + 1 }}. {{ detail.repairCategory.RepairCategory }}</span> -->
          <span class="mt-10 font-weight-bold"
            >#{{ index + 1 }}.&nbsp;&nbsp;&nbsp;&nbsp;
            {{ detail.preset.Preset }}
          </span>
          <v-table class="invoice-table mt-6" density="compact">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-14 text-no-wrap"></th>
                  <th class="text-14 text-no-wrap">ชื่ออุปกรณ์</th>
                  <th class="text-14 text-no-wrap text-center">ราคาต่อหน่วย</th>
                  <th class="text-14 text-no-wrap text-center">จำนวน</th>
                  <th class="text-14 text-no-wrap text-end">จำนวนเงิน (บาท)</th>
                  <th class="text-14 text-no-wrap text-end"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(part, index) in detail.repairParts" :key="index">
                  <td class="text-center">{{ index + 1 }}.</td>
                  <td width="300" class="text-no-wrap">
                    <span class="py-4">{{ part.part.PartName_th }}</span>
                  </td>
                  <td width="150" class="text-no-wrap text-end">
                    {{ formatSeperateCurrency(part.PricePerUnit) }}
                  </td>
                  <td width="150" class="text-no-wrap">
                    <v-text-field
                      v-model="part.NumOfUse"
                      :label="`จำนวน (${part.part.unit.Unit})`"
                      :rules="rules"
                      required
                      hide-details
                      width="150"
                      type="number"
                    />
                  </td>
                  <td width="150" class="text-14 text-no-wrap text-end">
                    {{ formatSeperateCurrency(invoiceStore.totalCost(part)) }}
                  </td>
                  <td class="text-end text-no-wrap">
                    <v-avatar
                      color="lighterror"
                      size="32"
                      @click="deletePart(index)"
                    >
                      <TrashIcon class="text-error" size="18" />
                    </v-avatar>
                    <v-tooltip activator="parent" location="bottom"
                      >Delete Invoice</v-tooltip
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </div>

        <v-row class="d-flex justify-end border-t mt-1">
          <v-col cols="12" md="3" class="mt-3 ps-lg-16">
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4"
            >
              <p class="text-muted">Sub Total :</p>
              <p class="text-16">
                {{ formatSeperateCurrency(subtotalNutcha) }}
              </p>
            </div>
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4"
            >
              <div class="d-flex align-center justify-space-between">
                <p class="text-muted">
                  Vat : {{ (vatRate * 100).toFixed(0) }} %&nbsp;&nbsp;
                </p>
                <v-switch
                  v-model="isVat"
                  color="orange"
                  hide-details
                ></v-switch>
              </div>
              <p class="text-16">
                {{ formatSeperateCurrency(vatNutCha) }}
              </p>
            </div>
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold"
            >
              <p class="text-muted">Grand Total :</p>
              <p class="text-16">
                {{ formatSeperateCurrency(grandTotalNutCha) }}
              </p>
            </div>
          </v-col>
        </v-row>

        <div class="d-flex align-center justify-end ga-3">
          <v-btn flat color="primary" @click="submitSave" class="mt-6"
            >Create Invoice</v-btn
          >
          <v-btn flat color="error" to="/system/repairs" class="mt-6"
            >Cancel</v-btn
          >
        </div>
      </v-form>
    </v-card-item>
  </v-card>
</template>

<style>
.high-fat-row {
  background-color: #ffebee !important;
  /* background-color: #ffcdd2 !important; */
}

.high-fat-row:hover {
  background-color: #ffcdd2 !important;
}
</style>
