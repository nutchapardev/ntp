<script>
import serverService from "@/services/serverService";
import Swal from "sweetalert2";
import { checkStockAvailability } from "@/utils/functions";
import {
  CirclePlusIcon,
  TrashIcon,
  CircleMinusIcon,
  CircleXIcon,
  EditIcon,
} from "vue-tabler-icons";
export default {
  components: {
    CirclePlusIcon,
    TrashIcon,
    CircleMinusIcon,
    CircleXIcon,
    EditIcon,
  },
  data() {
    return {
      search: "",
      headers: [
        { title: "#ID", align: "start", key: "PresetID" },
        { title: "ชื่อพรีเซ็ต", align: "start", key: "Preset" },
        { title: "สถานะ", align: "center", key: "Status" },
        {
          title: "กลุ่มงานที่ใช้พรีเซ็ต",
          align: "end",
          key: "ref_model_category_parts",
        },
        { title: "จำนวนอุปกรณ์", align: "end", key: "presetDetails" },
        { title: "", align: "end", key: "actions" },
      ],
      partHeaders: [
        { title: "#", align: "start", key: "part.PartID" },
        { title: "รหัสอุปกรณ์", align: "start", key: "part.PartNumber" },
        { title: "ชื่ออุปกรณ์", align: "start", key: "part.PartName_th" },
        { title: "จำนวนที่ใช้", align: "center", key: "NumOfUse" },
        { title: "จำนวนในคลัง", align: "end", key: "part.PartAmount" },
        { title: "", align: "end", key: "actions" },
      ],
      addPartToPrasetHeader: [
        { title: "#", align: "start", key: "PartID" },
        { title: "รหัสอุปกรณ์", align: "start", key: "PartNumber" },
        { title: "ชื่ออุปกรณ์", align: "start", key: "PartName_th" },
        { title: "จำนวนที่ใช้", align: "center", key: "NumOfUse" },
        { title: "หน่วย", align: "end", key: "unit.Unit" },
        { title: "", align: "end", key: "actions" },
      ],
      presets: [],
      parts: [],
      activePreset: [],
      inactivePreset: [],
      sumActive: 0,
      sumInActive: 0,
      //   data for show
      showPartData: null,
      showRef: [],
      editPart: {
        PresetDetailID: null,
        PartName_th: "",
        NumOfUse: null, //default
      },
      addPreset: {
        Preset: "",
      },
      addPartDataSet: [],
      //   dialog
      dialogShowPart: false,
      dialogEditPart: false,
      dialogAddPreset: false,
      dialogAddPartToPreset: false,
      dialogShowRef: false,
    };
  },
  methods: {
    async getPresets() {
      this.resetDefaultData();
      const response = await serverService.getAllPresets();
      this.presets = response.data.map((preset) => {
        let available =
          this.checkStockInPreset(preset.presetDetails) &&
          preset.presetDetails.length > 0;
        if (available) {
          this.activePreset.push({ ...preset, available });
          this.sumActive++;
        } else {
          this.inactivePreset.push({ ...preset, available });
          this.sumInActive++;
        }
        return {
          ...preset,
          available,
        };
      });
      // console.log(this.presets);
    },
    async getParts() {
      const response = await serverService.getAllParts();
      this.parts = response.data;
    },
    async submitEditPart() {
      // console.log(this.editPart)

      const { PresetDetailID, NumOfUse } = this.editPart;
      if (
        NumOfUse <= 0 ||
        NumOfUse == null ||
        !PresetDetailID ||
        PresetDetailID == null
      ) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "กรุณากรอกจำนวนที่ใช้ให้ถูกต้อง",
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
            const response = await serverService.updatePresetDetailByID(
              PresetDetailID,
              { NumOfUse: parseInt(NumOfUse) }
            );
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "แก้ไขข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeEditPartDialog();
              this.closePartDialog();
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
    async submitAddPreset() {
      if (this.addPreset.Preset == "") {
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
            const { Preset } = this.addPreset;
            const response = await serverService.addPreset({ Preset });
            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              // this.closeEditPartDialog();
              this.closeAddPresetDialog();
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
    async submitAddPartToPreset() {
      let foundProblem = 0;
      this.addPartDataSet.forEach((item) => {
        if (
          !item.hasOwnProperty("NumOfUse") ||
          item.NumOfUse == "" ||
          item.NumOfUse == null
        ) {
          foundProblem++;
        }
      });

      if (foundProblem != 0 || this.addPartDataSet.length == 0) {
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
            const { PresetID } = this.showPartData;
            const payload = this.addPartDataSet.map((item) => {
              return {
                PresetID,
                PartID: item.PartID,
                NumOfUse: parseInt(item.NumOfUse),
              };
            });

            const response = await serverService.bulkCreatePresetDetail(
              payload
            );

            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "เพิ่มข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              this.closeAddPartToPresetDialog();
              this.closePartDialog();
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
    async deletePartInPreset(item) {
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
            const response = await serverService.deletePresetDetailByID(
              item.PresetDetailID
            );

            if (response.data.result) {
              Swal.fire({
                icon: "success",
                title: "สำเร็จ",
                text: "ลบข้อมูลสำเร็จ",
                timer: 1500,
                showConfirmButton: false,
              });
              // this.closeEditPartDialog();
              this.closePartDialog();
              this.initialize();
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
    async deletePreset(item) {
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
          Swal.fire({
            title: "Are you sure?",
            text: "พรีเซ็ตจะถูกนำออกจากกลุ่มงานที่ใช้อยู่ปัจจุบัน ท่านแน่ใจแล้ว ใช่หรือไม่?",
            icon: "warning",
            color: "red",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText:
              "<span style='color:white;'>Yes, continue!</span>",
            cancelButtonText: "<span style='color:white;'>Cancel</span>",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await serverService.deletePresetByID(
                  item.PresetID
                );

                if (response.data.result) {
                  Swal.fire({
                    icon: "success",
                    title: "สำเร็จ",
                    text: "ลบข้อมูลสำเร็จ",
                    timer: 1500,
                    showConfirmButton: false,
                  });
                  // this.closeEditPartDialog();
                  // this.closePartDialog();
                  this.initialize();
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
        }
      });
    },
    setPresetDataStatus(status) {
      this.search = "";
      if (status) this.presets = this.activePreset;
      else this.presets = this.inactivePreset;
    },
    resetDefaultData() {
      this.search = "";
      this.sumActive = 0;
      this.sumInActive = 0;
      this.activePreset = [];
      this.inactivePreset = [];
    },
    checkStockInPreset(data) {
      return checkStockAvailability(data);
    },
    openPartDialog(data) {
      this.dialogShowPart = true;
      this.showPartData = data;
    },
    openAddPresetDialog() {
      this.dialogAddPreset = true;
    },
    openEditPartDialog(item) {
      this.editPart = {
        PresetDetailID: item.PresetDetailID,
        PartName_th: item.part.PartName_th,
        NumOfUse: item.NumOfUse,
      };
      // console.log(this.editPart)

      this.dialogEditPart = true;
    },
    async openAddPartToPresetDialog() {
      this.dialogAddPartToPreset = true;
      await this.getParts();
    },
    openShowRefDialog(item) {
      this.dialogShowRef = true;
      this.showRef = item.ref_model_category_parts;
    },
    closeShowRefDialog() {
      this.dialogShowRef = false;
      this.showRef = [];
    },
    closeAddPartToPresetDialog() {
      this.dialogAddPartToPreset = false;
      this.addPartDataSet = [];
      this.parts = [];
    },
    closePartDialog() {
      this.dialogShowPart = false;
      this.showPartData = null;
    },
    closeEditPartDialog() {
      this.dialogEditPart = false;
      this.editPart = {
        PresetDetailID: null,
        PartName_th: "",
        NumOfUse: null,
      };
    },
    closeAddPresetDialog() {
      this.dialogAddPreset = false;
      this.addPreset = {
        Preset: "",
      };
    },
    setRowClass({ item }) {
      if (item.NumOfUse <= item.part.PartAmount) {
        return { class: "" };
      }
      return { class: "high-fat-row" };
    },
    async initialize() {
      await this.getPresets();
      this.showPartData = null;
    },
  },
  created() {
    this.initialize();
  },
};
</script>
<template>
  <v-row class="mb-3">
    <!-- all preset data -->
    <v-col cols="12" md="4" sm="6">
      <div
        class="pa-6 d-flex ga-3 align-center cursor-pointer rounded-lg bg-lightinfo"
        @click="getPresets"
      >
        <div class="d-flex ga-3 align-center">
          <v-avatar size="38" class="bg-info rounded-md">
            <ListDetailsIcon size="20" />
          </v-avatar>
          <div>
            <h6 class="text-h6 font-weight-medium">ทั้งหมด</h6>
            <p
              class="text-14 lh-normal textSecondary"
              v-if="presets.length == 0"
            >
              0 Preset
            </p>
            <p class="text-14 lh-normal textSecondary" v-else>
              {{ presets.length }} Presets
            </p>
          </div>
        </div>
      </div>
    </v-col>
    <!-- active preset data -->
    <v-col cols="12" md="4" sm="6">
      <div
        class="pa-6 d-flex ga-3 align-center cursor-pointer rounded-lg bg-lightsuccess"
        @click="setPresetDataStatus(true)"
      >
        <div class="d-flex ga-3 align-center">
          <v-avatar size="38" class="bg-success rounded-md">
            <ListDetailsIcon size="20" />
          </v-avatar>
          <div>
            <h6 class="text-h6 font-weight-medium">พร้อมใช้งาน</h6>
            <p class="text-14 lh-normal textSecondary" v-if="sumActive == 0">
              0 Preset
            </p>
            <p class="text-14 lh-normal textSecondary" v-else>
              {{ sumActive }} Presets
            </p>
          </div>
        </div>
      </div>
    </v-col>
    <v-col cols="12" md="4" sm="6">
      <!-- inactive data -->
      <div
        class="pa-6 d-flex ga-3 align-center cursor-pointer rounded-lg bg-lighterror"
        @click="setPresetDataStatus(false)"
      >
        <div class="d-flex ga-3 align-center">
          <v-avatar size="38" class="bg-error rounded-md">
            <ListDetailsIcon size="20" />
          </v-avatar>
          <div>
            <h6 class="text-h6 font-weight-medium">ไม่พร้อมใช้งาน</h6>
            <p class="text-14 lh-normal textSecondary" v-if="sumInActive == 0">
              0 Preset
            </p>
            <p class="text-14 lh-normal textSecondary" v-else>
              {{ sumInActive }} Presets
            </p>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
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
        @click="openAddPresetDialog"
        ><v-icon size="20">mdi-plus-circle-outline</v-icon>
        <span class="hidden-sm-and-down">&nbsp;เพิ่มพรีเซ็ต</span>
      </v-btn>
    </v-col>
  </v-row>

  <v-data-table
    class="border rounded-md"
    :search="search"
    :headers="headers"
    :items="presets"
    v-if="presets.length > 0"
  >
    <template v-slot:item.PresetID="{ item }"> #{{ item.PresetID }} </template>

    <template v-slot:item.Status="{ item }">
      <div v-if="item.presetDetails" class="d-flex justify-center">
        <v-chip
          :color="item.available ? 'success' : 'error'"
          style="width: 100px"
          size="small"
          label
          class="d-flex justify-center align-center"
        >
          {{ item.available ? "พร้อมใช้งาน" : "ไม่พร้อมใช้งาน" }}
        </v-chip>
      </div>
    </template>

    <template v-slot:item.ref_model_category_parts="{ item }">
      <div v-if="item.ref_model_category_parts" class="d-flex justify-end">
        <!-- {{ item.presetDetails.length }} ชิ้นส่วน -->

        <v-chip
          color="light"
          style="width: 100px"
          size="small"
          label
          class="d-flex justify-center align-center"
          link
          @click="openShowRefDialog(item)"
        >
          {{ item.ref_model_category_parts.length }} กลุ่มงาน
          <v-tooltip activator="parent" location="bottom"
            >ดูรายละเอียด</v-tooltip
          >
        </v-chip>
      </div>
    </template>

    <template v-slot:item.presetDetails="{ item }">
      <div v-if="item.presetDetails" class="d-flex justify-end">
        <!-- {{ item.presetDetails.length }} ชิ้นส่วน -->

        <v-chip
          color="info"
          style="width: 100px"
          size="small"
          label
          class="d-flex justify-center align-center"
          link
          @click="openPartDialog(item)"
        >
          {{ item.presetDetails.length }} ชิ้นส่วน
          <v-tooltip activator="parent" location="bottom"
            >ดูรายละเอียด</v-tooltip
          >
        </v-chip>
      </div>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-3 align-center justify-center">
        <div class="cursor-pointer" @click="deletePreset(item)">
          <v-avatar color="lighterror" size="32">
            <TrashIcon class="text-error" size="18" />
          </v-avatar>
          <v-tooltip activator="parent" location="bottom">Delete</v-tooltip>
        </div>
      </div>
    </template>
  </v-data-table>
  <!-- Dialog show Part -->
  <v-dialog
    v-model="dialogShowPart"
    class="dialog-mw"
    style="max-width: 1000px"
    persistent
  >
    <v-card class="pa-3" v-if="showPartData != null">
      <v-card-title>
        <v-row>
          <v-col cols="9"
            >#{{ showPartData.PresetID }}. {{ showPartData.Preset }}</v-col
          >
          <v-col>
            <v-btn
              block
              color="secondary"
              variant="flat"
              dark
              @click="openAddPartToPresetDialog"
              ><v-icon size="20">mdi-plus-circle-outline</v-icon>
              <span class="hidden-sm-and-down"
                >&nbsp;เพิ่มอุปกรณ์ในพรีเซ็ต</span
              >
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="partHeaders"
          :items="showPartData.presetDetails"
          :row-props="setRowClass"
          density="compact"
        >
          <template v-slot:item.part.PartID="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              class="mr-1"
              @click="openEditPartDialog(item)"
              ><v-icon>mdi-pencil-outline</v-icon></v-btn
            >
            <v-btn
              color="error"
              variant="outlined"
              size="small"
              @click="deletePartInPreset(item)"
              ><v-icon>mdi-delete-variant</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
      <!-- <v-card-actions>
        <v-btn color="info" block flat>บันทึกข้อมูล</v-btn>
      </v-card-actions> -->
      <v-card-actions>
        <v-btn color="error" @click="closePartDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog show Part -->
  <!-- Dialog edit Part -->
  <v-dialog
    v-model="dialogEditPart"
    class="dialog-mw"
    style="max-width: 500px"
    persistent
  >
    <v-card class="pa-3" v-if="editPart != null">
      <v-card-text>
        <v-text-field
          label="ชื่ออุปกรณ์"
          v-model="editPart.PartName_th"
          readonly
        />
        <v-text-field
          label="จำนวนที่ใช้"
          type="number"
          v-model="editPart.NumOfUse"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitEditPart"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeEditPartDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog edit Part -->
  <!-- Dialog Add Preset -->
  <v-dialog
    v-model="dialogAddPreset"
    class="dialog-mw"
    style="max-width: 500px"
    persistent
  >
    <v-card class="pa-3">
      <v-card-text>
        <v-text-field label="ชื่อพรีเซ็ต" v-model="addPreset.Preset" />
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitAddPreset"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeAddPresetDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Add Preset -->
  <!-- Dialog Add Part To Preset -->
  <v-dialog
    v-model="dialogAddPartToPreset"
    class="dialog-mw"
    style="max-width: 1000px"
    persistent
  >
    <v-card class="pa-3">
      <v-card-text>
        <v-autocomplete
          color="primary"
          :items="parts"
          v-model="addPartDataSet"
          item-value="PartID"
          item-title="PartName_th"
          label="เลือกอุปกรณ์"
          chips
          hide-details
          multiple
          return-object
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="`รหัส : ${item.raw.PartNumber} || ${item.raw.PartName_th}`"
            >
            </v-list-item>
          </template>
        </v-autocomplete>
        <v-data-table
          :items="addPartDataSet"
          :headers="addPartToPrasetHeader"
          density="compact"
          class="mt-3"
        >
          <template v-slot:item.NumOfUse="{ item, index }">
            <div class="d-flex align-center justify-center">
              <v-text-field
                style="width: 50px"
                v-model="addPartDataSet[index].NumOfUse"
                label="จำนวน"
                type="number"
                hide-details=""
              />
            </div>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn color="info" block flat @click="submitAddPartToPreset"
          >บันทึกข้อมูล</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeAddPartToPresetDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Add Part To Preset -->
  <!-- Dialog Show Ref -->
  <v-dialog
    v-model="dialogShowRef"
    class="dialog-mw"
    style="max-width: 1200px"
    persistent
  >
    <v-card class="pa-3">
      <v-card-text>
        <!-- <v-text-field label="ชื่อพรีเซ็ต" v-model="addPreset.Preset" /> -->
        <!-- <v-list-item
          v-for="(item, index) in showRef"
          :key="index"
          :title="`${index + 1}. ${item.repairCategory.RepairCategory}`"
        >
        </v-list-item> -->
        <v-table class="border">
          <thead>
            <tr>
              <th>#</th>
              <th class="text-start">ประเภทการซ่อม</th>
              <th class="text-start">ยี่ห้อ / รุ่น</th>
              <th class="text-center">ชื่อกลุ่มงาน</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="showRef.length == 0">
              <td colspan="4" class="text-center">
                ไม่พบกลุ่มงานที่ใช้พรีเซ็ตนี้
              </td>
            </tr>
            <tr v-else v-for="(item, index) in showRef" :key="index">
              <td>{{ index + 1 }}.</td>
              <td>{{ item.partCategory.PartCategoryName }}</td>
              <td width="20%">
                {{ item.brand.Brand }} ({{ item.model.Model }})
              </td>
              <td>{{ item.repairCategory.RepairCategory }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="closeShowRefDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog Show Ref -->
</template>

<style>
.high-fat-row {
  background-color: #ffebee !important;
  /* background-color: #ffcdd2 !important; */
}

.high-fat-row:hover {
  background-color: #ffcdd2 !important;
}
</style>
