<script>
import serverService from "@/services/serverService";
import {
  toThaiDateString,
  toThaiDateTimeString,
  formatCurrency,
  getColorByNumber,
} from "@/utils/functions";
export default {
  data() {
    return {
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
    async getRepairByID() {
      const response = await serverService.getRepairByID(this.repairID);
      console.log(response.data);
      this.RepairItems = response.data;
    },
    async getRepairDetail() {
      const response = await serverService.getRepairDetailByRepairID(
        this.repairID
      );
      console.log(response.data);
      this.repairDetails = response.data;
    },
    async initialize() {
      await this.getRepairByID().then(() => this.getRepairDetail());
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
      return this.subtotal * (this.isVat ? this.vatRate : 0);
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
                <div class="text-14 textSecondary lh-normal">
                  <p class="font-weight-bold mb-2" style="font-size: 20px">
                    บริษัท Honda Ntp Motors จำกัด
                  </p>
                  <p>144/136 หมู่บ้านหญาไทวิลเลจ</p>
                  <p>อ.ปากเกร็ด ต.ปากเกร็ด จ.นนทบุรี, 11120</p>
                  <p>เบอร์โทรศัพท์ : 0819840456</p>
                </div>
              </div>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="text-start text-md-end text-14 textSecondary lh-normal"
            >
              <!-- <h6 class="text-h6">Bill To</h6> -->
              <p class="font-weight-bold mb-2" style="font-size: 20px">
                ข้อมูลลูกค้า
              </p>
              <div class="text-14 textSecondary lh-normal">
                <p>นายณัชพัฒนพงษ์ มหารัคนวงศ์</p>
                <p>exceed.nat@gmail.com</p>
                <p>171/593 Atmoz Changwattna</p>
                <p>Pakret Nonthaburi, 11120</p>
                <p>เบอร์โทรศัพท์ : 0939477141</p>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-14 textSecondary lh-normal">
                <p>
                  <span class="font-weight-bold">รถยนต์หมายเลขทะเบียน : </span
                  >6กศ 2659 กรุงเทพมหานคร
                </p>
                <p>
                  <span class="font-weight-bold">ยี่ห้อ / รุ่น : </span>Honda
                  (Civic 2019)
                </p>
                <p>
                  <span class="font-weight-bold">หมายเลขเครื่องยนต์ : </span
                  >KLDGJSDMF45SD
                </p>
                <p>
                  <span class="font-weight-bold">หมายเลขตัวถัง : </span
                  >4JKTGJSKS
                </p>
              </div>
            </v-col>
          </v-row>
        </div>

        <v-table class="invoice-table" density="compact">
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
                      <thead>
                        <tr>
                          <th class="text-14 text-no-wrap text-start" width="200px">#</th>
                          <th class="text-14 text-no-wrap text-center">รายละเอียด</th>
                          <th class="text-14 text-no-wrap text-end">
                            ราคาต่อหน่วย
                          </th>
                          <th class="text-14 text-no-wrap text-end">จำนวน</th>
                          <th class="text-14 text-no-wrap text-end">
                            จำนวนเงิน
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(part, index) in item.repairParts">
                          <td v-if="index == 0">
                            {{ i + 1 }}. {{ item.preset.Preset }}
                          </td>
                          <td v-else></td>
                          <td>{{ index + 1 }}. {{ part.part.PartName_th }}</td>
                          <td class="text-end">
                            {{ formatSeperateCurrency(part.part.PricePerUnit) }}
                          </td>
                          <td class="text-end">{{ part.NumOfUse }}</td>
                          <td class="text-end">
                            {{
                              formatSeperateCurrency(
                                part.part.PricePerUnit * part.NumOfUse
                              )
                            }}
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
                <v-switch
                  v-model="isVat"
                  color="orange"
                  hide-details
                ></v-switch>
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
          <v-btn color="warning" :to="`/apps/invoice/edit/xxx`" flat
            >Edit Invoice</v-btn
          >
          <v-btn to="/apps/invoice" color="primary" flat
            >Back To Invoice List</v-btn
          >
        </div>
      </div>
      <div v-else>
        <p>No Data</p>
      </div>
    </v-card-item>
  </v-card>
  <!-- </UiParentCard> -->
</template>
