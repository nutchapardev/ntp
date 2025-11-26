<script>
// 1. Imports จะย้ายมาอยู่ด้านบนสุดของ script
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
// import { BasicDatatables } from "@/_mockApis/components/datatable/dataTable"
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore";
import { toShortThaiDateString, getColorByNumber } from "@/utils/functions";

export default {
  name: "Repairs",
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  data() {
    const authStore = useAuthStore();
    return {
      page: { title: "รายการซ่อมรถยนต์" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "รายการซ่อมรถยนต์",
          disabled: false,
          href: "#",
        },
      ],
      search: null,
      carIdForSearch: null,
      headers: [
        { title: "RepairID", align: "start", key: "RepairID" },
        { title: "วันที่", align: "start", key: "RepairDate" },
        { title: "หมายเลขทะเบียน", align: "start", key: "car.CarNumber" },
        { title: "ยี่ห้อ/รุ่น", align: "start", key: "car.brand.Brand" },
        { title: "สถานะซ่อม", align: "start", key: "workStatus.WorkStatus_th" },
        { title: "Actions", align: "center", key: "actions" },
      ],
      // นำข้อมูลที่ import เข้ามาใส่ใน data เพื่อให้ template เรียกใช้ได้
      RepairsData: [],
      editedItem: {
        BrandID: null,
        ModelID: null,
        CarID: null,
        CustomerID: null,
        EmployeeID: authStore.employeeData.EmployeeID,
        EmployeeName: `${authStore.employeeData.FirstName} ${authStore.employeeData.LastName}`,
      },
      defaultItem: {
        BrandID: null,
        ModelID: null,
        CarID: null,
        CustomerID: null,
        EmployeeID: authStore.employeeData.EmployeeID,
        EmployeeName: `${authStore.employeeData.FirstName} ${authStore.employeeData.LastName}`,
      },
      addItem: {
        customer: {
          CustomerTitleID: null,
          CustomerName: null,
          CustomerSurname: null,
          IDNumber: null,
          CustomerTel: null,
        },
        car: {
          BrandID: null,
          ModelID: null,
          CarTitle: null,
          CarNumber: null,
          ProvinceID: null,
          VIN: null,
          EC: null,
        },
      },
      defaultAddItem: {
        customer: {
          CustomerTitleID: null,
          CustomerName: null,
          CustomerSurname: null,
          IDNumber: null,
          CustomerTel: null,
        },
        car: {
          BrandID: null,
          ModelID: null,
          CarTitle: null,
          CarNumber: null,
          ProvinceID: null,
          VIN: null,
          EC: null,
        },
      },
      // items
      brandItems: [],
      modelItems: [],
      carsItems: [],
      provinceItems: [],
      customerTitleItems: [],
      // dialog
      dialogAddRepair: false,
      dialogChoose: false,
      dialogCustomer: false,
    };
  },
  methods: {
    getColor(number) {
      return getColorByNumber(number);
    },
    formatDateString(date) {
      return toShortThaiDateString(date);
    },
    filterOnlyCapsText(value, query, item) {
      return value != null && query != null && typeof value === "string" && value.toString().toLocaleUpperCase().indexOf(query) !== -1;
    },
    async getRepairs() {
      this.RepairsData = (await serverService.getAllRepairs()).data;
    },
    async getBrands() {
      this.brandItems = (await serverService.getBrands()).data;
    },
    async getCarModel(BrandID) {
      this.modelItems = (await serverService.getCarModelByBrandID(BrandID)).data;
    },
    async getCars() {
      this.carsItems = (await serverService.getCars()).data;
    },
    async getProvinces() {
      this.provinceItems = (await serverService.getProvinces()).data;
    },
    async getCustomerTitle() {
      this.customerTitleItems = (await serverService.getCustomerTitle()).data;
    },
    async deleteItem(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this ID : " + id,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, delete it!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            confirmButtonText: "<span style='color:white;'>ตกลง</span>",
          });
        }
      });
    },
    chooseNewCustomer() {
      this.dialogCustomer = false;
      this.dialogChoose = false;
      this.dialogAddRepair = true;
    },
    chooseExistingCustomer() {
      this.dialogChoose = false;
      this.dialogCustomer = true;
    },
    closeChooseCustomerDialog() {
      this.dialogCustomer = false;
      this.carIdForSearch = null;
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.addItem = Object.assign({}, this.defaultAddItem);
      });
    },
    close() {
      this.dialogAddRepair = false;
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.addItem = Object.assign({}, this.defaultAddItem);
      });
    },
    async save() {
      let { customer, car } = this.addItem;
      if (customer.CustomerTitleID == null || customer.CustomerName == null || customer.CustomerName == "" || customer.CustomerSurname == null) {
        Swal.fire("Alert!", "กรุณากรอกข้อมูลลูกค้าให้ครบถ้วน", "warning");
        return;
      }
      if (
        car.BrandID == null ||
        car.ModelID == null ||
        car.CarTitle == null ||
        car.CarTitle == "" ||
        car.CarNumber == null ||
        car.CarNumber == "" ||
        car.ProvinceID == null
      ) {
        Swal.fire("Alert!", "กรุณากรอกข้อมูลรถยนต์ให้ครบถ้วน", "warning");
        return;
      }

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.createCarWithCustomer(this.addItem);
          if (response.data.result) {
            const { BrandID, ModelID, CarID, CustomerID } = response.data.data;
            const newRepair = {
              BrandID,
              ModelID,
              CarID,
              CustomerID,
              EmployeeID: this.editedItem.EmployeeID,
            };
            const responseAddRepair = await serverService.addRepair(newRepair);
            if (responseAddRepair.data.result) {
              Swal.fire("Success!", "บันทึกข้อมูลเรียบร้อย", "success");
            } else {
              Swal.fire("Error!", response.data.message, "error");
              return;
            }
          } else {
            Swal.fire("Error!", response.data.message, "error");
            return;
          }
          this.getRepairs();
          this.close();
        }
      });
    },
    async submitChooseCustomer() {
      if (!this.carIdForSearch) {
        Swal.fire("Alert!", "กรุณาเลือกข้อมูลรถยนต์", "warning");
        return;
      }
      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการเพิ่มข้อมูลนี้ ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.getCarByCarID(this.carIdForSearch);
          if (!response.data.CarID) {
            Swal.fire("Error!", "เกิดข้อผิดพลาด", "error");
            return;
          }

          const { BrandID, ModelID, CarID, CustomerID } = response.data;
          const newRepair = {
            BrandID,
            ModelID,
            CarID,
            CustomerID,
            EmployeeID: this.editedItem.EmployeeID,
          };
          const responseAddRepair = await serverService.addRepair(newRepair);
          if (responseAddRepair.data.result) {
            Swal.fire("Success!", "บันทึกข้อมูลเรียบร้อย", "success");
          } else {
            Swal.fire("Error!", response.data.message, "error");
            return;
          }
          this.getRepairs();
          this.closeChooseCustomerDialog();
        }
      });
    },
    initialize() {
      this.getRepairs();
      this.getBrands();
      this.getCars();
      this.getProvinces();
      this.getCustomerTitle();
    },
  },
  mounted() {
    this.initialize();
  },
};
</script>

<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-row>
      <v-col cols="12">
        <UiParentCard title="รายการซ่อมรถยนต์">
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="search" append-inner-icon="mdi-magnify" label="Search" single-line hide-details class="mb-5" />
            </v-col>
            <!-- dialog Choose -->
            <!-- <v-col cols="2" class="text-right">
            <v-dialog v-model="dialogChoose" class="dialog-mw" max-width="400px">
              <template v-slot:activator="{ props }">
                <v-btn height="48" block color="secondary" variant="flat" dark v-bind="props" @click="chooseExistingCustomer">
                  <v-icon size="20">mdi-plus-circle-outline</v-icon> <span class="hidden-sm-and-down">&nbsp;เพิ่มรายการ</span>
                </v-btn>
              </template>
              <v-card>
                <v-card-actions>
                  <v-btn color="secondary" block @click="chooseNewCustomer" flat>ลูกค้าใหม่</v-btn>
                </v-card-actions>
                <v-card-actions>
                  <v-btn color="primary" block @click="chooseExistingCustomer" flat>ลูกค้าเก่า</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col> -->
            <!-- dialog Choose -->
          </v-row>

          <v-data-table
            items-per-page="5"
            :headers="headers"
            :items="RepairsData"
            :search="search"
            :sort-by="[{ key: 'RepairID', order: 'desc' }]"
            class="border rounded-md"
          >
            <template #[`item.RepairID`]="{ item }"> #{{ item.RepairID }} </template>

            <template #[`item.RepairDate`]="{ item }">
              {{ formatDateString(item.RepairDate) }}
            </template>

            <template #[`item.car.CarNumber`]="{ item }"> {{ item.car.CarTitle }} {{ item.car.CarNumber }} </template>

            <template #[`item.car.brand.Brand`]="{ item }"> {{ item.car.brand.Brand }} ( {{ item.car.model.Model }} ) </template>

            <template #[`item.workStatus.WorkStatus_th`]="{ item }">
              <v-chip :color="getColor(item.workStatus.WorkStatusID)" :text="item.workStatus.WorkStatus_th" class="text-uppercase" label size="small"></v-chip>
            </template>

            <template #[`item.actions`]="{ item }">
              <div class="d-flex ga-3 align-center justify-end">
                <RouterLink :to="`/system/repairs/details/${item.RepairID}`" v-if="item.workStatus.WorkStatusID != 1">
                  <v-avatar color="lightprimary" size="32">
                    <EyeIcon class="text-primary" size="18" />
                  </v-avatar>
                  <v-tooltip activator="parent" location="bottom">View Repair</v-tooltip>
                </RouterLink>

                <RouterLink :to="`/system/repairs/${item.RepairID}`">
                  <v-avatar color="lightsuccess" size="32">
                    <EditIcon class="text-success" size="18" />
                  </v-avatar>
                  <v-tooltip activator="parent" location="bottom">Edit Repair</v-tooltip>
                </RouterLink>

                <!-- <RouterLink
                to=""
                @click.stop="deleteItem(item.RepairID)"
                class="cursor-pointer"
              >
                <v-avatar color="lighterror" size="32">
                  <TrashIcon class="text-error" size="18" />
                </v-avatar>
                <v-tooltip activator="parent" location="bottom"
                  >Delete Repair</v-tooltip
                >
              </RouterLink> -->
              </div>
            </template>
          </v-data-table>
        </UiParentCard>
      </v-col>
    </v-row>

    <!-- dialog Add Repair -->
    <v-dialog v-model="dialogAddRepair" max-width="780px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-secondary">
          <span class="text-h5">เพิ่มข้อมูลลูกค้าใหม่</span>
        </v-card-title>

        <v-card-text>
          <!-- {{ addItem }} -->

          <v-container class="px-0">
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <v-select
                  :items="brandItems"
                  item-value="BrandID"
                  item-title="Brand"
                  v-model="addItem.car.BrandID"
                  label="Brand"
                  hide-details
                  @update:modelValue="getCarModel"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-select :items="modelItems" item-value="ModelID" item-title="Model" v-model="addItem.car.ModelID" label="Model" hide-details></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model.trim="addItem.car.CarTitle" label="หมวดอักษรรถยนต์" hide-details></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model.trim="addItem.car.CarNumber" label="หมายเลขทะเบียน" hide-details></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-autocomplete
                  v-model="addItem.car.ProvinceID"
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
                <v-text-field v-model.trim="addItem.car.VIN" label="หมายเลขตัวถัง" hide-details></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model.trim="addItem.car.EC" label="หมายเลขเครื่องยนต์" hide-details></v-text-field>
              </v-col>
            </v-row>
            <hr class="mb-5 mt-5" />
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  :items="customerTitleItems"
                  item-value="CustomerTitleID"
                  item-title="CustomerTitle"
                  v-model="addItem.customer.CustomerTitleID"
                  label="คำนำหน้าชื่อ"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model.trim="addItem.customer.CustomerName" label="ชื่อจริง" hide-details></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model.trim="addItem.customer.CustomerSurname" label="นามสกุล" hide-details></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model.trim="addItem.customer.IDNumber" label="รหัสประจำตัวประชาชน" hide-details></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model.trim="addItem.customer.CustomerTel" label="เบอร์โทรศัพท์" hide-details></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="mb-3">
          <v-btn color="error" variant="outlined" dark @click="close"> ยกเลิก </v-btn>
          <!-- <v-spacer></v-spacer> -->

          <v-btn color="primary" class="ml-3 mr-3" variant="outlined" dark @click="save"> บันทึก </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- dialog Add Repair -->
    <!-- dialog Choose Customer -->
    <v-dialog v-model="dialogCustomer" class="dialog-mw" max-width="400px" persistent>
      <v-card>
        <v-card-text>
          <v-autocomplete
            v-model="carIdForSearch"
            :items="carsItems"
            item-value="CarID"
            item-title="CarNumber"
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            hide-details
            color="primary"
            variant="outlined"
            autocomplete="false"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props" :title="`${item.raw.CarTitle} ${item.raw.CarNumber} ${item.raw.province.name_th}`"> </v-list-item>
            </template>
            <template v-slot:selection="{ item }">
              <span>
                {{ item.raw.CarTitle }} {{ item.raw.CarNumber }}
                {{ item.raw.province.name_th }}
              </span>
            </template>
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="closeChooseCustomerDialog">ยกเลิก</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="submitChooseCustomer">เลือกรถยนต์</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="secondary" block @click="chooseNewCustomer" variant="tonal">ลูกค้าใหม่</v-btn>
        </v-card-actions>
        <!-- <v-card-actions>
        <v-btn color="secondary" block @click="closeChooseCustomerDialog" flat>ยกเลิก</v-btn>
      </v-card-actions> -->
      </v-card>
    </v-dialog>
    <!-- dialog Choose Customer -->
  </div>
</template>
