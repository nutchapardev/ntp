<script>
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { sum } from "lodash";
import { apiUrl } from "@/services/constants";
import { toThaiDateString, toThaiDateTimeString, formatCurrency, getColorByNumber } from "@/utils/functions";
export default {
  data() {
    return {
      apiUrl,
      isCanEdit: true,
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
      vatRate: 0.07,
      isVat: false,
      refItems: [],
      showPresetDetail: null,
      selectedItems: [],
      parts: [],
      carsItems: [],
      cashpledge: null,
      showPresetDetail: null,
      isNotEnoughItem: false,
      carIdForSearch: null,
      // dialog
      dialogAddPart: false,
      dialogAddItems: false,
      dialogCustomer: false,
      dialogCashPledge: false,
      // dataset
      addItem: {
        QuotationDetailID: null,
        PartID: null,
        NumOfUse: null,
        PricePerUnit: null,
        PartAmount: null, // for show
        ServiceFee: null,
      },
      defaultItem: {
        QuotationDetailID: null,
        PartID: null,
        NumOfUse: null,
        PricePerUnit: null,
        PartAmount: null, // for show
        ServiceFee: null,
      },
      expanded: [],
      cashPledgeDataSet: {
        amount: 0,
      },
    };
  },
  methods: {
    formatSeperateCurrency(total) {
      return formatCurrency(total);
    },
    formatDate(date) {
      return date ? toThaiDateString(new Date(date), "E, MMM dd, yyyy") : "N/A";
    },
    formatDateTime(date) {
      return date ? toThaiDateTimeString(new Date(date)) : "N/A";
    },
    async getQuotation() {
      this.isNotEnoughItem = false;
      const response = await serverService.getQuotationByID(this.QuotationID);
      this.quotation = response.data;
      this.isCanEdit = response.data.repairs.length == 0 ? true : false;
      this.quotation.isVat = this.quotation.isVat === 1 ? true : false;
    },
    async getQuotationDetail() {
      // this.isNotEnoughItem = false;
      const response = await serverService.getQuotationDetailByQuotationID(this.quotationId);
      if (response.data.length > 0) {
        this.isNotEnoughItem = false;
      } else {
        this.isNotEnoughItem = true;
      }
      this.quotationDetail = response.data;
    },
    async getRefModelCategoryPartByBrandID() {
      const response = await serverService.getRefModelCategoryPartByModelID(this.quotation.ModelID);
      this.refItems = response.data;
    },
    async getParts() {
      const response = await serverService.getAllParts();
      this.parts = response.data;
    },
    async getCars() {
      try {
        const response = await serverService.getCarByModel(this.quotation.model.ModelID);
        this.carsItems = response.data;
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    },
    async getCashPledge() {
      const response = await serverService.getCashPledgeByQuotationID(this.quotationId);
      this.cashpledge = response.data.length > 0 ? response.data[0] : null
    },
    async submitAddQuotaionItem() {
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
            RepairCategoryID: this.showPresetDetail.repairCategory.RepairCategoryID,
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

          const response = await serverService.createQuotationDetailsWithParts(payload);
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
    async submitAddItem() {
      const { PartID, NumOfUse } = this.addItem;
      if (!PartID || PartID == null || NumOfUse == null || NumOfUse <= 0 || NumOfUse == "") {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "กรุณากรอกข้อมูลให้ครบถ้วน",
          timer: 1500,
          showConfirmButton: false,
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
          delete this.addItem.PartAmount;
          this.addItem.NumOfUse = parseInt(this.addItem.NumOfUse);
          const response = await serverService.createQuotationPart(this.addItem);
          if (response.data.result) {
            this.getQuotationDetail();
            this.closeDialogAddItems();
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
    async openDialogAddItems(item) {
      this.addItem.QuotationDetailID = item.QuotationDetailID;
      await this.getParts();
      nextTick(() => {
        this.dialogAddItems = true;
      });
    },
    async deletePreset(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการลบข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.deleteQuotationDetailsWithParts(item.QuotationDetailID
          // , {
          //   quotationParts: item.quotationParts,
          // }
        );
          if (response.data.result) {
            this.initialize();
            Swal.fire("Success!", "ลบข้อมูลแล้ว", "success");
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
    async deletePartInQuotationPart(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการลบข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.deleteQuotationPartByID(item.QuotationPartID);
          if (response.data.result) {
            this.initialize();
            Swal.fire("Success!", "ลบข้อมูลแล้ว", "success");
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
    async saveComment() {
      const { QuotationID, Comment } = this.quotation;
      const response = await serverService.updateQuotationByID(QuotationID, {
        Comment,
      });
      if (response.data.result) {
        Swal.fire("Success!", "บันทึกหมายเหตุแล้ว", "success");
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
    },
    async openDialogChooseCustomer() {
      await this.getCars();
      nextTick(() => {
        this.dialogCustomer = true;
      });
    },
    async submitChooseCustomer() {
      if (!this.carIdForSearch) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "กรุณาเลือกรถยนต์",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      const responseCar = await serverService.getCarByCarID(this.carIdForSearch);
      const payload = {
        QuotationID: this.quotationId,
        BrandID: responseCar.data.BrandID,
        ModelID: responseCar.data.ModelID,
        CarID: responseCar.data.CarID,
        CustomerID: responseCar.data.CustomerID,
      };

      const response = await serverService.createInvoiceWithRepair(payload);
      if (response.data.result) {
        this.closeDialogChooseCustomer();
        this.$router.push(`/system/repairs/${response.data.createRepair.RepairID}`);
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
    },
    async submitAddCashPledge() {
      if (this.cashpledge != null) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "ลูกค้าได้วางเงินมัดจำไปแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      if (this.cashPledgeDataSet.amount == 0) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "โปรดระบุจำนวนเงิน",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      if (this.cashPledgeDataSet.amount > this.grandTotal) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "จำนวนเงินมากกว่าราคาซ่อม",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการบันทึกข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const payload = {
            PledgeTitle: "เงินมัดจำ",
            PledgeAmount: this.cashPledgeDataSet.amount,
            QuotationID: this.quotationId,
          };
          const response = await serverService.createCashPledge(payload);
          if (response.data.result) {
            this.closeDialogCashPledge();
            this.initialize();
            Swal.fire("Success!", "บันทึกข้อมูลแล้ว", "success");
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
    async switchVat() {
      const { isVat } = this.quotation;
      await serverService.updateQuotationByID(this.quotationId, { isVat });
    },
    async deleteCashPledge(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการลบข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.deleteCashPledgeByID(id);
          if (response.data.result) {
            this.getCashPledge();
            Swal.fire("Success!", "ลบข้อมูลแล้ว", "success");
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
    openDialogCashPledge() {
      this.dialogCashPledge = true;
    },
    closeDialogCashPledge() {
      this.dialogCashPledge = false;
      this.cashPledgeDataSet.amount = 0; // reset default 0
    },
    closeDialogChooseCustomer() {
      this.dialogCustomer = false;
      this.carIdForSearch = null;
    },
    closeDialogAddItems() {
      this.dialogAddItems = false;
      nextTick(() => {
        this.addItem = Object.assign({}, this.defaultItem);
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
    async chooseOtherPreset() {
      const response = await serverService.createSingleQuotationDetails({
        QuotationID: this.quotationId,
        RepairCategoryID: 0,
        PresetID: 0,
      });
      if (response.data.result) {
        this.initialize();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "เพิ่มข้อมูลแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    },
    setAddItem(partId) {
      const filter = this.parts.filter((part) => part.PartID == partId);
      const data = filter[0];
      this.addItem.PartID = data.PartID;
      this.addItem.PricePerUnit = data.PricePerUnit;
      this.addItem.ServiceFee = data.ServiceFee;
      // this.addItem.PartAmount = data.PartAmount
    },
    sumPriceSinglePart(part) {
      const subtotal = part.NumOfUse * part.PricePerUnit;
      return subtotal + part.ServiceFee;
    },
    setRowColor(item) {
      if (this.isCanEdit == false) {
        return "";
      }

      if (item.NumOfUse <= item.part.PartAmount) {
        return "";
      } else {
        this.isNotEnoughItem = true;
        this.isCanRepair = false;
        return "background-color:#ffcdd2;color:#000;";
      }
    },
    async initialize() {
      await this.getQuotation();
      await this.getQuotationDetail();
      await this.getCashPledge();
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
      return this.showPresetDetail.presetDetails.filter((item) => item.NumOfUse > item.part.PartAmount).length > 0;
    },
    notEnoughItems() {
      return this.showPresetDetail.presetDetails.filter((item) => item.NumOfUse > item.part.PartAmount);
    },
    aviableItems() {
      return this.showPresetDetail.presetDetails.filter((item) => item.NumOfUse <= item.part.PartAmount);
    },
    setRowClass({ item }) {
      if (item.NumOfUse > item.part.PartAmount) {
        return { class: "high-fat-row" };
      }
      return { class: "" };
    },
    subtotal() {
      return (this.quotationDetail ?? []).reduce((sum, obj) => {
        return (
          sum +
          (obj.quotationParts ?? []).reduce((sum2, part) => {
            let subtotal = (part.PricePerUnit ?? 0) * (part.NumOfUse ?? 0) + part.ServiceFee;
            return sum2 + subtotal;
          }, 0)
        );
      }, 0);
    },
    vat() {
      return this.subtotal * (this.quotation.isVat ? this.vatRate : 0);
      // return this.subtotal * this.vatRate;
    },
    grandTotal() {
      const total = parseFloat(this.subtotal) + parseFloat(this.vat);
      return total;
    },
  },
};
</script>
<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <UiParentCard Tableard title="รายละเอียดใบเสนอราคา" v-if="quotation != null">
    <v-row>
      <v-col cols="4" md="4">
        เลขที่ : {{ QuotationID }} <br />
        วันที่สร้าง : {{ formatDateTime(quotation.createdAt) }} <br />
        ยี่ห้อ/รุ่น : {{ quotation.brand.Brand }} {{ quotation.model.Model }}
      </v-col>
      <v-col class="text-end">
        <v-btn v-if="quotation.repairs.length > 0" color="warning" size="small" class="mr-3" :to="`/system/repairs/details/${quotation.repairs[0].RepairID}`">
          <v-icon>mdi-note-text</v-icon>&nbsp; ดูรายละเอียดการซ่อม
        </v-btn>
        <v-btn v-else color="secondary" size="small" class="mr-3" :disabled="isNotEnoughItem" @click="openDialogChooseCustomer"> ส่งซ่อม </v-btn>
        <v-btn
          color="primary"
          size="small"
          variant="flat"
          class="mr-3"
          :disabled="quotationDetail.length == 0 || cashpledge != null"
          @click="openDialogCashPledge"
        >
          <CurrencyDollarIcon size="18" /> &nbsp;วางมัดจำ
        </v-btn>
        <v-btn
          :href="`${apiUrl}/pdf/create-quotation-group/${quotationId}`"
          target="_blank"
          color="success"
          size="small"
          class="mr-3"
          :disabled="quotationDetail.length == 0"
        >
          แสดงใบเสนอราคาแบบจัดกลุ่ม
        </v-btn>
        <v-btn :href="`${apiUrl}/pdf/create-quotation/${quotationId}`" target="_blank" color="primary" size="small" :disabled="quotationDetail.length == 0">
          แสดงใบเสนอราคาแบบรายการ
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="quotation != null">
      <v-row v-if="isCanEdit" class="mt-2">
        <v-col>
          <div class="text-center">
            <v-btn color="secondary" class="w-100" @click="openDialogAddPart" flat>
              <v-icon size="20">mdi-plus-circle-outline</v-icon>
              <span class="hidden-sm-and-down"> &nbsp;เพิ่มรายการ </span>
            </v-btn>
            <v-dialog v-model="dialogAddPart" class="dialog-mw" style="max-width: 1000px" persistent>
              <v-card>
                <v-card-text>
                  <v-row>
                    <v-col>
                      <div class="overflow-y-auto" style="max-height: 250px">
                        <!-- Popout -->
                        <v-expansion-panels variant="popout">
                          <v-expansion-panel v-for="(category, index) in refItems" :key="category.PartCategoryID" elevation="10">
                            <v-expansion-panel-title class="text-h6" color="info" @click="removeSelectedItem">
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
                          <v-expansion-panel elevation="10">
                            <v-expansion-panel-title class="text-h6" color="info" @click="removeSelectedItem"> อื่นๆ </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              <v-btn rounded="0" block variant="outlined" color="" class="mb-2" @click="chooseOtherPreset"> อื่นๆ </v-btn>
                            </v-expansion-panel-text>
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

                      <v-data-table
                        items-per-page="10"
                        :headers="headers"
                        :items="showPresetDetail.presetDetails"
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
                  <v-btn color="primary" block @click="submitAddQuotaionItem" flat variant="tonal">เพิ่มอุปกรณ์</v-btn>
                </v-card-actions>
                <v-card-actions>
                  <v-btn color="error" block @click="closeDialogAddPart" flat>ปิดหน้าต่าง</v-btn>
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
                  <div class="mt-4 d-flex align-center">
                    {{ index + 1 }}. {{ detail.preset.Preset }}
                    <div v-show="isCanEdit">
                      <v-btn flat icon color="lightprimary" size="x-small" class="ms-3" @click="openDialogAddItems(detail)">
                        <CirclePlusIcon class="text-primary" size="18" />
                        <v-tooltip activator="parent" location="bottom">เพิ่มอุปกรณ์</v-tooltip>
                      </v-btn>
                    </div>
                    <v-spacer />
                    <div v-show="isCanEdit">
                      <v-btn flat icon color="lighterror" size="x-small" class="ms-3" @click="deletePreset(detail)">
                        <CircleMinusIcon class="text-error" size="18" />
                        <v-tooltip activator="parent" location="bottom">ลบอุปกรณ์</v-tooltip>
                      </v-btn>
                    </div>
                  </div>
                  <v-table class="my-4 border">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>รหัสอุปกรณ์</th>
                        <th>ชื่ออุปกรณ์</th>
                        <th class="text-end">จำนวนที่คลัง</th>
                        <th class="text-end">จำนวนที่ใช้</th>
                        <th class="text-end">ราคา/หน่วย</th>
                        <th class="text-end">ค่าบริการ</th>
                        <th class="text-end">จำนวนเงิน</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(part, i) in detail.quotationParts" :key="i" :style="setRowColor(part)">
                        <td>{{ i + 1 }}.</td>
                        <td>{{ part.part.PartNumber }}</td>
                        <td>
                          {{ part.part.PartName_th }}
                        </td>
                        <td class="text-end">
                          {{ part.part.PartAmount }}
                        </td>
                        <td class="text-end">
                          {{ part.NumOfUse }}
                        </td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(part.part.PricePerUnit) }}
                        </td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(part.part.ServiceFee) }}
                        </td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(sumPriceSinglePart(part)) }}
                        </td>
                        <td>
                          <v-btn size="small" color="error" variant="tonal" @click="deletePartInQuotationPart(part)"
                            ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                          >
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-row class="d-flex justify-end border-t mt-1">
            <v-col cols="12" md="3" class="mt-3">
              <div class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4">
                <p class="text-muted">Sub Total:</p>
                <p class="text-16">{{ formatSeperateCurrency(subtotal) }}</p>
              </div>
              <div class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4">
                <div class="d-flex align-center justify-space-between">
                  <p class="text-muted">Vat : {{ (vatRate * 100).toFixed(0) }} %&nbsp;&nbsp;</p>
                  <v-switch v-model="quotation.isVat" @change="switchVat" color="orange" hide-details></v-switch>
                </div>
                <p class="text-16">{{ formatSeperateCurrency(vat) }}</p>
              </div>
              <div class="d-flex align-center justify-space-between text-14 font-weight-semibold">
                <p class="text-muted">Grand Total:</p>
                <p class="text-16">{{ formatSeperateCurrency(grandTotal) }}</p>
              </div>
            </v-col>
          </v-row>
          <div v-if="cashpledge != null">
            <span class="mr-3">ลูกค้าวางเงินมัดจำ : {{ formatSeperateCurrency(cashpledge.PledgeAmount) }} บาท</span>
            <v-avatar @click="deleteCashPledge(cashpledge.CashPledgeID)" color="lighterror" size="32">
              <XIcon class="text-error cursor-pointer" size="18" />
            </v-avatar>
          </div>
          <!-- test -->
        </v-col>
      </v-row>
      <div class="row mt-5">
        <div class="col">
          <b>หมายเหตุ</b>&nbsp;:&nbsp;
          <v-textarea v-model="quotation.Comment" rows="1" />
        </div>
      </div>
      <v-row>
        <v-col class="text-end">
          <v-btn color="primary" @click="saveComment">บันทึกหมายเหตุ</v-btn>
        </v-col>
      </v-row>
    </div>
  </UiParentCard>
  <!-- dialog Add Items -->
  <v-dialog v-model="dialogAddItems" class="dialog-mw" style="max-width: 900px" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">Items</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="9">
            <v-autocomplete
              v-model="addItem.PartID"
              :items="parts"
              item-value="PartID"
              item-title="PartName_th"
              prepend-inner-icon="mdi-magnify"
              label="อุปกรณ์"
              hide-details
              color="primary"
              variant="outlined"
              autocomplete="false"
              @update:modelValue="setAddItem"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :title="`รหัส : ${item.raw.PartNumber} || ${item.raw.PartName_th}`"> </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="addItem.NumOfUse" type="number" label="จำนวนที่ใช้" hide-details />
          </v-col>
          <!-- <v-col cols="12" md="2">
            <v-text-field
              v-model="addItem.PartAmount"
              type="number"
              label="จำนวนในคลัง"
              readonly
              hide-details
            />
          </v-col> -->
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block flat @click="submitAddItem">เพิ่มอุปกรณ์</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" block flat @click="closeDialogAddItems">ปิดหน้าต่าง</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- dialog Add Items -->
  <!-- dialog Choose Customer -->
  <v-dialog v-model="dialogCustomer" class="dialog-mw" max-width="400px" persistent>
    <v-card>
      <v-card-text>
        <v-autocomplete
          v-model="carIdForSearch"
          :items="carsItems"
          item-value="CarID"
          item-title="CarNumber"
          prepend-inner-icon="mdi-magnify"
          label="ค้นหา"
          hide-details
          color="primary"
          variant="outlined"
          autocomplete="false"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item v-bind="props" :title="`${item.raw.CarTitle} ${item.raw.CarNumber} ${item.raw.province.name_th}`"> </v-list-item>
          </template>
          <template v-slot:selection="{ item }">
            <span>
              {{ item.raw.CarTitle }} {{ item.raw.CarNumber }}
              {{ item.raw.province.name_th }}
            </span>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="submitChooseCustomer" flat>ตกลง</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="secondary" block @click="closeDialogChooseCustomer" flat>ยกเลิก</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- dialog Choose Customer -->
  <!-- dialog Cash Pledge -->
  <v-dialog v-model="dialogCashPledge" class="dialog-mw" max-width="400px" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-secondary">เงินมัดจำ</v-card-title>
      <v-card-text>
        <v-text-field v-model="cashPledgeDataSet.amount" type="number" step="0.00" label="จำนวนเงิน" hide-details />
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="closeDialogCashPledge" flat>ยกเลิก</v-btn>

        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submitAddCashPledge" flat>บันทึกข้อมูล</v-btn>
      </v-card-actions>
      <!-- <v-card-actions>
        <v-btn color="secondary" block @click="closeDialogCashPledge" flat>ยกเลิก</v-btn>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
  <!-- dialog Cash Pledge -->
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
