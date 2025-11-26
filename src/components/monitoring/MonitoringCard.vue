<script>
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { toThaiDateString, toThaiDateTimeString } from "@/utils/functions";
import { nextTick } from "vue";
export default {
  data() {
    return {
      timer: null,
      allowcates: [],
      allowcateDetail: [],
      selectedItem: null,
      //   dialog
      dialogShowAllowcateDetail: false,
    };
  },
  methods: {
    formatDateTime(date) {
      return date ? toThaiDateTimeString(new Date(date)) : "N/A";
    },
    async getAllowcateData() {
      this.allowcates = (await serverService.getRepairsByWorkStatusID(4)).data;
    },
    async saveSubmitAllowcate() {
      Swal.fire({
        title: "Are you sure?",
        text: "จัดสรรอุปกรณ์แล้ว ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const repairId = this.selectedItem.RepairID;
          const response = await serverService.updateRepairByID(repairId, {
            WorkStatusID: 5,
          });

          if (response.data.result) {
            this.closeDialogAllowcateDetail();
            this.initialize();
          } else {
            Swal.fire("Error!", response.message, "error");
            return;
          }
        }
      });
      //
    },
    async showDialogAllowcateDetail(item) {
      this.selectedItem = item;
      const repairId = item.RepairID;
      const response = await serverService.getRepairDetailByRepairID(repairId);
      this.allowcateDetail = response.data;

      nextTick(() => {
        this.dialogShowAllowcateDetail = true;
      });
    },
    closeDialogAllowcateDetail() {
      this.allowcateDetail = [];
      this.selectedItem = null;
      this.dialogShowAllowcateDetail = false;
    },
    async initialize() {
      await this.getAllowcateData();
    },
  },
  mounted() {
    // this.timer = setInterval(async () => {
    //   await this.getAllowcateData().then(() => {
    //     console.log("refresh Allowcate Data");
    //   });
    // }, 5000);
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  created() {
    this.initialize();
  },
};
</script>

<template>
  <div>
    <div v-if="allowcates.length == 0" class="text-center">
      <span>ไม่พบรายการอุปกรณ์ที่ต้องจัดสรร</span>
    </div>
    <v-row v-else>
      <v-col cols="6" md="4" v-for="(item, index) in allowcates" :key="index">
        <v-card color="primary" variant="tonal" class="mx-auto" elevation="10">
          <v-card-item>
            <div>
              <div class="text-overline mb-1">
                {{ item.car.CarTitle }}{{ item.car.CarNumber }}
                {{ item.car.province.name_th }}
              </div>
              <div class="text-h6 mb-1">{{ item.car.brand.Brand }} {{ item.car.model.Model }}</div>
              <div class="text-caption">
                {{ item.customer.customerTitle.CustomerTitle }}
                {{ item.customer.CustomerName }}
                {{ item.customer.CustomerSurname }}
              </div>
            </div>
          </v-card-item>

          <v-card-actions>
            <!-- <v-btn> Button </v-btn> -->
            <span class="ml-3" style="font-size: 12px">{{ formatDateTime(item.updatedAt) }}</span>
            <v-spacer />
            <v-btn class="mr-2" @click="showDialogAllowcateDetail(item)"> รายละเอียด </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- Dialog Show Allocate Section -->
    <v-dialog v-model="dialogShowAllowcateDetail" class="dialog-mw" style="max-width: 900px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-secondary">
          <span class="text-h5">อุปกรณ์ที่ต้องจัดสรร</span>
        </v-card-title>
        <v-card-text>
          <div v-for="(al, i) in allowcateDetail" :key="i" class="mb-2">
            <v-card color="lightsuccess">
              <v-card-text>
                <div class="mb-3">
                  <span> {{ i + 1 }}. {{ al.preset.Preset }} </span>
                </div>
                <v-table class="border rounded-md" density="compact">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">ลำดับ</th>
                        <th class="text-center">รหัสอุปกรณ์</th>
                        <th class="text-center">ชื่ออุปกรณ์</th>
                        <th class="text-end">จำนวนที่ใช้</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(p, index) in al.repairParts" :key="index">
                        <td class="text-center">{{ index + 1 }}.</td>
                        <td>{{ p.part.PartNumber }}</td>
                        <td>{{ p.part.PartName_th }}</td>
                        <td class="text-end">{{ p.NumOfUse }} {{ p.part.unit.Unit }}</td>
                        <!-- <td class="text-end">{{ item.part.PartAmount }}</td> -->
                      </tr>
                    </tbody>
                  </template>
                </v-table>
                <!-- <v-row v-for="p in al.repairParts" :key="p.RepairPartID">
                <v-col>{{ p.part.PartNumber }}</v-col>
                <v-col>{{ p.part.PartName_th }}</v-col>
                <v-col class="text-end">x</v-col>
                <v-col class="text-end"
                  >{{ p.NumOfUse }} {{ p.part.unit.Unit }}</v-col
                >
              </v-row> -->
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
        <!-- <hr /> -->
        <v-card-actions>
          <v-btn color="error" @click="closeDialogAllowcateDetail" flat>ปิดหน้าต่าง</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveSubmitAllowcate" flat variant="tonal">จัดสรรอุปกรณ์แล้ว</v-btn>
        </v-card-actions>
        <!-- <v-card-actions>
        <v-btn color="error" @click="closeDialogAllowcateDetail" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions> -->
      </v-card>
    </v-dialog>
    <!-- Dialog Show Allocate Section -->
  </div>
</template>
