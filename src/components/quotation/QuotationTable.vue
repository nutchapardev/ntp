<script>
import serverService from "@/services/serverService";
import { toThaiDateString, getColorByNumber } from "@/utils/functions";
import Swal from "sweetalert2";
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
    };
  },
  methods: {
    formatDate(date) {
      return toThaiDateString(date);
    },
    async getQuotation() {
      const response = await serverService.getQuotation();
      this.quotations = response.data;
    },
    async getBrands() {
      const response = await serverService.getBrands();
      this.brands = response.data;
    },
    async getCarModel(brandId) {
      const response = await serverService.getCarModelByBrandID(brandId);
      this.models = response.data;
    },
    async submitAddQuotation() {
      console.log("add quotation");
    },
    openDialogAddQuotation() {
      this.dialogAddQuotation = true;
    },
    closeDialogAddQuotation() {
      this.dialogAddQuotation = false;
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
  <v-row>
    <v-col cols="12" md="9">
      <v-text-field
        v-model="search"
        label="ค้นหา"
        prepend-inner-icon="mdi-magnify"
      />
    </v-col>
    <v-col cols="12" md="3">
      <v-btn
        height="48"
        block
        color="secondary"
        variant="flat"
        dark
        @click="openDialogAddQuotation"
        ><v-icon size="20">mdi-plus-circle-outline</v-icon>
        <span class="hidden-sm-and-down">&nbsp;สร้างใบเสนอราคา</span>
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table
    class="border rounded-md"
    :search="search"
    :headers="headers"
    :items="quotations"
  >
    <template v-slot:item.QuotationDate="{ item }">
      {{ formatDate(item.QuotationDate) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        :to="`/system/quotation/details/${item.QuotationID}`"
        size="small"
        color="primary"
        variant="tonal"
        ><EditIcon size="16">mdi-paperclip</EditIcon></v-btn
      >
    </template>
  </v-data-table>
  <!-- Dialog AddQuotation -->
  <v-dialog
    v-model="dialogAddQuotation"
    class="dialog-mw"
    style="max-width: 500px"
    persistent
  >
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
        <v-select
          class="mt-2"
          v-model="quotationDataSet.ModelID"
          :items="models"
          item-value="ModelID"
          item-title="Model"
          label="รุ่น"
        />
        <v-textarea label="หมายเหตุ"></v-textarea>
      </v-card-text>
      <hr />
      <v-card-actions>
        <v-btn
          color="primary"
          @click="submitAddQuotation"
          block
          flat
          variant="tonal"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeDialogAddQuotation" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog AddQuotation -->
</template>
