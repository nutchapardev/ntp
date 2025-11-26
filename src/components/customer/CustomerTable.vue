<script>
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { nextTick } from "vue";
import { getNumberOfDigits, getRandomColor } from "@/utils/functions";

export default {
  data() {
    return {
      //
      getRandomColor,
      search: "",
      headers: [
        {
          title: "#ID",
          key: "CustomerID",
          align: "start",
          sortable: true,
        },
        {
          title: "ชื่อ - นามสกุล",
          align: "start",
          sortable: false,
          key: "CustomerName",
        },
        { title: "รหัสประจำตัวประชาชน", key: "IDNumber" },
        { title: "เบอร์โทรศัพท์", key: "CustomerTel" },
        { title: "รถยนต์", key: "cars" },
        { title: "", key: "actions", sortable: false },
      ],
      customers: [],
      customerTitles: [],
      provinces: [],
      districts: [],
      subDistricts: [],
      //   dialog
      dialogAddCustomer: false,
      dialogEditCustomer: false,
      dialogAddAddress: false,
      //   data set
      customerDataSet: {
        CustomerTitleID: null,
        CustomerName: "",
        CustomerSurname: "",
        IDNumber: "",
        CustomerTel: "",
        addresses: [], // for Edit
        address: {
          // for Create
          Line1: "",
          Line2: "",
          SubDistrictID: null,
          DistrictID: null,
          ProvinceID: null,
          Zipcode: null,
        },
      },
      defaultItems: {
        CustomerTitleID: null,
        CustomerName: "",
        CustomerSurname: "",
        IDNumber: "",
        CustomerTel: "",
        addresses: [], // for Edit
        address: {
          // for Create
          Line1: "",
          Line2: "",
          SubDistrictID: null,
          DistrictID: null,
          ProvinceID: null,
          Zipcode: null,
        },
      },
    };
  },
  methods: {
    async getCustomers() {
      const response = await serverService.getAllCustomers();
      this.customers = response.data;
    },
    async getCustomerTitle() {
      const response = await serverService.getCustomerTitle();
      this.customerTitles = response.data;
    },
    async getProvinces() {
      const response = await serverService.getProvinces();
      this.provinces = response.data;
    },
    async getDistrict(ProvinceID) {
      const response = await serverService.getDistrictByProvinceID(ProvinceID);
      this.districts = response.data;
      this.customerDataSet.address.DistrictID = null;
      this.customerDataSet.address.SubDistrictID = null;
      this.customerDataSet.address.Zipcode = null;
    },
    async getSubDistrict(DistrictID) {
      const response = await serverService.getSubDistrictsByDistrictID(DistrictID);
      this.subDistricts = response.data;
      this.customerDataSet.address.SubDistrictID = null;
      this.customerDataSet.address.Zipcode = null;
    },
    async setZipcode(SubDistrictID) {
      const data = this.subDistricts.find((item) => item.SubDistrictID == SubDistrictID);
      this.customerDataSet.address.Zipcode = data.Zipcode;
    },
    async submitAddCustomer() {
      const { CustomerTitleID, CustomerName, address } = this.customerDataSet;
      const { Line1, SubDistrictID, DistrictID, ProvinceID } = address;
      if (CustomerTitleID == null || CustomerName == "" || Line1 == "" || SubDistrictID == null || DistrictID == null || ProvinceID == null) {
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
            this.customerDataSet.address.isDefault = true; // ให้ที่อยู่ที่สร้างใหม่เป็น default address
            const response = await serverService.addCustomersAndAddresses(this.customerDataSet);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogAddCustomer();
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
    async submitEditCustomer() {
      //   console.log(this.customerDataSet);
      const { CustomerID, CustomerName } = this.customerDataSet;
      if (CustomerName == null || CustomerName == "") {
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
            const response = await serverService.editCustomerByID(CustomerID, this.customerDataSet);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "แก้ไขข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogEditCustomer();
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
    async submitAddAddress() {
      const { CustomerID, address } = this.customerDataSet;
      const { Line1, ProvinceID, DistrictID, SubDistrictID } = address;
      if (!CustomerID || Line1 == "" || Line1 == null || ProvinceID == null || DistrictID == null || SubDistrictID == null) {
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
            const payload = {
              OwnerID: CustomerID,
              AddressTypeID: 1,
              ...address,
            };
            const response = await serverService.addAddress(payload);
            // console.log(response.data);

            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogAddAddress();
              this.closeDialogEditCustomer();
              this.initialize();
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
              text: "ไม่สามารถเพิ่มข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    async deleteAddress(addressId) {
      Swal.fire({
        title: "Are you sure?",
        text: "ท่านต้องการลบข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await serverService.deleteAddressByAddressID(addressId);
            if (response.data.result) {
              const indexToDelete = this.customerDataSet.addresses.findIndex((address) => address.AddressID === addressId);
              if (indexToDelete > -1) {
                this.customerDataSet.addresses.splice(indexToDelete, 1);
              }
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "ลบข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              // this.closeDialogAddVendor();
              // this.initialize();
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
              text: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    async changeDefaultAddress(addressId) {
      Swal.fire({
        title: "Are you sure?",
        text: "ตั้งที่อยู่นี้เป็นค่าเริ่มต้น ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await serverService.changeDefaultAddress(addressId);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "ตั้งที่อยู่นี้เป็นค่าเริ่มต้นแล้ว",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogAddCustomer();
              this.closeDialogEditCustomer();
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
              text: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    openDialogAddCustomer() {
      this.dialogAddCustomer = true;
    },
    closeDialogAddCustomer() {
      this.dialogAddCustomer = false;
      nextTick(() => {
        this.customerDataSet = Object.assign({}, this.defaultItems);
      });
    },
    openDialogEditCustomer(item) {
      this.dialogEditCustomer = true;
      this.customerDataSet = {
        CustomerID: item.CustomerID,
        CustomerTitleID: item.CustomerTitleID,
        CustomerName: item.CustomerName,
        CustomerSurname: item.CustomerSurname,
        IDNumber: item.IDNumber,
        CustomerTel: item.CustomerTel,
        addresses: item.addresses,
        address: this.defaultItems.address,
      };
    },
    closeDialogEditCustomer() {
      this.dialogEditCustomer = false;
      nextTick(() => {
        this.customerDataSet = Object.assign({}, this.defaultItems);
      });
    },
    openDialogAddAddress() {
      this.customerDataSet.address = Object.assign({}, this.defaultItems.address);
      nextTick(() => {
        this.dialogAddAddress = true;
      });
    },
    closeDialogAddAddress() {
      this.dialogAddAddress = false;
      nextTick(() => {
        this.customerDataSet.address = Object.assign({}, this.defaultItems.address);
      });
    },
    async initialize() {
      await this.getCustomers();
      await this.getCustomerTitle();
      await this.getProvinces();
    },
  },
  created() {
    this.initialize();
  },
};
</script>
<template>
  <div>
    <v-row>
      <v-col cols="12" md="9">
        <v-text-field v-model="search" label="ค้นหา" prepend-inner-icon="mdi-magnify" />
      </v-col>
      <v-col cols="12" md="3">
        <v-btn height="48" block color="secondary" variant="flat" dark @click="openDialogAddCustomer"
          ><v-icon size="20">mdi-plus-circle-outline</v-icon>
          <span class="hidden-sm-and-down">&nbsp;เพิ่มข้อมูลลูกค้า</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table class="border rounded-md" :search="search" :headers="headers" :items="customers" :sort-by="[{ key: 'CustomerID', order: 'desc' }]">
      <template #[`item.CustomerName`]="{ item }">
        {{ item.customerTitle.CustomerTitleID != 99 ? item.customerTitle.CustomerTitle : "" }}
        {{ item.CustomerName }}
        {{ item.CustomerSurname }}
      </template>
      <template #[`item.cars`]="{ item }">
        <!-- {{ item.cars.length }} คัน -->
        <v-chip v-for="(car, index) in item.cars" :key="index" rounded="pill" class="font-weight-bold" :color="getRandomColor()" size="small" label>
          {{ car.CarTitle }}
          {{ car.CarNumber }}
          <v-tooltip activator="parent" location="top">
            {{ car.CarTitle }}{{ car.CarNumber }}<br />
            {{ car.province.name_th }}<br />
            {{ car.brand.Brand }} ({{ car.model.Model }})<br />
            หมายเลขตัวถัง : {{ car.VIN }}<br />
            หมายเลขเครื่องยนต์ : {{ car.EC }}<br />
          </v-tooltip>
        </v-chip>
      </template>
      <template #[`item.actions`]="{ item }">
        <div class="d-flex">
          <div>
            <v-btn size="small" @click="openDialogEditCustomer(item)">
              <EditIcon class="text-success" size="18" />
            </v-btn>
            <v-tooltip activator="parent" location="top">แก้ไข</v-tooltip>
          </div>
        </div>
      </template>
      <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template> -->
    </v-data-table>
    <!-- Dialog Add Customer -->
    <v-dialog v-model="dialogAddCustomer" class="dialog-mw" style="max-width: 800px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-secondary">
          <span class="text-h5">เพิ่มข้อมูลลูกค้า</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                :items="customerTitles"
                v-model="customerDataSet.CustomerTitleID"
                item-value="CustomerTitleID"
                item-title="CustomerTitle"
                label="คำนำหน้า"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="ชื่อจริง" v-model="customerDataSet.CustomerName" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="นามสกุล" v-model="customerDataSet.CustomerSurname" hide-details></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="รหัสประจำตัวประชาชน" v-model="customerDataSet.IDNumber" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="เบอร์โทรศัพท์" v-model="customerDataSet.CustomerTel" hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="ที่อยู่บรรทัดที่ 1" v-model="customerDataSet.address.Line1" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="ที่อยู่บรรทัดที่ 2" v-model="customerDataSet.address.Line2" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :items="provinces"
                v-model="customerDataSet.address.ProvinceID"
                item-value="ProvinceID"
                item-title="name_th"
                label="จังหวัด"
                @update:modelValue="getDistrict"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :items="districts"
                v-model="customerDataSet.address.DistrictID"
                item-value="DistrictID"
                item-title="name_th"
                label="เขต / ตำบล"
                @update:modelValue="getSubDistrict"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :items="subDistricts"
                v-model="customerDataSet.address.SubDistrictID"
                item-value="SubDistrictID"
                item-title="name_th"
                label="แขวง / อำเภอ"
                @update:modelValue="setZipcode"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="customerDataSet.address.Zipcode" label="รหัสไปรษณีย์" readonly hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" block flat @click="submitAddCustomer">บันทึกข้อมูล</v-btn>
        </v-card-actions>

        <v-card-actions>
          <v-col class="align-center"><v-btn color="error" @click="closeDialogAddCustomer" flat block>ปิดหน้าต่าง</v-btn></v-col>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Add Customer -->
    <!-- Dialog Edit Customer -->
    <v-dialog v-model="dialogEditCustomer" class="dialog-mw" style="max-width: 800px" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-secondary">
          <span class="text-h5">แก้ไขข้อมูลลูกค้า</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                :items="customerTitles"
                v-model="customerDataSet.CustomerTitleID"
                item-value="CustomerTitleID"
                item-title="CustomerTitle"
                label="ประเภทคู่ค้า"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="ชื่อจริง" v-model="customerDataSet.CustomerName" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field label="ชื่อคู่ค้า" v-model="customerDataSet.CustomerSurname" hide-details></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field label="รหัสประจำตัวประชาชน" v-model="customerDataSet.IDNumber" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="เบอร์โทรศัพท์" v-model="customerDataSet.CustomerTel" hide-details></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="primary" variant="outlined" @click="openDialogAddAddress">
                <v-icon size="20">mdi-plus-circle-outline</v-icon>
                <span class="hidden-sm-and-down">&nbsp;เพิ่มที่อยู่</span>
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" v-for="(address, index) in customerDataSet.addresses" :key="index">
              <v-card class="mx-auto" color="lightinfo">
                <v-card-text style="height: 80px">
                  <div>
                    {{ address.Line1 }}<br />
                    {{ address.Line2 }}
                  </div>

                  <div>
                    {{ address.subDistrict.name_th }}
                    {{ address.district.name_th }}
                    {{ address.province.name_th }} ,
                    {{ address.subDistrict.Zipcode }}
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="error" text="ลบ" @click="deleteAddress(address.AddressID)"></v-btn>
                  <v-spacer></v-spacer>
                  <v-btn v-if="address.IsDefault" color="primary" text="ค่าเริ่มต้น" variant="flat"></v-btn>
                  <v-btn v-else color="primary" text="ตั้งเป็นค่าเริ่มต้น" @click="changeDefaultAddress(address.AddressID)"></v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" block flat @click="submitEditCustomer">บันทึกข้อมูล</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogEditCustomer" block flat>ปิดหน้าต่าง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Edit Customer -->
    <!-- Dialog Add Address -->
    <v-dialog v-model="dialogAddAddress" class="dialog-mw" style="max-width: 800px" persistent>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="ที่อยู่บรรทัดที่ 1" v-model="customerDataSet.address.Line1" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field label="ที่อยู่บรรทัดที่ 2" v-model="customerDataSet.address.Line2" hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :items="provinces"
                v-model="customerDataSet.address.ProvinceID"
                item-value="ProvinceID"
                item-title="name_th"
                label="จังหวัด"
                @update:modelValue="getDistrict"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :items="districts"
                v-model="customerDataSet.address.DistrictID"
                item-value="DistrictID"
                item-title="name_th"
                label="เขต / ตำบล"
                @update:modelValue="getSubDistrict"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                :items="subDistricts"
                v-model="customerDataSet.address.SubDistrictID"
                item-value="SubDistrictID"
                item-title="name_th"
                label="แขวง / อำเภอ"
                @update:modelValue="setZipcode"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field v-model="customerDataSet.address.Zipcode" label="รหัสไปรษณีย์" readonly hide-details></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="info" block flat @click="submitAddAddress">บันทึกข้อมูล</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogAddAddress" block flat>ปิดหน้าต่าง</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Add Address -->
  </div>
</template>
