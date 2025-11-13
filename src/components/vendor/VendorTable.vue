<script>
import { nextTick } from "vue";
import serverService from "@/services/serverService";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      search: "",
      vendors: [],
      vendorTypes: [],
      headers: [
        {
          title: "#ID",
          key: "VendorID",
          align: "start",
          sortable: true,
        },
        {
          title: "ชื่อ - นามสกุล",
          align: "start",
          sortable: false,
          key: "VendorName",
        },
        { title: "เลขประจำตัวผู้เสียภาษี", key: "IDNumber" },
        { title: "เบอร์โทรศัพท์", key: "VendorTel" },
        { title: "ประเภทคู่ค้า", key: "vendorType.VendorType" },
        { title: "Actions", key: "actions", sortable: false },
      ],
      //   default data
      provinces: [],
      districts: [],
      subDistricts: [],
      //   dialog
      dialogAddVendor: false,
      dialogEditVendor: false,
      dialogAddAddress: false,
      //   dataset
      vendorDataSet: {
        VendorName: "",
        VendorTypeID: "",
        IDNumber: "",
        VendorTel: "",
        address: {
          // for Create
          Line1: "",
          Line2: "",
          SubDistrictID: null,
          DistrictID: null,
          ProvinceID: null,
          Zipcode: null,
        },
        addresses: [], // for Edit
      },
      defaultItems: {
        VendorName: "",
        VendorTypeID: "",
        IDNumber: "",
        VendorTel: "",
        address: {
          // for Create
          Line1: "",
          Line2: "",
          SubDistrictID: null,
          DistrictID: null,
          ProvinceID: null,
          Zipcode: null,
        },
        addresses: [], // for Edit
      },
    };
  },
  methods: {
    async getVendors() {
      const response = await serverService.getAllVendors();
      this.vendors = response.data;
    },
    async getVendorTypes() {
      const response = await serverService.getAllVendorType();
      this.vendorTypes = response.data;
    },
    async getProvinces() {
      const response = await serverService.getProvinces();
      this.provinces = response.data;
    },
    async getDistrict(ProvinceID) {
      const response = await serverService.getDistrictByProvinceID(ProvinceID);
      this.districts = response.data;
      this.vendorDataSet.address.DistrictID = null;
      this.vendorDataSet.address.SubDistrictID = null;
      this.vendorDataSet.address.Zipcode = null;
    },
    async getSubDistrict(DistrictID) {
      const response = await serverService.getSubDistrictsByDistrictID(
        DistrictID
      );
      this.subDistricts = response.data;
      this.vendorDataSet.address.SubDistrictID = null;
      this.vendorDataSet.address.Zipcode = null;
    },
    async setZipcode(SubDistrictID) {
      const data = this.subDistricts.find(
        (item) => item.SubDistrictID == SubDistrictID
      );
      this.vendorDataSet.address.Zipcode = data.Zipcode;
    },
    async submitAddVendor() {
      // console.log(this.vendorDataSet);
      const { VendorName, VendorTypeID, address } = this.vendorDataSet;
      const { Line1, SubDistrictID, DistrictID, ProvinceID } = address;
      if (
        VendorName == null ||
        VendorName == "" ||
        VendorTypeID == null ||
        VendorTypeID == "" ||
        Line1 == "" ||
        SubDistrictID == null ||
        DistrictID == null ||
        ProvinceID == null
      ) {
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
            const response = await serverService.addVendor(this.vendorDataSet);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogAddVendor();
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
    async submitEditVendor() {
      // console.log(this.vendorDataSet);
      const { VendorID, VendorName, VendorTypeID } = this.vendorDataSet;
      if (
        VendorName == null ||
        VendorName == "" ||
        VendorTypeID == null ||
        VendorTypeID == ""
      ) {
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
            const response = await serverService.updateVendor(
              VendorID,
              this.vendorDataSet
            );
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "แก้ไขข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogEditVendor();
              this.initialize();
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
      const { VendorID, address } = this.vendorDataSet;
      const { Line1, ProvinceID, DistrictID, SubDistrictID } = address;
      if (
        !VendorID ||
        Line1 == "" ||
        Line1 == null ||
        ProvinceID == null ||
        DistrictID == null ||
        SubDistrictID == null
      ) {
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
              OwnerID: VendorID,
              AddressTypeID: 2,
              ...address,
            };
            const response = await serverService.addAddress(payload);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeDialogAddAddress();
              this.closeDialogEditVendor();
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
            const response = await serverService.deleteAddressByAddressID(
              addressId
            );
            if (response.data.result) {
              const indexToDelete = this.vendorDataSet.addresses.findIndex(
                (address) => address.AddressID === addressId
              );
              if (indexToDelete > -1) {
                this.vendorDataSet.addresses.splice(indexToDelete, 1);
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
    openDialogAddVendor() {
      this.dialogAddVendor = true;
    },
    closeDialogAddVendor() {
      this.dialogAddVendor = false;
      nextTick(() => {
        this.vendorDataSet = Object.assign({}, this.defaultItems);
        this.vendorDataSet.address = Object.assign({}, this.defaultItems.address);
        this.districts = [];
        this.subDistricts = [];
      });
    },
    openDialogEditVendor(item) {
      this.dialogEditVendor = true;
      this.vendorDataSet = {
        VendorID: item.VendorID,
        VendorName: item.VendorName,
        VendorTypeID: item.VendorTypeID,
        IDNumber: item.IDNumber,
        VendorTel: item.VendorTel,
        addresses: item.addresses,
        address: this.defaultItems.address,
      };
    },
    openDialogAddAddress() {
      this.dialogAddAddress = true;
    },
    closeDialogAddAddress() {
      this.dialogAddAddress = false;
      nextTick(() => {
        this.vendorDataSet.address = Object.assign({}, this.defaultItems.address);
      });
    },
    closeDialogEditVendor() {
      this.dialogEditVendor = false;
      nextTick(() => {
        this.vendorDataSet = Object.assign({}, this.defaultItems);
        this.vendorDataSet.address = Object.assign({}, this.defaultItems.address);
      });
    },
    async initialize() {
      await this.getVendors();
      await this.getVendorTypes();
      await this.getProvinces();
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
        @click="openDialogAddVendor"
        ><v-icon size="20">mdi-plus-circle-outline</v-icon>
        <span class="hidden-sm-and-down">&nbsp;เพิ่มข้อมูลคู่ค้า</span>
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table :items="vendors" :search="search" :headers="headers">
    <template v-slot:item.actions="{ item }">
      <div class="mr-1">
        <v-btn size="small" @click="openDialogEditVendor(item)">
          <EditIcon class="text-success" size="18" />
        </v-btn>
        <v-tooltip activator="parent" location="top">แก้ไข</v-tooltip>
      </div>
    </template>
  </v-data-table>
  <!-- Dialog Add Vendor -->
  <v-dialog
    v-model="dialogAddVendor"
    class="dialog-mw"
    style="max-width: 800px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">เพิ่มข้อมูลคู่ค้า</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              label="ชื่อคู่ค้า"
              v-model="vendorDataSet.VendorName"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="vendorTypes"
              v-model="vendorDataSet.VendorTypeID"
              item-value="VendorTypeID"
              item-title="VendorType"
              label="ประเภทคู่ค้า"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="เลขประจำตัวผู้เสียภาษี"
              v-model="vendorDataSet.IDNumber"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="เบอร์โทรศัพท์"
              v-model="vendorDataSet.VendorTel"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="ที่อยู่บรรทัดที่ 1"
              v-model="vendorDataSet.address.Line1"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="ที่อยู่บรรทัดที่ 2"
              v-model="vendorDataSet.address.Line2"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              :items="provinces"
              v-model="vendorDataSet.address.ProvinceID"
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
              v-model="vendorDataSet.address.DistrictID"
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
              v-model="vendorDataSet.address.SubDistrictID"
              item-value="SubDistrictID"
              item-title="name_th"
              label="แขวง / อำเภอ"
              @update:modelValue="setZipcode"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="vendorDataSet.address.Zipcode"
              label="รหัสไปรษณีย์"
              readonly
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitAddVendor"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>

      <v-card-actions>
        <v-col class="align-center"
          ><v-btn color="error" @click="closeDialogAddVendor" flat block
            >ปิดหน้าต่าง</v-btn
          ></v-col
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Add Vendor -->
  <!-- Dialog Edit Vendor -->
  <v-dialog
    v-model="dialogEditVendor"
    class="dialog-mw"
    style="max-width: 800px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">แก้ไขข้อมูลคู่ค้า</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              label="ชื่อคู่ค้า"
              v-model="vendorDataSet.VendorName"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              :items="vendorTypes"
              v-model="vendorDataSet.VendorTypeID"
              item-value="VendorTypeID"
              item-title="VendorType"
              label="ประเภทคู่ค้า"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="เลขประจำตัวผู้เสียภาษี"
              v-model="vendorDataSet.IDNumber"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="เบอร์โทรศัพท์"
              v-model="vendorDataSet.VendorTel"
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              color="primary"
              variant="outlined"
              @click="openDialogAddAddress"
            >
              <v-icon size="20">mdi-plus-circle-outline</v-icon>
              <span class="hidden-sm-and-down">&nbsp;เพิ่มที่อยู่</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
            v-for="(address, index) in vendorDataSet.addresses"
          >
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
                <v-btn
                  color="error"
                  text="ลบ"
                  @click="deleteAddress(address.AddressID)"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitEditVendor"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeDialogEditVendor" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Edit Vendor -->
  <!-- Dialog Add Address -->
  <v-dialog
    v-model="dialogAddAddress"
    class="dialog-mw"
    style="max-width: 800px"
    persistent
  >
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="ที่อยู่บรรทัดที่ 1"
              v-model="vendorDataSet.address.Line1"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              label="ที่อยู่บรรทัดที่ 2"
              v-model="vendorDataSet.address.Line2"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              :items="provinces"
              v-model="vendorDataSet.address.ProvinceID"
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
              v-model="vendorDataSet.address.DistrictID"
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
              v-model="vendorDataSet.address.SubDistrictID"
              item-value="SubDistrictID"
              item-title="name_th"
              label="แขวง / อำเภอ"
              @update:modelValue="setZipcode"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="vendorDataSet.address.Zipcode"
              label="รหัสไปรษณีย์"
              readonly
              hide-details
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitAddAddress"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeDialogAddAddress" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Add Address -->
</template>
