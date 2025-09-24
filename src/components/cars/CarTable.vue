<script>
import serverService from "@/services/serverService";
import { nextTick } from "vue";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      search: "",
      headers: [
        { title: "#ID", align: "start", key: "CarID" },
        { title: "หมายเลขทะเบียน", align: "start", key: "CarNumber" },
        { title: "ยี่ห้อ / รุ่น", align: "start", key: "model" },
        { title: "เจ้าของ", align: "start", key: "customer" },
        { title: "", align: "end", key: "actions" },
      ],
      BrandID: 1,
      cars: [],
      brandItems: [],
      modelItems: [],
      provinceItems: [],
      customers: [],
      addCar: {
        CustomerID: null,
        BrandID: null,
        ModelID: null,
        CarTitle: null,
        CarNumber: null,
        ProvinceID: null,
        VIN: null,
        EC: null,
      },
      defaultItem: {
        CustomerID: null,
        BrandID: null,
        ModelID: null,
        CarTitle: null,
        CarNumber: null,
        ProvinceID: null,
        VIN: null,
        EC: null,
      },
      // dialog
      dialogAddCar: false,
    };
  },
  methods: {
    async getCars() {
      const response = await serverService.getCars();
      this.cars = response.data;
    },
    async getBrands() {
      try {
        const response = await serverService.getBrands();
        this.brandItems = response.data;
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async getCarModel(BrandID) {
      try {
        const response = await serverService.getCarModelByBrandID(BrandID);
        this.modelItems = response.data;
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    },
    async getProvinces() {
      try {
        const response = await serverService.getProvinces();
        this.provinceItems = response.data;
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    },
    async getCustomers() {
      try {
        const response = await serverService.getAllCustomers();
        this.customers = response.data;
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    },
    async submitAddCar() {
      const exceptionKeys = ["VIN", "EC"]; // ยกเว้นการตรวจ มีหรือไม่มีก็ได้
      const checkNullData = Object.entries(this.addCar).every(
        ([key, value]) => {
          return (
            exceptionKeys.includes(key) || (value !== null && value !== "")
          );
        }
      );

      if (!checkNullData) {
        Swal.fire({
          icon: "warning",
          title: "Alert!",
          text: "กรุณากรอกข้อมูลให้ครบถ้วน",
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
            const response = await serverService.addCar(this.addCar);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeAddCarDialog();
              this.initialize();
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
    async openAddCarDialog() {
      await this.getBrands();
      await this.getProvinces();
      await this.getCustomers();
      nextTick(() => {
        this.dialogAddCar = true;
      });
    },
    closeAddCarDialog() {
      this.dialogAddCar = false;
      nextTick(() => {
        this.addCar = Object.assign({}, this.defaultItem);
      });
    },
    async initialize() {
      await this.getCars();
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
        @click="openAddCarDialog"
        ><v-icon size="20">mdi-plus-circle-outline</v-icon>
        <span class="hidden-sm-and-down">&nbsp;เพิ่มรถยนต์</span>
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table :search="search" :headers="headers" :items="cars">
    <template v-slot:item.CarID="{ item }">#{{ item.CarID }}</template>
    <template v-slot:item.CarNumber="{ item }">
      {{ item.CarTitle }} {{ item.CarNumber }}
      {{ item.province.name_th }}
    </template>
    <template v-slot:item.model="{ item }">
      {{ item.brand.Brand }} ({{ item.model.Model }})
    </template>
    <template v-slot:item.customer="{ item }">{{
      item.customer != null
        ? `${
            item.customer.customerTitle.CustomerTitleID != 99
              ? item.customer.customerTitle.CustomerTitle
              : ""
          } ${item.customer.CustomerName} ${item.customer.CustomerSurname}`
        : "ไม่ระบุเจ้าของ"
    }}</template>
    <template v-slot:item.actions="{item}">actions</template>
  </v-data-table>
  <!-- dialog Add Car -->
  <v-dialog
    v-model="dialogAddCar"
    class="dialog-mw"
    style="max-width: 900px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">เพิ่มข้อมูลรถยนต์</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select
              :items="brandItems"
              item-value="BrandID"
              item-title="Brand"
              v-model="addCar.BrandID"
              label="Brand"
              hide-details
              @update:modelValue="getCarModel"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <v-select
              :items="modelItems"
              item-value="ModelID"
              item-title="Model"
              v-model="addCar.ModelID"
              label="Model"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model.trim="addCar.CarTitle"
              label="หมวดอักษรรถยนต์"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model.trim="addCar.CarNumber"
              label="หมายเลขทะเบียน"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-autocomplete
              v-model="addCar.ProvinceID"
              :items="provinceItems"
              item-value="ProvinceID"
              item-title="name_th"
              prepend-inner-icon="mdi-magnify"
              label="จังหวัด"
              hide-details
              color="primary"
              variant="outlined"
              autocomplete="false"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model.trim="addCar.VIN"
              label="หมายเลขตัวถัง"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              v-model.trim="addCar.EC"
              label="หมายเลขเครื่องยนต์"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" sx="6" md="4">
            <v-autocomplete
              v-model="addCar.CustomerID"
              :items="customers"
              item-value="CustomerID"
              prepend-inner-icon="mdi-magnify"
              label="เจ้าของ"
              hide-details
              color="primary"
              variant="outlined"
              autocomplete="false"
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.CustomerName} ${item.raw.CustomerSurname}`"
                >
                </v-list-item>
              </template>
              <template v-slot:selection="{ item }">
                {{ item.raw.CustomerName }} {{ item.raw.CustomerSurname }}
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitAddCar"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" block flat @click="closeAddCarDialog"
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- dialog Add Car -->
</template>
