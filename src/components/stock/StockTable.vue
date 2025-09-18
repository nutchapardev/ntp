<script>
import serverService from "@/services/serverService";
import { formatCurrency } from "@/utils/functions";

export default {
  name: "StockTable",
  data() {
    return {
      search: "",
      headers: [
        { title: "#ID", align: "start", key: "PartID" },
        { title: "รหัสอุปกรณ์", align: "start", key: "PartNumber" },
        { title: "ชื่ออุปกรณ์ TH", align: "start", key: "PartName_th" },
        { title: "ชื่ออุปกรณ์ EN", align: "start", key: "PartName_en" },
        { title: "ราคาต่อหน่วย (บาท)", align: "end", key: "PricePerUnit" },
        { title: "จำนวนในคลัง", align: "end", key: "PartAmount" },
        { title: "", align: "end", key: "actions" },
      ],
      parts: [
        {
          PartID: 1,
          PartNumber: "PARTXXX001",
          PartName_th: "PARTXXX001_NAME_TH",
          PartName_en: "PARTXXX001_NAME_EN",
          PartAmount: 45,
          PricePerUnit: 50.25,
          UnitID: 1,
          unit: {
            UnitID: 1,
            Unit: "ชื้น",
          },
        },
      ],
      seletedEdit: null,
      dialogEditPart: false,
    };
  },
  methods: {
    formatSeperateCurrency(total) {
      return formatCurrency(total);
    },
    async EditPart(PartID) {
      alert("Edit PartID : ", PartID);
    },
    async DeletePart(PartID) {
      alert("Delete PartID : ", PartID);
    },
    async getParts() {
      const response = await serverService.getAllParts();
      this.parts = response.data;
    },
    setRowClass({ item }) {
      if (item.PartAmount == 0) {
        return { class: "high-fat-row" };
      }
      return { class: "" };
    },
    closeEditPartDialog() {
      this.dialogEditPart = false;
      this.seletedEdit = null;
    },
  },
  mounted() {
    this.getParts();
  },
};
</script>

<template>
  <v-row>
    <v-col>
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        v-model="search"
        label="Search..."
      ></v-text-field>
    </v-col>
  </v-row>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="parts"
    items-per-page="10"
    :row-props="setRowClass"
    class="border rounded-md"
    density="compact"
  >
    <template v-slot:item.PricePerUnit="{ item }">
      <div class="text-end">
        {{ formatSeperateCurrency(item.PricePerUnit) }}
      </div>
    </template>

    <template v-slot:item.PartAmount="{ item }">
      {{ item.PartAmount }} {{ item.unit.Unit }}
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-3 align-center justify-center">
        <div>
          <v-avatar
            color="lightsuccess"
            size="32"
            @click="EditPart(item.PartID)"
          >
            <EditIcon class="text-success" size="18" />
          </v-avatar>
          <v-tooltip activator="parent" location="bottom">Edit</v-tooltip>
        </div>
        <div>
          <v-avatar
            color="lighterror"
            size="32"
            @click="DeletePart(item.PartID)"
          >
            <TrashIcon class="text-error" size="18" />
          </v-avatar>
          <v-tooltip activator="parent" location="bottom">Delete</v-tooltip>
        </div>
      </div>
    </template>
  </v-data-table>
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
