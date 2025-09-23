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
      presets: [],
      activePreset: [],
      inactivePreset: [],
      sumActive: 0,
      sumInActive: 0,
      //   data for show
      showPartData: null,
      editPart: {
        PresetDetailID: null,
        PartName_th: "",
        NumOfUse: null, //default
      },
      //   dialog
      dialogShowPart: false,
      dialogEditPart: false,
    };
  },
  methods: {
    async getPresets() {
      this.resetDefaultData();
      const response = await serverService.getAllPresets();
      this.presets = response.data.map((preset) => {
        let available = this.checkStockInPreset(preset.presetDetails);
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
    openEditPartDialog(item) {
      this.editPart = {
        PresetDetailID: item.PresetDetailID,
        PartName_th: item.part.PartName_th,
        NumOfUse: item.NumOfUse,
      };
      console.log(this.editPart);

      this.dialogEditPart = true;
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
      <v-btn height="48" block color="secondary" variant="flat" dark
        ><v-icon size="20">mdi-plus-circle-outline</v-icon>
        <span class="hidden-sm-and-down">&nbsp;เพิ่มพรีเซ็ต</span>
      </v-btn>
    </v-col>
  </v-row>

  <v-data-table
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
        </v-chip>
      </div>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-3 align-center justify-center">
        <div>
          <v-avatar color="lightsuccess" size="32">
            <EditIcon class="text-success" size="18" />
          </v-avatar>
          <v-tooltip activator="parent" location="bottom">Edit</v-tooltip>
        </div>
        <div>
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
      <v-card-title
        >#{{ showPartData.PresetID }}. {{ showPartData.Preset }}</v-card-title
      >
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
            <v-btn color="error" variant="outlined" size="small"
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
        <v-btn color="info" block flat>บันทึกข้อมูล</v-btn>
      </v-card-actions>
      <v-card-actions>
        <v-btn color="error" @click="closeEditPartDialog" block flat
          >ปิดหน้าต่าง</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- Dialog edit Part -->
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
