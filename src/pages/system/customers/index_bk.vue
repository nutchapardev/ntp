<script>
import { nextTick } from "vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { getNumberOfDigits, getRandomColor } from "@/utils/functions";
// import { sub } from "date-fns"

export default {
  name: "Customers",
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  data() {
    return {
      getRandomColor,
      search: "",
      page: { title: "Customers" },
      breadcrumbs: [
        {
          text: "Customers and Vendors",
          disabled: false,
          href: "#",
        },
        {
          text: "Customers",
          disabled: false,
          href: "#",
        },
      ],
      dialog: false,
      dialogDelete: false,
      dialogAddAddress: false,
      dialogDeleteAddress: false,
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
        { title: "Actions", key: "actions", sortable: false },
      ],
      customers: [],
      editedIndex: -1,
      editedItem: {
        CustomerTitleID: 99,
        CustomerName: "",
        CustomerSurname: "",
        IDNumber: null,
        CustomerTel: null,
        addresses: [],
      },
      defaultItem: {
        CustomerTitleID: 99,
        CustomerName: "",
        CustomerSurname: "",
        IDNumber: null,
        CustomerTel: null,
        addresses: [],
      },
      addressForAdd: {
        Line1: "",
        Line2: "",
        SubDistrictID: null,
      },
      defaultAddressForAdd: {
        Line1: "",
        Line2: "",
        SubDistrictID: null,
      },
      title_items: [
        { title: "นาย", value: 1 },
        { title: "นาง", value: 2 },
        { title: "นางสาว", value: 3 },
        { title: "ไม่ระบุ", value: 99 },
      ],
      subDistrictItems: [],
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "เพิ่มข้อมูล" : "แก้ไขข้อมูล";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    async addAddress() {
      const { SubDistrictID } = this.addressForAdd;
      if (this.editedIndex === -1) {
        // console.log("เพิ่มข้อมูล")
        let payload = {
          DistrictID: getNumberOfDigits(SubDistrictID, 4, true),
          ProvinceID: getNumberOfDigits(SubDistrictID, 2, true),
          // AddressTypeID: 1,
          ...this.addressForAdd,
        };

        this.editedItem.addresses.push(payload);
        this.closeDialogAddAddress();
      } else {
        // console.log("แก้ไขข้อมูล")
        if (
          (this.addressForAdd.Line1 == "" && this.addressForAdd.Line2 == "") ||
          this.addressForAdd.SubDistrictID == null
        ) {
          Swal.fire({
            icon: "warning",
            text: "กรุณาเพิ่มที่อยู่ให้ครบถ้วน",
            showConfirmButton: false,
            timer: 1500,
          });
          return;
        }
        let payload = {
          OwnerID: this.editedItem.CustomerID,
          DistrictID: getNumberOfDigits(SubDistrictID, 4, true),
          ProvinceID: getNumberOfDigits(SubDistrictID, 2, true),
          AddressTypeID: 1,
          ...this.addressForAdd,
        };
        const response = await serverService.addAddress(payload);

        if (response.data.result) {
          payload = {
            ...payload,
            AddressID: response.data.AddressID,
          };
        }
        this.editedItem.addresses.push(payload);
        this.closeDialogEditAddress();
      }
    },
    async deleteAddress(AddressID, index) {
      if (this.editedIndex === -1) {
        this.editedItem.addresses = this.editedItem.addresses.splice(
          index - 1,
          1
        );
        // console.log("remove item in local")
        return;
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText:
            "<span style='color:white;'>Yes, delete it!</span>",
          cancelButtonText: "<span style='color:white;'>Cancel</span>",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = (
              await serverService.deleteAddressByAddressID(AddressID)
            ).data;
            if (response.result) {
              this.editedItem.addresses = this.editedItem.addresses.filter(
                (item) => item.AddressID !== AddressID
              );
              this.initialize();
            } else {
              Swal.fire({
                title: "Error!",
                text: response.message,
                icon: "error",
              });
            }
            Swal.fire({
              title: "Deleted!",
              text: "Your data has been deleted.",
              icon: "success",
            });
          }
        });
      }
    },
    async getCustomers() {
      try {
        const response = await serverService.getAllCustomers();
        this.customers = response.data;
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    },
    async getSubDistricts() {
      try {
        const response = await serverService.getAllSubDistricts();
        this.subDistrictItems = response.data;
      } catch (error) {
        console.error("Error fetching sub-districts:", error);
      }
    },
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, delete it!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await serverService.deleteCustomerByID(
            item.CustomerID
          );
          if (response.data.result) {
            this.getCustomers();
          } else {
            Swal.fire({
              title: "Error!",
              text: response.data.message,
              icon: "error",
            });
            return;
          }

          Swal.fire({
            title: "Deleted!",
            text: "Your data has been deleted.",
            icon: "success",
          });
        }
      });
    },
    deleteItemConfirm() {
      this.customers.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    closeDialogEditAddress() {
      this.dialogAddAddress = false;
      nextTick(() => {
        this.addressForAdd = Object.assign({}, this.defaultAddressForAdd);
        // this.editedIndex = -1
      });
    },
    closeDialogAddAddress() {
      this.dialogAddAddress = false;
      nextTick(() => {
        this.addressForAdd = Object.assign({}, this.defaultAddressForAdd);
        // this.editedIndex = -1
      });
    },
    closeDelete() {
      this.dialogDelete = false;
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      if (this.editedItem.CustomerName.length === 0) {
        Swal.fire({
          icon: "warning",
          text: "กรุณาเพิ่มชื่อจริง",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
      if (this.editedIndex > -1) {
        // console.log("edit data in this section.")
        const response = await serverService.editCustomerByID(
          this.editedItem.CustomerID,
          this.editedItem
        );
        if (response.data.result) {
          this.getCustomers();
          this.close();
          Swal.fire({
            icon: "success",
            text: "แก้ไขข้อมูลเรียบร้อย",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: response.data.message,
          });
        }
      } else {
        const response = await serverService.addCustomersAndAddresses(
          this.editedItem
        );
        if (response.data.result) {
          this.getCustomers();
          this.close();
          Swal.fire({
            icon: "success",
            text: "บันทึกข้อมูลเรียบร้อย",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: response.data.message,
          });
        }
      }
      // this.close()
    },
    initialize() {
      this.getCustomers();
      this.getSubDistricts();
    },
  },
};
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <v-row>
    <v-col cols="12">
      <UiParentCard Tableard title="ตารางข้อมูลลูกค้า">
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
              @click="dialog = true"
              ><v-icon size="20">mdi-plus-circle-outline</v-icon>
              <span class="hidden-sm-and-down">&nbsp;เพิ่มข้อมูลลูกค้า</span>
            </v-btn>
          </v-col>
        </v-row>
        <v-data-table
          class="border rounded-md"
          :headers="headers"
          :items="customers"
          :sort-by="[{ key: 'CustomerID', order: 'desc' }]"
        >
          <template v-slot:item.CustomerName="{ item }">
            {{
              item.customerTitle.CustomerTitleID != 99
                ? item.customerTitle.CustomerTitle
                : ""
            }}
            {{ item.CustomerName }}
            {{ item.CustomerSurname }}
          </template>
          <template v-slot:item.cars="{ item }">
            <!-- {{ item.cars.length }} คัน -->
            <v-chip
              v-for="(car, index) in item.cars"
              :key="index"
              rounded="pill"
              class="font-weight-bold"
              :color="getRandomColor()"
              size="small"
              label
            >
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
          <template v-slot:item.actions="{ item }">
            <v-icon
              color="info"
              size="small"
              class="me-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon color="error" size="small" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>

  <!-- dialog add customer -->
  <v-dialog v-model="dialog" max-width="700px">
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text>
        <v-container class="px-0">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="title_items"
                v-model="editedItem.CustomerTitleID"
                label="คำนำหน้าชื่อ"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.CustomerName"
                label="ชื่อจริง"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.CustomerSurname"
                label="นามสกุล"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.IDNumber"
                label="รหัสประจำตัวประชาชน"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.CustomerTel"
                label="เบอร์โทรศัพท์"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-alert
                v-for="(item, index) in editedItem.addresses"
                :key="item.AddressID"
                variant="tonal"
                class="bg-light mb-3"
                closable
                height="70px"
              >
                <!-- <h5 class="text-h6 text-capitalize">error</h5> -->
                <div style="font-size: 1rem">
                  {{ item.Line1 }} {{ item.Line2 }}
                </div>
                <div style="font-size: 0.875rem">
                  {{
                    subDistrictItems.find(
                      (sub) => sub.SubDistrictID === item.SubDistrictID
                    )?.name_th || "ไม่พบข้อมูล"
                  }}
                  |
                  {{
                    subDistrictItems.find(
                      (sub) => sub.SubDistrictID === item.SubDistrictID
                    )?.district.name_th || "ไม่พบข้อมูล"
                  }}
                  |
                  {{
                    subDistrictItems.find(
                      (sub) => sub.SubDistrictID === item.SubDistrictID
                    )?.district.province.name_th || "ไม่พบข้อมูล"
                  }},
                  {{
                    subDistrictItems.find(
                      (sub) => sub.SubDistrictID === item.SubDistrictID
                    )?.Zipcode || "ไม่พบข้อมูล"
                  }}
                </div>
                <template v-slot:close>
                  <v-btn icon @click="deleteAddress(item.AddressID, index)">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" dark @click="dialogAddAddress = true">
          <v-icon>mdi-plus</v-icon>เพิ่มที่อยู่
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="flat" dark @click="close"> ยกเลิก </v-btn>
        <v-btn color="success" class="ml-3" variant="flat" dark @click="save">
          บันทึก
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- dialog add customer -->
  <!-- dialog delete address -->
  <v-dialog v-model="dialogDeleteAddress" height="200px" width="400px">
    <v-card>
      <v-card-text class="d-flex justify-center align-center">
        ท่านต้องการลบที่อยู่นี้ใช่หรือไม่?
      </v-card-text>
      <v-card-actions>
        <div class="d-flex">
          <v-btn color="secondary" @click="dialogDeleteAddress = false" flat
            >ยกเลิก</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            class="ml-3"
            color="error"
            variant="flat"
            @click="dialogDeleteAddress = false"
            flat
            >ลบข้อมูล</v-btn
          >
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- dialog delete address -->
  <!-- dialog add address -->
  <v-dialog v-model="dialogAddAddress" height="auto" width="600px">
    <v-card>
      <v-card-text class="d-flex justify-center align-center">
        <!-- ท่านต้องการลบที่อยู่นี้ใช่หรือไม่? -->
        <v-row class="mt-3"
          ><v-col cols="12">
            <v-text-field
              v-model.trim="addressForAdd.Line1"
              label="ที่อยู่บรรทัดที่ 1"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model.trim="addressForAdd.Line2"
              label="ที่อยู่บรรทัดที่ 2"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-autocomplete
              prepend-inner-icon="mdi-magnify"
              label="ค้นหา"
              v-model="addressForAdd.SubDistrictID"
              :items="subDistrictItems"
              item-title="name_th"
              item-value="SubDistrictID"
              color="primary"
              variant="outlined"
              hide-details
            >
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.name_th} >> ${item.raw.district.name_th} >> ${item.raw.district.province.name_th}, ${item.raw.Zipcode}`"
                >
                </v-list-item>
              </template>
              <template v-slot:selection="{ item }">
                <span>
                  {{ item.raw.name_th }} >> {{ item.raw.district.name_th }} >>
                  {{ item.raw.district.province.name_th }},
                  {{ item.raw.Zipcode }}
                </span>
              </template>
            </v-autocomplete>
          </v-col></v-row
        >
      </v-card-text>
      <v-card-actions>
        <div class="d-flex">
          <v-btn color="secondary" @click="dialogAddAddress = false" flat
            >ยกเลิก</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            class="ml-3"
            color="error"
            variant="flat"
            @click="addAddress"
            flat
            >บันทึกที่อยู่</v-btn
          >
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- dialog delete address -->
</template>