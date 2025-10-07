<script>
import serverService from "@/services/serverService";
import { toThaiDateString, getColorByNumber } from "@/utils/functions";

export default {
  data() {
    return {
      page: { title: "รายละเอียดใบแจ้งหนี้" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "Invoices",
          disabled: false,
          href: "#",
        },
        {
          text: "รายละเอียดใบแจ้งหนี้",
          disabled: false,
          href: "#",
        },
      ],
      invoice: null,
      companyData: null,
      customerId: null,
    };
  },
  methods: {
    fotmatDate(date) {
      return toThaiDateString(date);
    },
    async getInvoiceByID() {
      const response = await serverService.getInvoiceByID(this.invoiceId);
      console.log("invoice", response.data);
      this.invoice = response.data;
      this.customerId = this.invoice.repair.car.customer.CustomerID || null;
    },
    async getCompanyData() {
      const response = await serverService.getCompanyData();
      this.companyData = response.data[0];
    },
    async initialize() {
      await this.getInvoiceByID();
      await this.getCompanyData();
    },
  },
  created() {
    this.initialize();
  },
  computed: {
    invoiceId() {
      return this.$route.params.invoiceID;
    },
  },
};
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-card v-if="invoice != null">
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <div class="d-flex">
            <div class="mr-3 d-none d-sm-flex">
              <img src="@/assets/ntp-logo.png" alt="logo" height="80px" />
            </div>
            <!-- <div class="text-14 textSecondary lh-normal"> -->
            <div class="text-14 lh-normal">
              <p class="font-weight-bold mb-2" style="font-size: 20px">
                {{ companyData?.CompanyName }}
              </p>
              {{ companyData?.AddressLine1 }}
              {{ companyData?.AddressLine2 }}<br />
              {{ companyData?.AddressLine3 }}
              <br />
              <p>เลขประจำตัวผู้เสียภาษี : {{ companyData?.IDNumber }}</p>
              <p>เบอร์โทรศัพท์ : {{ companyData?.CompanyTel }}</p>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="text-start text-md-end text-14 lh-normal"
        >
          <p class="font-weight-bold mb-2" style="font-size: 20px">
            ใบเสร็จรับเงิน / ใบกำกับภาษี
          </p>
          <div class="d-flex">
            <div></div>
            <v-spacer></v-spacer>
            <div class="text-start">
              <p>เลขที่&nbsp;&nbsp; {{ invoiceId }}</p>
              <p>
                วันที่&nbsp;&nbsp;&nbsp; {{ fotmatDate(invoice.InvoiceDate) }}
              </p>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-table density="compact" class="mt-2 border rounded-md">
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="text-14 text-no-wrap">รถยนต์หมายเลขทะเบียน</td>
                  <td class="text-14">
                    {{ invoice.repair.car.CarTitle }}
                    {{ invoice.repair.car.CarNumber }}
                    {{ invoice.repair.car.province.name_th }}
                  </td>
                </tr>
                <tr>
                  <td class="text-14">ยี่ห้อ / รุ่น</td>
                  <td class="text-14">
                    {{ invoice.repair.car.brand.Brand }}
                    ( {{ invoice.repair.car.model.Model }} )
                  </td>
                </tr>
                <tr>
                  <td class="text-14">หมายเลขเครื่องยนต์</td>
                  <td class="text-14">{{ invoice.repair.car.EC }}</td>
                </tr>
                <tr>
                  <td class="text-14">หมายเลขตัวถัง</td>
                  <td class="text-14">{{ invoice.repair.car.VIN }}</td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="text-start text-14 lh-normal"
        >
          <!-- <p class="font-weight-bold mb-2" style="font-size: 20px">
            ข้อมูลลูกค้า
          </p>
          <div class="text-14 lh-normal">
            {{ invoice.repair.car.customer.customerTitle.CustomerTitle }}
            {{ invoice.repair.car.customer.CustomerName }}
            {{ invoice.repair.car.customer.CustomerSurname }}
            <p>เบอร์โทรศัพท์ : 0939477141</p>
          </div> -->
          <v-table density="compact" class="mt-2 border rounded-md">
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="text-14 text-no-wrap">ชื่อลูกค้า</td>
                  <td class="text-14">
                    {{
                      invoice.repair.car.customer.customerTitle.CustomerTitle
                    }}
                    {{ invoice.repair.car.customer.CustomerName }}
                    {{ invoice.repair.car.customer.CustomerSurname }}
                  </td>
                </tr>
                <tr>
                  <td class="text-14">เลขประจำตัวผู้เสียภาษี</td>
                  <td class="text-14">
                    {{ invoice.repair.car.customer.IDNumber }}
                  </td>
                </tr>
                <tr>
                  <td class="text-14">ที่อยู่</td>
                  <td class="text-14">-</td>
                </tr>
                <tr>
                  <td class="text-14">เบอร์โทรศัพท์</td>
                  <td class="text-14"> {{ invoice.repair.car.customer.CustomerTel }}</td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
