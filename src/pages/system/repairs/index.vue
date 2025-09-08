<script>
// 1. Imports จะย้ายมาอยู่ด้านบนสุดของ script
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import UiParentCard from "@/components/shared/UiParentCard.vue"
// import { BasicDatatables } from "@/_mockApis/components/datatable/dataTable"
import serverService from "@/services/serverService"
import Swal from "sweetalert2"
import { useAuthStore } from "@/stores/authStore"

export default {
  name: "Repairs",
  // 2. ลงทะเบียน Components ที่จะใช้ใน Template
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  // 3. ข้อมูลทั้งหมดจะถูกย้ายมาไว้ใน data()
  data() {
    const authStore = useAuthStore()
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
      // items
      brandItems: [],
      modelItems: [],
      carsItems: [],
      // dialog
      dialogAddRepair: false,
      dialogChoose: false,
      dialogCustomer: false,
    }
  },
  // 4. ฟังก์ชันต่างๆ จะถูกย้ายมาไว้ใน methods
  methods: {
    filterOnlyCapsText(value, query, item) {
      return (
        value != null &&
        query != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(query) !== -1
      )
    },
    async getRepairs() {
      try {
        const response = await serverService.getAllRepairs()
        console.log("Repairs data:", response.data)
        this.RepairsData = response.data
      } catch (error) {
        console.error("Error fetching repairs:", error)
      }
    },
    async getBrands() {
      try {
        const response = await serverService.getBrands()
        console.log("Brands data:", response.data)
        this.brandItems = response.data
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    },
    async getCarModel(BrandID) {
      // console.log("Selected BrandID:", BrandID)
      try {
        const response = await serverService.getCarModelByBrandID(BrandID)
        this.modelItems = response.data
        console.log("Model data:", response.data)
      } catch (error) {
        console.error("Error fetching brands:", error)
      }
    },
    async getCars() {
      try {
        const response = await serverService.getCars()
        console.log("Cars data naja:", response.data)
        this.carsItems = response.data
        console.log("carsItems :", this.carsItems)
      } catch (error) {
        console.error("Error fetching cars:", error)
      }
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
          Swal.fire("Deleted!", "Your file has been deleted.", "success")
        }
      })
    },
    chooseNewCustomer() {
      this.dialogChoose = false
      this.dialogAddRepair = true
    },
    chooseExistingCustomer() {
      console.log("chooseExistingCustomer")
      // this.getCars()
      this.dialogChoose = false
      this.dialogCustomer = true
    },
    closeChooseCustomerDialog() {
      this.dialogCustomer = false
      this.carIdForSearch = null
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    close() {
      this.dialogAddRepair = false
      nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    save() {
      console.log("save : ", this.editedItem)
      this.close()
    },
    async submitChooseCustomer() {
      if (!this.carIdForSearch) {
        Swal.fire("Alert!", "กรุณาเลือกข้อมูลรถยนต์", "warning")
        return
      }
      // console.log("submitChooseCustomer :", this.carIdForSearch)
      const response = await serverService.getCarByCarID(this.carIdForSearch)
      console.log("response car by CarID :", response.data)
      if (!response.data.CarID) {
        Swal.fire("Error!", "เกิดข้อผิดพลาด", "error")
        return
      }
      this.closeChooseCustomerDialog()
    },
    initialize() {
      this.getRepairs()
      this.getBrands()
      this.getCars()
    },
  },
  mounted() {
    this.initialize()
  },
}
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  {{ editedItem }}
  <v-row>
    <v-col cols="12">
      <UiParentCard title="รายการซ่อมรถยนต์">
        <v-row>
          <v-col cols="10">
            <v-text-field
              v-model="search"
              append-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
              class="mb-5"
            />
          </v-col>
          <v-col cols="2" class="text-right">
            <!-- dialog Choose -->

            <v-dialog
              v-model="dialogChoose"
              class="dialog-mw"
              max-width="400px"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  height="48"
                  block
                  color="primary"
                  variant="flat"
                  dark
                  v-bind="props"
                  @click="dialogChoose = true"
                  ><v-icon size="20">mdi-plus-circle-outline</v-icon
                  >&nbsp;เพิ่มรายการ</v-btn
                >
              </template>
              <v-card>
                <v-card-actions>
                  <v-btn color="secondary" block @click="chooseNewCustomer" flat
                    >ลูกค้าใหม่</v-btn
                  >
                </v-card-actions>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    block
                    @click="chooseExistingCustomer"
                    flat
                    >ลูกค้าเก่า</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
            <!-- dialog Choose -->
          </v-col>
        </v-row>

        <v-data-table
          items-per-page="5"
          :headers="headers"
          :items="RepairsData"
          :search="search"
          class="border rounded-md"
        >
          <template v-slot:item.RepairID="{ item }">
            #{{ item.RepairID }}
          </template>

          <template v-slot:item.car.CarNumber="{ item }">
            {{ item.car.CarTitle }} {{ item.car.CarNumber }}
          </template>

          <template v-slot:item.car.brand.Brand="{ item }">
            {{ item.car.brand.Brand }} ( {{ item.car.model.Model }} )
          </template>

          <template v-slot:item.workStatus.WorkStatus_th="{ item }">
            <v-chip
              :color="
                item.workStatus.WorkStatus_th == 'กำลังตรวจสอบรถ'
                  ? 'primary'
                  : 'success'
              "
              :text="item.workStatus.WorkStatus_th"
              class="text-uppercase"
              label
              size="small"
            ></v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-3 align-center justify-center">
              <RouterLink :to="`/apps/invoice/edit/_id`">
                <v-avatar color="lightsuccess" size="32">
                  <EditIcon class="text-success" size="18" />
                </v-avatar>
                <v-tooltip activator="parent" location="bottom"
                  >Edit Repair</v-tooltip
                >
              </RouterLink>

              <RouterLink :to="`/system/repairs/${item.RepairID}`">
                <v-avatar color="lightprimary" size="32">
                  <EyeIcon class="text-primary" size="18" />
                </v-avatar>
                <v-tooltip activator="parent" location="bottom"
                  >View Repair</v-tooltip
                >
              </RouterLink>

              <RouterLink
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
              </RouterLink>
            </div>
          </template>
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>

  <!-- dialog Add Repair -->
  <v-dialog v-model="dialogAddRepair" max-width="700px" persistent>
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">เพิ่มข้อมูล</span>
      </v-card-title>

      <v-card-text>
        <v-container class="px-0">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="brandItems"
                item-value="BrandID"
                item-title="Brand"
                v-model="editedItem.BrandID"
                label="Brand"
                hide-details
                @update:modelValue="getCarModel"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="modelItems"
                item-value="ModelID"
                item-title="Model"
                v-model="editedItem.ModelID"
                label="Model"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                v-model="editedItem.CarID"
                label="รถยนต์"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="brandItems"
                v-model="editedItem.CustomerID"
                label="ชื่อลูกค้า"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                disabled
                v-model="editedItem.EmployeeName"
                label="EmployeeName"
              ></v-text-field>
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
  <!-- dialog Add Repair -->
  <!-- dialog Choose Customer -->
  <v-dialog
    v-model="dialogCustomer"
    class="dialog-mw"
    max-width="500px"
    persistent
  >
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
            <v-list-item
              v-bind="props"
              :title="`${item.raw.CarTitle} ${item.raw.CarNumber} ${item.raw.province.name_th} - ${item.raw.customer.customerTitle.CustomerTitle} ${item.raw.customer.CustomerName} ${item.raw.customer.CustomerSurname}`"
            >
            </v-list-item>
          </template>
          <template v-slot:selection="{ item }">
            <span>
              {{ item.raw.CarTitle }} {{ item.raw.CarNumber }}
              {{ item.raw.province.name_th }} -
              <span style="font-weight: bold">
                {{ item.raw.customer.customerTitle.CustomerTitle }}
                {{ item.raw.customer.CustomerName }}
                {{ item.raw.customer.CustomerSurname }}
              </span>
            </span>
          </template>
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="submitChooseCustomer" flat
          >ตกลง</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="secondary" block @click="closeChooseCustomerDialog" flat
          >Close Dialog</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- dialog Choose Customer -->
</template>
