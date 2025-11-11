<script>
import serverService from "@/services/serverService";
import {
  // toThaiDateString,
  // toThaiDateTimeString,
  formatCurrency,
  getColorByNumber,
} from "@/utils/functions";
import { sum } from "lodash";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
export default {
  data() {
    const router = useRouter();
    const authStore = useAuthStore();
    return {
      router,
      authStore,
      page: { title: "ค่าใช้จ่ายโดยประมาณ" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "รายละเอียดการซ่อม",
          disabled: false,
          href: "#",
        },
        {
          text: "ค่าใช้จ่ายโดยประมาณ",
          disabled: false,
          href: "#",
        },
      ],
      RepairItems: null,
      repairDetails: [],
      companyData: null,
      isVat: false,
      vatRate: 0.07,
    };
  },
  methods: {
    getColor(number) {
      return getColorByNumber(number);
    },
    formatSeperateCurrency(total) {
      return formatCurrency(total);
    },
    sumPartsCost(parts) {
      return sum(
        (parts ?? []).map(
          (part) =>
            (part.PricePerUnit ?? 0) * (part.NumOfUse ?? 0) +
            (part.ServiceFee ?? 0)
        )
      );
    },
    async getRepairByID() {
      const response = await serverService.getRepairByID(this.repairID);
      this.RepairItems = response.data;
    },
    async getRepairDetail() {
      const response = await serverService.getRepairDetailByRepairID(
        this.repairID
      );
      this.repairDetails = response.data;
    },
    async getCompanyData() {
      const response = await serverService.getCompanyData();
      this.companyData = response.data[0];
    },
    async createQuotation() {
      console.log(this.RepairItems);
      const { RepairID, WorkStatusID } = this.RepairItems;
      if (!RepairID) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "ไม่พบ RepairID เกิดข้อผิดพลาดของระบบ",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการสร้างใบแจ้งหนี้ ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await serverService.createInvoice({ RepairID });
            console.log(response.data);

            if (response.data.result) {
              // เปลี่ยนสถานเป็น สร้างใบแจ้งหนี้
              if (WorkStatusID == 2) {
                await serverService.updateRepairByID(RepairID, {
                  WorkStatusID: 3,
                });
                // เปลี่ยนสถานเป็น สร้างใบแจ้งหนี้
              }
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "สร้างใบแจ้งหนี้สำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              // this.closeDialogAddCustomer()
              // this.initialize()
            } else {
              Swal.fire({
                icon: "warning",
                title: "Alert!",
                text: response.data.message,
                timer: 1500,
                showConfirmButton: false,
              });
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "ไม่สามารถสร้างใบแจ้งหนี้ได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    async initialize() {
      this.authStore.setLoadingOn();
      await this.getRepairByID().then(() => this.getRepairDetail());
      await this.getCompanyData();
      this.authStore.setLoadingOff();
    },
  },
  created() {
    this.initialize();
  },
  computed: {
    repairID() {
      return this.$route.params.repairID;
    },
    subtotal() {
      return (this.repairDetails ?? []).reduce((sum, obj) => {
        return (
          sum +
          (obj.repairParts ?? []).reduce((sum2, part) => {
            return sum2 + (part.PricePerUnit ?? 0) * (part.NumOfUse ?? 0);
          }, 0)
        );
      }, 0);
    },
    vat() {
      // return this.subtotal * (this.isVat ? this.vatRate : 0);
      return this.subtotal * this.vatRate;
    },
    grandTotal() {
      const total = parseFloat(this.subtotal) + parseFloat(this.vat);
      return total;
    },
  },
};
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <!-- <UiParentCard Tableard title="รายละเอียด"> -->
  <v-card elevation="10">
    <v-card-item>
      <div v-if="RepairItems">
        <!-- <div class="d-flex justify-space-between align-content-start mb-6">
            <div></div>
            <div>
              <v-chip
                rounded="pill"
                :color="getColor(RepairItems.workStatus.WorkStatusID)"
                variant="flat"
                size="small"
                label
                >{{ RepairItems.workStatus.WorkStatus_th }}</v-chip
              >
              <h5 class="text-20 text-end mt-1 font-weight-semibold">
                # {{ repairID }}
              </h5>
            </div>
          </div> -->
        <div class="mb-6">
          <v-row>
            <v-col cols="12" md="6">
              <!-- <h6 class="text-h6">Bill From</h6> -->
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
                  <p>เบอร์โทรศัพท์ : {{ companyData?.CompanyTel }}</p>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="text-start text-md-end text-14 lh-normal"
            >
              <!-- <h6 class="text-h6">Bill To</h6> -->
              <p class="font-weight-bold mb-2" style="font-size: 20px">
                ข้อมูลลูกค้า
              </p>
              <!-- <div class="text-14 textSecondary lh-normal"> -->
              <div class="text-14 lh-normal">
                {{ RepairItems.customer.customerTitle.CustomerTitle }}
                {{ RepairItems.customer.CustomerName }}
                {{ RepairItems.customer.CustomerSurname }}
                <div v-if="RepairItems.customer.addresses.length > 0">
                  {{ RepairItems.customer.addresses[0].Line1 }}
                  {{ RepairItems.customer.addresses[0].Line2 }}<br />
                  {{ RepairItems.customer.addresses[0].subDistrict.name_th }}
                  {{ RepairItems.customer.addresses[0].district.name_th }}
                  {{ RepairItems.customer.addresses[0].province.name_th }},
                  {{ RepairItems.customer.addresses[0].subDistrict.Zipcode }}
                </div>
                <p>เบอร์โทรศัพท์ : 0939477141</p>
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
                        {{ RepairItems.car.CarTitle }}
                        {{ RepairItems.car.CarNumber }}
                        {{ RepairItems.car.province.name_th }}
                      </td>
                    </tr>
                    <tr>
                      <td class="text-14">ยี่ห้อ / รุ่น</td>
                      <td class="text-14">
                        {{ RepairItems.car.brand.Brand }}
                        ( {{ RepairItems.car.model.Model }} )
                      </td>
                    </tr>
                    <tr>
                      <td class="text-14">หมายเลขเครื่องยนต์</td>
                      <td class="text-14">{{ RepairItems.car.EC }}</td>
                    </tr>
                    <tr>
                      <td class="text-14">หมายเลขตัวถัง</td>
                      <td class="text-14">{{ RepairItems.car.VIN }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-table>
            </v-col>
          </v-row>
        </div>

        <v-table class="border rounded-md mt-2 mb-2" density="compact">
          <template v-slot:default>
            <thead>
              <tr>
                <!-- <th class="text-14 text-no-wrap text-center">ลำดับ</th>
                <th class="text-14 text-no-wrap">รายการ</th>
                <th class="text-14 text-no-wrap">รายละเอียด</th> -->

                <!-- <th class="text-14 text-no-wrap">ราคาต่อหน่วย</th>
                <th class="text-14 text-no-wrap">จำนวน</th>
                <th class="text-14 text-no-wrap text-end">จำนวนเงิน</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in repairDetails" :key="i">
                <!-- <td class="text-14 font-weight-semibold">
                  {{ index + 1 }}. {{ item.preset.Preset }}
                </td> -->
                <td>
                  <v-table class="invoice-table" density="compact">
                    <template v-slot:default>
                      <!-- <thead v-if="i == 0"> -->
                      <thead>
                        <tr>
                          <th class="text-14 text-no-wrap text-start">
                            <span> # รายการหลัก</span>
                          </th>
                          <th class="text-14 text-no-wrap text-center">
                            <span>รายละเอียด</span>
                          </th>
                          <th class="text-14 text-no-wrap text-end">
                            <span>จำนวน</span>
                          </th>
                          <th class="text-14 text-no-wrap text-end">
                            <span>ราคาต่อหน่วย</span>
                          </th>
                          <th class="text-14 text-no-wrap text-end">
                            <span>ค่าบริการ</span>
                          </th>
                          <th class="text-14 text-no-wrap text-end">
                            <span>จำนวนเงิน</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(part, index) in item.repairParts"
                          :key="index"
                        >
                          <td v-if="index == 0" width="20%" class="text-wrap">
                            {{ i + 1 }}. {{ item.preset.Preset }}
                          </td>
                          <td v-else width="20%" class="text-wrap"></td>
                          <td width="35%">{{ part.part.PartName_th }}</td>
                          <td width="15%" class="text-end">
                            {{ part.NumOfUse }}
                          </td>
                          <td width="10%" class="text-end">
                            {{ formatSeperateCurrency(part.part.PricePerUnit) }}
                          </td>
                          <td width="10%" class="text-end">
                            {{ formatSeperateCurrency(part.ServiceFee) }}
                          </td>
                          <td width="10%" class="text-end">
                            {{
                              formatSeperateCurrency(
                                part.part.PricePerUnit * part.NumOfUse +
                                  part.ServiceFee
                              )
                            }}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colspan="4"
                            class="text-14 font-weight-semibold text-end"
                          ></td>
                          <td></td>
                          <td class="text-14 font-weight-semibold text-end">
                            <u>
                              {{
                                formatSeperateCurrency(
                                  sumPartsCost(item.repairParts)
                                )
                              }}
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
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4"
            >
              <p class="text-muted">Sub Total:</p>
              <p class="text-16">{{ formatSeperateCurrency(subtotal) }}</p>
            </div>
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold mb-4"
            >
              <div class="d-flex align-center justify-space-between">
                <p class="text-muted">
                  Vat : {{ (vatRate * 100).toFixed(0) }} %&nbsp;&nbsp;
                </p>
                <!-- <v-switch
                  v-model="isVat"
                  color="orange"
                  hide-details
                ></v-switch> -->
              </div>
              <p class="text-16">{{ formatSeperateCurrency(vat) }}</p>
            </div>
            <div
              class="d-flex align-center justify-space-between text-14 font-weight-semibold"
            >
              <p class="text-muted">Grand Total:</p>
              <p class="text-16">{{ formatSeperateCurrency(grandTotal) }}</p>
            </div>
          </v-col>
        </v-row>
        <div class="d-flex ga-3 justify-end mt-6">
          <v-btn color="warning" :to="`/system/repairs/${repairID}`" flat>
            <EditIcon size="18" />
            &nbsp;แก้ไขรายการซ่อม
          </v-btn>
          <v-btn @click="createQuotation" color="primary" flat>
            <v-icon>mdi-send-variant</v-icon>
            &nbsp;สร้างใบแจ้งหนี้
          </v-btn>
        </div>
      </div>
      <div v-else>
        <p>No Data</p>
      </div>
    </v-card-item>
  </v-card>
  <!-- </UiParentCard> -->
</template>
