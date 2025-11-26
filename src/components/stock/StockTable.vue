<script>
import serverService from "@/services/serverService";
import { formatCurrency } from "@/utils/functions";
import Swal from "sweetalert2";

export default {
  name: "StockTable",
  data() {
    return {
      search: "",
      headers: [
        { title: "#ID", align: "start", key: "PartID" },
        { title: "รหัสอุปกรณ์", align: "start", key: "PartNumber" },
        { title: "ชื่ออุปกรณ์", align: "start", key: "PartName_th" },
        // { title: "ชื่ออุปกรณ์ EN", align: "start", key: "PartName_en" },
        { title: "ราคาต่อหน่วย (บาท)", align: "end", key: "PricePerUnit" },
        { title: "จำนวนในคลัง", align: "end", key: "PartAmount" },
        { title: "", align: "end", key: "actions" },
      ],
      parts: [
        // {
        //   PartID: 1,
        //   PartNumber: "PARTXXX001",
        //   PartName_th: "PARTXXX001_NAME_TH",
        //   PartName_en: "PARTXXX001_NAME_EN",
        //   PartAmount: 45,
        //   PricePerUnit: 50.25,
        //   UnitID: 1,
        //   unit: {
        //     UnitID: 1,
        //     Unit: "ชื้น",
        //   },
        // },
      ],
      units: [],
      partDataSet: {
        PartNumber: "",
        PartName_th: "",
        PartName_en: "",
        PartAmount: 0,
        PricePerUnit: 0,
        UnitID: 1,
      },
      defaultItem: {
        PartNumber: "",
        PartName_th: "",
        PartName_en: "",
        PartAmount: 0,
        PricePerUnit: 0,
        UnitID: 1,
      },
      // dialog
      dialogEditPart: false,
      dialogAddPart: false,
    };
  },
  methods: {
    formatSeperateCurrency(total) {
      return formatCurrency(total);
    },
    async DeletePart(PartID) {
      alert("Delete PartID : ", PartID);
    },
    async getParts() {
      const response = await serverService.getAllParts();
      this.parts = response.data;
    },
    async getUnits() {
      const response = await serverService.getUnits();
      this.units = response.data;
    },
    async submitAddPart() {
      const { PartNumber, PartName_th } = this.partDataSet;
      if (PartNumber == "" || PartName_th == "") {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "กรุณากรอกรหัสอุปกรณ์ และชื่ออุปกรณ์",
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
            const response = await serverService.createPart(this.partDataSet);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogAddPart();
              this.initialize();
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
    async submitEditPart() {
      // console.log(this.partDataSet);
      const { PartID, PartNumber, PartName_th } = this.partDataSet;
      if (!PartID || PartNumber == "" || PartName_th == "") {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "กรุณากรอกรหัสอุปกรณ์ และชื่ออุปกรณ์",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการแก้ไขข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await serverService.updatePart(PartID, this.partDataSet);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "แก้ไขข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogEditPart();
              this.initialize();
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
              text: "ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    setRowClass({ item }) {
      if (item.PartAmount == 0) {
        return { class: "high-fat-row" };
      }
      return { class: "" };
    },
    openDialogEditPart(item) {
      this.dialogEditPart = true;
      this.partDataSet = {
        PartID: item.PartID,
        PartNumber: item.PartNumber,
        PartName_th: item.PartName_th,
        PartName_en: item.PartName_en,
        PartAmount: item.PartAmount,
        PricePerUnit: item.PricePerUnit,
        UnitID: item.UnitID,
      };
    },
    closeDialogEditPart() {
      this.dialogEditPart = false;
      nextTick(() => {
        this.partDataSet = Object.assign({}, this.defaultItem);
      });
    },
    openDialogAddPart() {
      this.dialogAddPart = true;
    },
    closeDialogAddPart() {
      this.dialogAddPart = false;
      nextTick(() => {
        this.partDataSet = Object.assign({}, this.defaultItem);
      });
    },
    async initialize() {
      await this.getParts();
      await this.getUnits();
    },
  },
  mounted() {
    this.initialize();
  },
};
</script>

<template>
  <div>
    <!-- <v-row>
    <v-col>
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        label="Search..."
      ></v-text-field>
    </v-col>
  </v-row> -->
    <v-row>
      <v-col cols="12" md="9">
        <v-text-field v-model="search" label="ค้นหา" prepend-inner-icon="mdi-magnify" />
      </v-col>
      <v-col cols="12" md="3">
        <v-btn height="48" block color="secondary" variant="flat" dark @click="openDialogAddPart"
          ><v-icon size="20">mdi-plus-circle-outline</v-icon>
          <span class="hidden-sm-and-down">&nbsp;เพิ่มอุปกรณ์</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table :search="search" :headers="headers" :items="parts" items-per-page="10" :row-props="setRowClass" class="border rounded-md">
      <template #[`item.PricePerUnit`]="{ item }">
        <div class="text-end">
          {{ formatSeperateCurrency(item.PricePerUnit) }}
        </div>
      </template>

      <template #[`item.PartAmount`]="{ item }"> {{ item.PartAmount }} {{ item.unit.Unit }} </template>

      <template #[`item.actions`]="{ item }">
        <div class="d-flex ga-3 align-center justify-center">
          <div>
            <v-avatar color="lightsuccess" size="32" @click="openDialogEditPart(item)">
              <EditIcon class="text-success" size="18" />
            </v-avatar>
            <v-tooltip activator="parent" location="bottom">Edit</v-tooltip>
          </div>
          <div>
            <v-avatar color="lighterror" size="32" @click="DeletePart(item.PartID)">
              <TrashIcon class="text-error" size="18" />
            </v-avatar>
            <v-tooltip activator="parent" location="bottom">Delete</v-tooltip>
          </div>
        </div>
      </template>
    </v-data-table>
    <!-- Dialog Add Preset -->
    <v-dialog v-model="dialogAddPart" class="dialog-mw" style="max-width: 500px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-secondary">
          <span class="text-h5">เพิ่มข้อมูลอุปกรณ์</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="รหัสอุปกรณ์" v-model="partDataSet.PartNumber" hide-details />
            </v-col>
            <v-col cols="12">
              <v-text-field label="ชื่ออุปกรณ์ (TH)" v-model="partDataSet.PartName_th" hide-details />
            </v-col>
            <v-col cols="12">
              <v-text-field label="ชื่ออุปกรณ์ (EN)" v-model="partDataSet.PartName_en" hide-details />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="จำนวนในคลัง" v-model="partDataSet.PartAmount" number hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="partDataSet.UnitID" :items="units" item-value="UnitID" item-title="Unit" label="หน่วย" hide-details />
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field label="ราคาต่อหน่วย" v-model="partDataSet.PricePerUnit" number hide-details />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" block flat @click="submitAddPart">บันทึกข้อมูล</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogAddPart" block flat>ปิดหน้าต่าง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Add Preset -->
    <!-- Dialog Edit Preset -->
    <v-dialog v-model="dialogEditPart" class="dialog-mw" style="max-width: 500px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-secondary">
          <span class="text-h5">แก้ไขข้อมูลอุปกรณ์</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field label="รหัสในระบบ" v-model="partDataSet.PartID" disabled hide-details />
            </v-col>
            <v-col cols="12">
              <v-text-field label="รหัสอุปกรณ์" v-model="partDataSet.PartNumber" hide-details />
            </v-col>
            <v-col cols="12">
              <v-text-field label="ชื่ออุปกรณ์ (TH)" v-model="partDataSet.PartName_th" hide-details />
            </v-col>
            <v-col cols="12">
              <v-text-field label="ชื่ออุปกรณ์ (EN)" v-model="partDataSet.PartName_en" hide-details />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="จำนวนในคลัง" v-model="partDataSet.PartAmount" number hide-details />
            </v-col>
            <v-col cols="12" md="6">
              <v-select v-model="partDataSet.UnitID" :items="units" item-value="UnitID" item-title="Unit" label="หน่วย" hide-details />
            </v-col>

            <v-col cols="12" md="12">
              <v-text-field label="ราคาต่อหน่วย" v-model="partDataSet.PricePerUnit" number hide-details />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" block flat @click="submitEditPart">บันทึกข้อมูล</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogEditPart" block flat>ปิดหน้าต่าง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Edit Preset -->
  </div>
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
