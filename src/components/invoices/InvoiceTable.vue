<script>
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { toThaiDateString, getColorByNumber } from "@/utils/functions";

export default {
  data() {
    return {
      search: "",
      invoices: [],
      headers: [
        {
          title: "#ID",
          key: "InvoiceID",
          align: "start",
          sortable: true,
        },

        {
          title: "ทะเบียน",
          align: "start",
          key: "repair.car.CarNumber",
        },
        {
          title: "สถานะ",
          align: "start",
          key: "invoiceStatus.InvoiceStatus",
        },
        {
          title: "วันที่สร้าง",
          align: "start",
          key: "InvoiceDate",
        },
        { title: "actions", key: "actions", sortable: false },
      ],
      //   dialog
      dialogCreateInvoice: false,
    };
  },
  methods: {
    getColor(number) {
      return getColorByNumber(number);
    },
    formatDate(date) {
      return toThaiDateString(date);
    },
    async getInvoices() {
      const response = await serverService.getInvoices();
      this.invoices = response.data;
    },
    openDialogCreateInvoice() {
      this.dialogCreateInvoice = true;
    },
    closeDialogCreateInvoice() {
      this.dialogCreateInvoice = false;
    },
    async initialize() {
      await this.getInvoices();
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
        @click="openDialogCreateInvoice"
        ><v-icon size="20">mdi-plus-circle-outline</v-icon>
        <span class="hidden-sm-and-down">&nbsp;สร้างใบแจ้งหนี้</span>
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table
    class="border rounded-md"
    :headers="headers"
    :items="invoices"
    :sort-by="[{ key: 'InvoiceDate', order: 'desc' }]"
  >
    <template v-slot:item.InvoiceDate="{ item }">
      {{ formatDate(item.InvoiceDate) }}
    </template>

    <template v-slot:item.repair.car.CarNumber="{ item }">
      {{ item.repair.car.CarTitle }}
      {{ item.repair.car.CarNumber }}
      {{ item.repair.car.province.name_th }}
    </template>

    <template v-slot:item.invoiceStatus.InvoiceStatus="{ item }">
      <v-chip
        :color="getColor(item.invoiceStatus.InvoiceStatusID)"
        :text="item.invoiceStatus.InvoiceStatus"
        class="text-uppercase"
        label
        size="small"
      ></v-chip>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex">
        <div>
          <v-btn
            color="lightprimary"
            :to="`/system/invoices/details/${item.InvoiceID}`"
          >
            <v-icon class="text-primary" size="20">mdi-send-variant</v-icon>
          </v-btn>
          <!-- <v-tooltip activator="parent" location="top">แก้ไข</v-tooltip> -->
        </div>
      </div>
    </template>
  </v-data-table>
</template>
