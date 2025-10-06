<script>
import serverService from "@/services/serverService";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";

export default {
  data() {
    const authStore = useAuthStore();
    const { EmployeeID, RoleID } = authStore.getEmpData;
    return {
      myEmployeeID: EmployeeID,
      myRoleID: RoleID,
      search: "",
      headers: [
        { title: "#ID", align: "start", key: "EmployeeID" },
        { title: "Account Name", align: "start", key: "Username" },
        { title: "ชื่อ - สกุล", align: "start", key: "FirstName" },
        { title: "ตำแหน่งงาน", align: "center", key: "position.PositionTitle" },
        { title: "ระดับผู้ใช้งาน", align: "center", key: "role.RoleName" },
        { title: "สถานะ", align: "center", key: "employeeStatus" },
        { title: "", align: "end", key: "actions" },
      ],
      employees: [],
      employeeStatus: [],
      positions: [],
      roles: [],
      //   dialog
      dialogAddEmployee: false,
      dialogEditEmployee: false,
      //   data for add
      employeeDataSet: {
        Username: "",
        FirstName: "",
        LastName: "",
        PositionID: null,
        RoleID: null,
        EmployeeEmail: "",
        EmployeeTel: "",
      },
      defaultItems: {
        Username: "",
        FirstName: "",
        LastName: "",
        PositionID: null,
        RoleID: null,
        EmployeeEmail: "",
        EmployeeTel: "",
      },
    };
  },
  methods: {
    async getEmployees() {
      const response = await serverService.getAllEmployees();
      this.employees = response.data;
    },
    async getPositions() {
      const response = await serverService.getAllPositions();
      this.positions = response.data;
    },
    async getRoles() {
      const response = await serverService.getAllRoles();
      this.roles = response.data.filter((item) => item.RoleID > this.myRoleID);
    },
    async getEmployeeStatus() {
      const response = await serverService.getAllEmployeeStatus();
      this.employeeStatus = response.data;
    },
    async submitAddEmployee() {
      const exceptionKeys = ["EmployeeEmail", "EmployeeTel"]; // ยกเว้นการตรวจ มีหรือไม่มีก็ได้
      const checkNullData = Object.entries(this.employeeDataSet).every(
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
        text: "ท่านต้องการเพิ่มข้อมูลพนักงาน ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await serverService.register(this.employeeDataSet);
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลพนักงานสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeAddEmployeeDialog();
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
              text: "ไม่สามารถเพิ่มข้อมูลพนักงานได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    async submitEditEmployee() {
      const exceptionKeys = ["EmployeeEmail", "EmployeeTel"]; // ยกเว้นการตรวจ มีหรือไม่มีก็ได้
      const checkNullData = Object.entries(this.employeeDataSet).every(
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
        text: "ท่านต้องการแก้ไขข้อมูลพนักงาน ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { EmployeeID } = this.employeeDataSet;
            const response = await serverService.updateEmployee(
              EmployeeID,
              this.employeeDataSet
            );
            console.log(response.data);

            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "แก้ไขข้อมูลพนักงานสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeEditEmployeeDialog();
              this.initialize();
            }
          } catch (error) {
            console.error(error);
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "ไม่สามารถแก้ไขข้อมูลพนักงานได้ กรุณาลองใหม่อีกครั้ง",
            });
          }
        }
      });
    },
    openAddEmployeeDialog() {
      this.dialogAddEmployee = true;
    },
    openEditEmployeeDialog(item) {
      this.employeeDataSet = {
        EmployeeID: item.EmployeeID,
        Username: item.Username,
        FirstName: item.FirstName,
        LastName: item.LastName,
        PositionID: item.PositionID,
        RoleID: item.RoleID,
        EmployeeEmail: item.EmployeeEmail,
        EmployeeTel: item.EmployeeTel,
        EmployeeStatusID: item.EmployeeStatusID,
      };
      nextTick(() => {
        this.dialogEditEmployee = true;
      });
    },
    closeEditEmployeeDialog() {
      this.dialogEditEmployee = false;
      nextTick(() => {
        this.employeeDataSet = Object.assign({}, this.defaultItems);
      });
    },
    closeAddEmployeeDialog() {
      this.dialogAddEmployee = false;
      nextTick(() => {
        this.employeeDataSet = Object.assign({}, this.defaultItems);
      });
    },
    async initialize() {
      await this.getEmployees();
      await this.getPositions();
      await this.getRoles();
      await this.getEmployeeStatus();
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
        @click="openAddEmployeeDialog"
        ><v-icon size="20">mdi-plus-circle-outline</v-icon>
        <span class="hidden-sm-and-down">&nbsp;เพิ่มพนักงาน</span>
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="employees"
    class="border rounded-md"
  >
    <template v-slot:item.FirstName="{ item }">
      {{ item.FirstName }} {{ item.LastName }}
    </template>
    <template v-slot:item.employeeStatus="{ item }">
      <v-chip
        :color="item.EmployeeStatusID == 1 ? 'success' : 'error'"
        style="width: 100px"
        size="small"
        label
        class="d-flex justify-center align-center"
      >
        {{ item.employeeStatus.EmployeeStatusTitle }}
      </v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="mr-1">
        <v-btn
          size="small"
          v-if="item.RoleID != 1 && item.EmployeeID != myEmployeeID"
          @click="openEditEmployeeDialog(item)"
        >
          <EditIcon class="text-success" size="18" />
        </v-btn>
        <v-tooltip activator="parent" location="top">แก้ไข</v-tooltip>
      </div>
    </template>
  </v-data-table>
  <!-- Dialog Add Employee -->
  <v-dialog
    v-model="dialogAddEmployee"
    class="dialog-mw"
    style="max-width: 800px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">เพิ่มข้อมูลพนักงาน</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Username (สำหรับใช้เข้าสู่ระบบ)"
              v-model="employeeDataSet.Username"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="ชื่อจริง"
              v-model="employeeDataSet.FirstName"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="นามสกุล"
              v-model="employeeDataSet.LastName"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="เบอร์โทรศัพท์"
              v-model="employeeDataSet.EmployeeTel"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="employeeDataSet.PositionID"
              :items="positions"
              item-value="PositionID"
              item-title="PositionTitle"
              label="ตำแหน่งงาน"
              hide-details
              chips
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="employeeDataSet.RoleID"
              :items="roles"
              item-value="RoleID"
              item-title="RoleName"
              label="ระดับผู้ใช้งาน"
              hide-details
              chips
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="อีเมลล์"
              v-model="employeeDataSet.EmployeeEmail"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitAddEmployee"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeAddEmployeeDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Add Employee -->
  <!-- Dialog Edit Employee -->
  <v-dialog
    v-model="dialogEditEmployee"
    class="dialog-mw"
    style="max-width: 800px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-4 bg-secondary">
        <span class="text-h5">แก้ไขข้อมูลพนักงาน</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Username (สำหรับใช้เข้าสู่ระบบ)"
              v-model="employeeDataSet.Username"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="ชื่อจริง"
              v-model="employeeDataSet.FirstName"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              label="นามสกุล"
              v-model="employeeDataSet.LastName"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="เบอร์โทรศัพท์"
              v-model="employeeDataSet.EmployeeTel"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="employeeDataSet.PositionID"
              :items="positions"
              item-value="PositionID"
              item-title="PositionTitle"
              label="ตำแหน่งงาน"
              hide-details
              chips
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="employeeDataSet.RoleID"
              :items="roles"
              item-value="RoleID"
              item-title="RoleName"
              label="ระดับผู้ใช้งาน"
              hide-details
              chips
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              label="อีเมลล์"
              v-model="employeeDataSet.EmployeeEmail"
              hide-details
            /> </v-col
          ><v-col cols="12" md="4">
            <v-select
              v-model="employeeDataSet.EmployeeStatusID"
              :items="employeeStatus"
              item-value="EmployeeStatusID"
              item-title="EmployeeStatusTitle"
              label="สถานะผู้ใช้งาน"
              hide-details
              chips
            >
            </v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitEditEmployee"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeEditEmployeeDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Edit Employee -->
</template>
