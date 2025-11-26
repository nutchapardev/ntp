<script>
import serverService from "@/services/serverService";
import { toThaiDateString, getColorByNumber } from "@/utils/functions";
import Swal from "sweetalert2";
// import router from "@/router";
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          title: "#ID",
          key: "QuotationID",
          align: "start",
          sortable: true,
        },
        {
          title: "วันที่",
          align: "start",
          sortable: false,
          key: "QuotationDate",
        },
        { title: "ยี่ห้อ / รุ่น", key: "model.Model" },
        { title: "หมายเหตุ", key: "Comment" },
        { title: "", key: "actions", sortable: false },
      ],
      quotations: [],
      brands: [],
      models: [],
      //   dialog
      dialogAddQuotation: false,
      //   dataset
      quotationDataSet: {
        BrandID: null,
        ModelID: null,
        Comment: "",
      },
      defaultItem: {
        BrandID: null,
        ModelID: null,
        Comment: "",
      },
    };
  },
  methods: {
    formatDate(date) {
      return toThaiDateString(date);
    },
    async getQuotation() {
      this.quotations = (await serverService.getQuotation()).data;
    },
    async getBrands() {
      this.brands = (await serverService.getBrands()).data;
    },
    async getCarModel(brandId) {
      this.models = (await serverService.getCarModelByBrandID(brandId)).data;
    },
    async submitAddQuotation() {
      const { BrandID, ModelID } = this.quotationDataSet;
      if (!BrandID || !ModelID) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "โปรดเลือก ยี่ห้อ/รุ่น ของรถยนต์",
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
          try {
            const response = await serverService.createQuotation(this.quotationDataSet);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogAddQuotation();
              this.getQuotation();
              this.$router.push(`/system/quotation/details/${response.data.data.QuotationID}`);
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
          } catch (error) {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "ไม่สามารถเพิ่มข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    openDialogAddQuotation() {
      this.dialogAddQuotation = true;
    },
    closeDialogAddQuotation() {
      this.dialogAddQuotation = false;
      nextTick(() => {
        this.quotationDataSet = Object.assign({}, this.defaultItem);
      });
    },
    async initialize() {
      await this.getQuotation();
      await this.getBrands();
    },
  },
  created() {
    this.initialize();
  },
};
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12" md="9">
        <v-text-field v-model="search" label="ค้นหา" prepend-inner-icon="mdi-magnify" />
      </v-col>
      <v-col cols="12" md="3">
        <v-btn height="48" block color="secondary" variant="flat" dark @click="openDialogAddQuotation"
          ><v-icon size="20">mdi-plus-circle-outline</v-icon>
          <span class="hidden-sm-and-down">&nbsp;สร้างใบเสนอราคา</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table class="border rounded-md" :search="search" :headers="headers" :items="quotations" :sort-by="[{ key: 'QuotationID', order: 'desc' }]">
      <template #[`item.QuotationDate`]="{ item }">
        {{ formatDate(item.QuotationDate) }}
      </template>
      <template #[`item.model.Model`]="{ item }">
        {{ item.brand.Brand }} ( {{ item.model.Model }} ) <br />

        <div v-if="item.repairs.length > 0" style="font-size: 12px; color: gray">
          {{ `${item.repairs[0].car.CarTitle} ${item.repairs[0].car.CarNumber} ${item.repairs[0].car.province.name_th}` }}
        </div>
      </template>
      <template #[`item.actions`]="{ item }">
        <v-btn :to="`/system/quotation/details/${item.QuotationID}`" size="small" color="primary" class="mr-2" variant="flat"
          ><EditIcon size="16">mdi-paperclip</EditIcon></v-btn
        >
        <v-btn v-if="item.repairs.length > 0" :to="`/system/repairs/details/${item.repairs[0].RepairID}`" size="small" color="warning" variant="flat">
          <v-icon>mdi-car-wrench</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <!-- Dialog AddQuotation -->
    <v-dialog v-model="dialogAddQuotation" class="dialog-mw" style="max-width: 500px" persistent>
      <v-card>
        <v-card-text>
          <!-- <v-text-field
          label="ชื่อกลุ่มงาน"
          v-model.trim="addRepairCategory.RepairCategory"
        ></v-text-field> -->
          <v-select
            class="mt-2"
            v-model="quotationDataSet.BrandID"
            :items="brands"
            item-value="BrandID"
            item-title="Brand"
            label="ยี่ห้อ"
            @update:modelValue="getCarModel"
          />
          <v-select class="mt-2" v-model="quotationDataSet.ModelID" :items="models" item-value="ModelID" item-title="Model" label="รุ่น" />
          <v-textarea label="หมายเหตุ" v-model="quotationDataSet.Comment"></v-textarea>
        </v-card-text>
        <!-- <hr /> -->
        <v-card-actions>
          <v-btn class="mb-3 ml-3" color="error" @click="closeDialogAddQuotation">ปิดหน้าต่าง</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="mb-3 mr-3" color="primary" @click="submitAddQuotation" variant="tonal">บันทึกข้อมูล</v-btn>
        </v-card-actions>
        <!-- <v-card-actions>
        <v-btn color="error" @click="closeDialogAddQuotation" block flat>ปิดหน้าต่าง</v-btn>
      </v-card-actions> -->
      </v-card>
    </v-dialog>
    <!-- Dialog AddQuotation -->
  </div>
</template>
