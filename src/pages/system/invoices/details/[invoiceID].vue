<script>
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { sum } from "lodash";
import { toThaiDateString, formatCurrency, getColorByNumber } from "@/utils/functions";
import router from "@/router";
import { apiUrl } from "@/services/constants";

export default {
  data() {
    return {
      apiUrl,
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
      vatRate: 0.07,
      isEdit: false, // ถ้ามีการแก้ไขตัวเลขส่วนลด จะไม่สามารถกดยืนยันใบแจ้งหนี้ได้
      percent_bath: [
        { id: 1, title: "บาท" },
        { id: 2, title: "%" },
      ],
      // fetch Data
      RepairItems: null,
      repairDetails: null,
      // rules
      numberRules: [
        (v) => {
          if (v === null || v === undefined || v === "") return true; // อนุญาตให้ค่าว่าง
          if (v >= 0) return true; // ผ่าน ถ้าค่ามากกว่าหรือเท่ากับ 0
          return "ไม่สามารถระบุค่าต่ำกว่า 0 ได้"; // ไม่ผ่าน
        },
      ],
    };
  },
  methods: {
    goBack() {
      router.back();
    },
    fotmatDate(date) {
      return toThaiDateString(date);
    },
    getColor(number) {
      return getColorByNumber(number);
    },
    formatSeperateCurrency(total) {
      return formatCurrency(total);
    },
    editDoing() {
      this.isEdit = true;
    },
    sumRowCost(part) {
      let subtotal = part.part.PricePerUnit * part.NumOfUse + part.ServiceFee;
      let discount = part.isDiscount === 1 ? part.Discount : (part.Discount / 100) * subtotal;
      return subtotal - discount;
    },
    sumPartsCost(parts) {
      return sum(
        (parts ?? []).map((part) => {
          let subtotal = (part.PricePerUnit ?? 0) * (part.NumOfUse ?? 0) + (part.ServiceFee ?? 0);
          let discount = part.isDiscount === 1 ? part.Discount : (part.Discount / 100) * subtotal;
          return subtotal - discount;
        })
      );
    },
    customerAddress() {
      const { addresses } = this.invoice.repair.car.customer;
      if (addresses.length == 0) return null;
      const data = addresses.filter((address) => address.IsDefault == true)[0];
      let customerDefaultAddress = `${data.Line1} ${data.Line2} ${data.subDistrict.name_th}, ${data.district.name_th}, ${data.province.name_th} ${data.subDistrict.Zipcode}`;
      return customerDefaultAddress;
    },
    async getInvoiceByID() {
      this.invoice = (await serverService.getInvoiceByID(this.invoiceId)).data;
      this.customerId = this.invoice.repair.car.customer.CustomerID || null;
      this.invoice.isVat = this.invoice.isVat === 1 ? true : false;
    },
    async getCompanyData() {
      this.companyData = (await serverService.getCompanyData()).data[0];
    },
    async getRepairByID() {
      const repairId = this.invoice.RepairID;
      this.RepairItems = (await serverService.getRepairByID(repairId)).data;
    },
    async getRepairDetail() {
      const repairId = this.invoice.RepairID;
      this.repairDetails = (await serverService.getRepairDetailByRepairID(repairId)).data;
    },
    async saveSubmitEdit() {
      let payload = [];
      this.repairDetails.forEach((e) => {
        payload = [...payload, ...e.repairParts];
      });
      if (payload.length == 0) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "ไม่พบข้อมูลในรายการใบแจ้งหนี้",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องแก้ไขข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.bulkUpdateRepairPart({
            updates: payload,
          });
          console.log(response.data);

          if (response.data.result) {
            this.initialize();
            Swal.fire("Success!", "แก้ไขข้อมูลแล้ว", "success");
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
      const { isVat, InvoiceID } = this.invoice;
      await serverService.updateInvoice(InvoiceID, { isVat });
    },
    async changeInvoiceStatus(statusId) {
      Swal.fire({
        title: "Are you sure?",
        text: "ยืนยันการดำเนินการ ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.updateInvoice(this.invoiceId, { InvoiceStatusID: statusId });
          if (response.data.result) {
            this.initialize();
            Swal.fire("Success!", "เปลี่ยนสถานะใบแจ้งหนี้แล้ว", "success");
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
    async initialize() {
      await this.getInvoiceByID().then(async () => {
        await this.getRepairByID();
        await this.getRepairDetail();
      });
      await this.getCompanyData();
      this.isEdit = false;
    },
  },
  created() {
    this.initialize();
  },
  computed: {
    invoiceId() {
      return this.$route.params.invoiceID;
    },
    subtotal() {
      return (this.repairDetails ?? []).reduce((sum, obj) => {
        return (
          sum +
          (obj.repairParts ?? []).reduce((sum2, part) => {
            let subtotal = (part.PricePerUnit ?? 0) * (part.NumOfUse ?? 0) + part.ServiceFee;
            let discount = part.isDiscount === 1 ? part.Discount : (part.Discount / 100) * subtotal;
            return sum2 + subtotal - discount;
          }, 0)
        );
      }, 0);
    },
    vat() {
      return this.subtotal * (this.invoice.isVat ? this.vatRate : 0);
    },
    grandTotal() {
      return parseFloat(this.subtotal) + parseFloat(this.vat);
    },
  },
};
</script>
<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
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
              {{ companyData?.AddressLine1 }} {{ companyData?.AddressLine2 }}<br />
              {{ companyData?.AddressLine3 }}
              <br />
              <p>เลขประจำตัวผู้เสียภาษี : {{ companyData?.IDNumber }}</p>
              <p>เบอร์โทรศัพท์ : {{ companyData?.CompanyTel }}</p>
            </div>
          </div>
        </v-col>
        <v-col cols="12" md="6" class="text-start text-md-end text-14 lh-normal">
          <p class="font-weight-bold mb-2" style="font-size: 20px">ใบแจ้งหนี้</p>
          <div class="d-flex">
            <div></div>
            <v-spacer></v-spacer>
            <div class="text-start">
              <p>เลขที่&nbsp;&nbsp; {{ invoiceId }}</p>
              <p>วันที่&nbsp;&nbsp;&nbsp; {{ fotmatDate(invoice.InvoiceDate) }}</p>
              <div class="text-end">
                <v-btn class="mt-2 text-end" color="primary" variant="tonal">
                  {{ invoice.invoiceStatus.InvoiceStatus }}
                </v-btn>
              </div>
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
                    {{ invoice.repair.car.CarTitle }} {{ invoice.repair.car.CarNumber }} {{ invoice.repair.car.province.name_th }}
                  </td>
                </tr>
                <tr>
                  <td class="text-14">ยี่ห้อ / รุ่น</td>
                  <td class="text-14">{{ invoice.repair.car.brand.Brand }} ( {{ invoice.repair.car.model.Model }} )</td>
                </tr>
                <tr>
                  <td class="text-14">หมายเลขเครื่องยนต์</td>
                  <td class="text-14">{{ invoice.repair.car.EC ?? "-" }}</td>
                </tr>
                <tr>
                  <td class="text-14">หมายเลขตัวถัง</td>
                  <td class="text-14">{{ invoice.repair.car.VIN ?? "-" }}</td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-col>
        <v-col cols="12" md="6" class="text-start text-14 lh-normal">
          <v-table density="compact" class="mt-2 border rounded-md">
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="text-14 text-no-wrap">ชื่อลูกค้า</td>
                  <td class="text-14">
                    {{ invoice.repair.car.customer.customerTitle.CustomerTitle }}
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
                  <td class="text-14 text-truncate" style="max-width: 200px">
                    {{ customerAddress() ?? "-" }}
                    <v-tooltip activator="parent" location="top">
                      {{ customerAddress() }}
                    </v-tooltip>
                  </td>
                </tr>
                <tr>
                  <td class="text-14">เบอร์โทรศัพท์</td>
                  <td class="text-14">
                    {{ invoice.repair.car.customer.CustomerTel }}
                  </td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-col>
      </v-row>
      <v-table class="border rounded-md mt-5 mb-2" density="compact">
        <template v-slot:default>
          <tbody>
            <tr v-for="(item, i) in repairDetails" :key="i">
              <td>
                <v-table class="invoice-table" density="compact">
                  <template v-slot:default>
                    <!-- <thead v-if="i == 0"> -->
                    <thead>
                      <tr>
                        <th class="text-14 text-no-wrap text-start"><span> # รายการหลัก</span></th>
                        <th class="text-14 text-no-wrap text-center"><span>รายละเอียด</span></th>
                        <th class="text-14 text-no-wrap text-end"><span>จำนวน</span></th>
                        <th class="text-14 text-no-wrap text-end"><span>ราคาต่อหน่วย</span></th>
                        <th class="text-14 text-no-wrap text-end"><span>ค่าบริการ</span></th>
                        <th class="text-14 text-no-wrap text-end"><span>ส่วนลด</span></th>
                        <th class="text-14 text-no-wrap text-center">% / บาท</th>
                        <th class="text-14 text-no-wrap text-end"><span>จำนวนเงิน</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(part, index) in item.repairParts" :key="index">
                        <td v-if="index == 0" width="30%" class="text-wrap">{{ i + 1 }}. {{ item.preset.Preset }}</td>
                        <td v-else width="30%" class="text-wrap"></td>
                        <td width="35%">{{ part.part.PartName_th }}</td>
                        <td class="text-end">{{ part.NumOfUse }}</td>
                        <td class="text-end">{{ formatSeperateCurrency(part.part.PricePerUnit) }}</td>
                        <td class="text-end">{{ formatSeperateCurrency(part.ServiceFee) }}</td>
                        <td width="15%" style="align-items: center; justify-content: center" class="text-end">
                          <v-text-field
                            v-if="invoice.InvoiceStatusID == 1"
                            v-model="part.Discount"
                            density="compact"
                            variant="underlined"
                            type="number"
                            step="0.00"
                            min="0.00"
                            :rules="numberRules"
                            @change="editDoing"
                          ></v-text-field>
                          <span v-else>{{ part.Discount === 0 ? "-" : formatSeperateCurrency(part.Discount) }}</span>
                        </td>
                        <td width="20%" class="text-center">
                          <v-select
                            v-if="invoice.InvoiceStatusID == 1"
                            v-model="part.isDiscount"
                            :items="percent_bath"
                            variant="underlined"
                            item-value="id"
                            item-title="title"
                            density="compact"
                            @update:model-value="editDoing"
                          ></v-select>
                          <span v-else>{{ part.isDiscount === 1 ? "บาท" : "%" }}</span>
                        </td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(sumRowCost(part)) }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="4" class="text-14 font-weight-semibold text-end"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="text-14 font-weight-semibold text-end">
                          <u>
                            {{ formatSeperateCurrency(sumPartsCost(item.repairParts)) }}
                          </u>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-table>
              </td>
              <!-- <td class="text-14">15.25</td>
                <td class="text-14">15 ชิ้น</td>
                <td class="text-14 font-weight-semibold text-end">
                  calculateTotalCost
                </td> -->
            </tr>
          </tbody>
        </template>
      </v-table>
      <v-row class="d-flex justify-end border-t mt-1">
        <v-col cols="12" md="3" class="mt-3">
          <div class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4">
            <p class="text-muted">Sub Total:</p>
            <p class="text-16">{{ formatSeperateCurrency(subtotal) }}</p>
          </div>
          <div class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4">
            <div class="d-flex align-center justify-space-between">
              <p class="text-muted">
                Vat : {{ (vatRate * 100).toFixed(0) }}
                %&nbsp;&nbsp;
              </p>
              <v-switch
                v-show="invoice.InvoiceStatusID == 1"
                v-model="invoice.isVat"
                @change="switchVat"
                color="orange"
                hide-details
              ></v-switch>
            </div>
            <p class="text-16">{{ formatSeperateCurrency(vat) }}</p>
          </div>
          <div class="d-flex align-center justify-space-between text-14 font-weight-semibold">
            <p class="text-muted">Grand Total:</p>
            <p class="text-16">{{ formatSeperateCurrency(grandTotal) }}</p>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="goBack" color="error" variant="flat" class="mb-3 ml-3">ย้อนกลับ</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-show="invoice.InvoiceStatusID == 2" color="success" variant="flat" class="mb-3 mr-2" @click="changeInvoiceStatus(3)">
        <CheckIcon size="18" /> &nbsp;ยืนยันการชำระเงิน
      </v-btn>
      
      <v-btn
        v-show="invoice.InvoiceStatusID == 1"
        color="secondary"
        variant="flat"
        class="mb-3 mr-2"
        @click="changeInvoiceStatus(2)"
        :disabled="isEdit"
      >
        <CheckIcon size="18" /> &nbsp;ยืนยันใบแจ้งหนี้
      </v-btn>
      <v-btn v-show="invoice.InvoiceStatusID == 2" color="black" variant="outlined" class="mb-3 mr-2" @click="changeInvoiceStatus(1)">
        <EditIcon size="18" /> &nbsp;แก้ไขใบแจ้งหนี้
      </v-btn>
      <v-btn color="warning" :to="`/system/repairs/details/${invoice.repair.RepairID}`" variant="flat" class="mb-3 mr-2">
        <EyeIcon size="18" /> &nbsp;ดูรายละเอียดการซ่อม
      </v-btn>
      <v-btn :href="`${apiUrl}/pdf/create-invoice/${invoiceId}`" target="_blank" color="error" variant="outlined" class="mb-3 mr-2">
        <b>PDF</b>&nbsp;แสดงใบแจ้งหนี้
      </v-btn>
      <v-btn v-show="invoice.InvoiceStatusID == 1" @click="saveSubmitEdit" color="primary" variant="flat" class="mb-3 mr-3">
        บันทึกข้อมูล
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
