<script>
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import {
  toThaiDateString,
  toThaiDateTimeString,
  formatCurrency,
  getColorByNumber,
} from "@/utils/functions";
export default {
  data() {
    return {
      page: { title: "รายละเอียดใบเสนอราคา" },
      breadcrumbs: [
        {
          text: "Invoice",
          disabled: false,
          href: "#",
        },
        {
          text: "ใบเสนอราคา",
          disabled: false,
          href: "#",
        },
        {
          text: "รายละเอียด",
          disabled: false,
          href: "#",
        },
      ],
      headers: [
        { title: "รหัสอุปกรณ์", align: "start", key: "part.PartNumber" },
        { title: "ชื่ออุปกรณ์", align: "start", key: "part.PartName_th" },
        { title: "จำนวนที่ต้องใช้", align: "end", key: "NumOfUse" },
        { title: "จำนวนในคลัง", align: "end", key: "part.PartAmount" },
      ],
      // default data
      quotationId: null,
      quotation: null,
      quotationDetail: [],
      refItems: [],
      showPresetDetail: null,
      selectedItems: [],
      showPresetDetail: null,
      // dialog
      dialogAddPart: false,
      // dataset
      addItem: {
        RepairDetailID: null,
        PartID: null,
        NumOfUse: null,
        PricePerUnit: null,
        PartAmount: null, // for show
      },
      defaultItem: {
        RepairDetailID: null,
        PartID: null,
        NumOfUse: null,
        PricePerUnit: null,
        PartAmount: null, // for show
      },
      expanded: [],
    };
  },
  methods: {
    formatSeperateCurrency(total) {
      return formatCurrency(total);
    },
    async getQuotation() {
      const response = await serverService.getQuotationByID(this.QuotationID);
      console.log(response.data);
      this.quotation = response.data;
    },
    async getQuotationDetail() {
      const response = await serverService.getQuotationDetailByQuotationID(
        this.quotationId
      );
      console.log(response.data);
      this.quotationDetail = response.data;
    },
    async getRefModelCategoryPartByBrandID() {
      const response = await serverService.getRefModelCategoryPartByModelID(
        this.quotation.ModelID
      );
      console.log(response.data);
      this.refItems = response.data;
    },
    async submitAddQuotaionItem() {
      // console.log(this.selectedItems);
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
        text: "ท่านต้องการเพิ่มข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let payload = {
            QuotationID: this.QuotationID,
            RepairCategoryID:
              this.showPresetDetail.repairCategory.RepairCategoryID,
            PresetID: this.showPresetDetail.PresetID,
            quotationParts: [],
          };

          this.selectedItems.forEach((e) => {
            payload.quotationParts.push({
              PartID: e.part.PartID,
              NumOfUse: e.NumOfUse,
              PricePerUnit: e.part.PricePerUnit,
              ServiceFee: e.part.ServiceFee,
            });
          });

          console.log(payload);

          const response = await serverService.createQuotationDetailsWithParts(
            payload
          );
          if (response.data.result) {
            this.getRefModelCategoryPartByBrandID();
            this.getQuotationDetail();
            this.removeObjectPresetAndSelectedItems();
            Swal.fire("Success!", "เพิ่มข้อมูลแล้ว", "success");
          } else {
            Swal.fire({
              icon: "warning",
              title: "Alert!",
              text: response.data.message,
              timer: 1500,
              showConfirmButton: false,
            });
            return;
          }
        }
      });
    },
    openDialogAddPart() {
      this.dialogAddPart = true;
      this.getRefModelCategoryPartByBrandID();
    },
    closeDialogAddPart() {
      this.dialogAddPart = false;
      this.removeObjectPresetAndSelectedItems();
    },
    removeObjectPresetAndSelectedItems() {
      this.showPresetDetail = null;
      this.selectedItems = []; // เพิ่มบรรทัดนี้เพื่อล้างค่าที่เลือกไว้
    },
    removeSelectedItem() {
      this.showPresetDetail = null;
      this.selectedItems = [];
    },
    choosePreset(preset, category) {
      this.showPresetDetail = preset;
      this.selectedItems = []; // เพิ่มบรรทัดนี้เพื่อล้างค่าที่เลือกไว้
      this.showPresetDetail.repairCategory = category.repairCategory;
    },
    sumPriceSinglePart(part) {
      const subtotal = part.NumOfUse * part.PricePerUnit;
      return subtotal + part.ServiceFee;
    },
    async initialize() {
      await this.getQuotation();
      await this.getQuotationDetail();
    },
  },
  created() {
    this.initialize();
  },
  computed: {
    QuotationID() {
      this.quotationId = this.$route.params.QuotationID;
      return this.$route.params.QuotationID;
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
    setRowClass({ item }) {
      if (item.NumOfUse > item.part.PartAmount) {
        return { class: "high-fat-row" };
      }
      return { class: "" };
    },
  },
};
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <UiParentCard Tableard title="รายละเอียดใบเสนอราคา">
    <v-row>
      <v-col> QuotationID : {{ QuotationID }} </v-col>
      <v-col class="text-end">
        <v-btn color="warning" size="large" rounded>
          <v-icon> mdi-note-text-outline </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="quotation != null">
      <v-row class="mt-2">
        <v-col>
          <div class="text-center">
            <v-btn
              color="secondary"
              class="w-100"
              @click="openDialogAddPart"
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
                              @click="removeSelectedItem"
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
                                @click="choosePreset(preset, category)"
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
                              <tr
                                v-for="(notItem, index) in notEnoughItems"
                                :key="index"
                              >
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
                    @click="submitAddQuotaionItem"
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
      <v-row>
        <v-col>
          <v-table class="border rounded-sm custom-table" density="compact">
            <tbody>
              <tr v-for="(detail, index) in quotationDetail" :key="index">
                <td>
                  <div class="mt-4">
                    {{ index + 1 }}. {{ detail.preset.Preset }}
                  </div>
                  <v-table class="my-4 border">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>รหัสอุปกรณ์</th>
                        <th>ชื่ออุปกรณ์</th>
                        <th class="text-end">จำนวน</th>
                        <th class="text-end">ราคา/หน่วย</th>
                        <th class="text-end">ค่าบริการ</th>
                        <th class="text-end">จำนวนเงิน</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(part, i) in detail.quotationParts" :key="i">
                        <td>{{ i+1 }}.</td>
                        <td>{{ part.part.PartNumber }}</td>
                        <td>{{ part.part.PartName_en }}</td>
                        <td class="text-end">{{ part.NumOfUse }}</td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(part.part.PricePerUnit) }}
                        </td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(part.part.ServiceFee) }}
                        </td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(sumPriceSinglePart(part)) }}
                        </td>
                        <td><v-btn size="small" color="error" variant="tonal"><v-icon>mdi-trash-can-outline</v-icon></v-btn></td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>
            </tbody>
          </v-table>
          <!-- test -->
        </v-col>
      </v-row>
      <div class="mt-5">
        <b>หมายเหตุ</b>&nbsp;:&nbsp;
        <v-textarea v-model="quotation.Comment" rows="1" />
      </div>
    </div>
  </UiParentCard>
</template>

<style scoped>
.high-fat-row {
  background-color: #ffebee !important;
  /* background-color: #ffcdd2 !important; */
}

.high-fat-row:hover {
  background-color: #ffcdd2 !important;
}

.custom-table :deep(.v-table__wrapper) {
  border: 0px solid #000; /* <-- เปลี่ยนสีขอบรอบนอกที่นี่ */
  border-radius: 4px;
}

.custom-table :deep(td),
.custom-table :deep(th) {
  border-bottom: 0px solid #000 !important; /* <-- เปลี่ยนสีเส้นคั่นระหว่างแถว */
}
</style>
