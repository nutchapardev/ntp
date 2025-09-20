<script>
import { nextTick } from "vue"
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import UiParentCard from "@/components/shared/UiParentCard.vue"
import serverService from "@/services/serverService"
import { CirclePlusIcon, TrashIcon, CircleMinusIcon } from "vue-tabler-icons"
import Swal from "sweetalert2"
import {
  checkPresetAvailability,
  checkStockAvailability,
  formatCurrency,
} from "@/utils/functions"

export default {
  name: "Ref",
  components: {
    BaseBreadcrumb,
    UiParentCard,
    CirclePlusIcon,
    CircleMinusIcon,
    TrashIcon,
  },
  data() {
    return {
      page: { title: "ข้อมูลชุดอุปกรณ์" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "ข้อมูลชุดอุปกรณ์",
          disabled: false,
          href: "#",
        },
      ],
      rules: [(v) => !!v || "This field is required"],
      BrandID: 1, // Honda
      ModelID: null,
      ModelName: null,
      PartCategoryID: null,
      PartCategoryName: null,
      brandData: null,
      partCategories: [],
      repairCategories: [],
      presets: [],
      showRepairCategoryColumn: false,
      showPresetRepairCategory: null,
      showSinglePreset: null,
      // dialog
      dialogAddModel: false,
      dialogAddPartCategory: false,
      dialogAddRepairCategory: false,
      dialogAddPreset: false,
      dialogShowPreset: false,
      // data table
      showSinglePreSetHeaders: [
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
      // data for add
      addModel: {
        Model: "",
      },
      addPartCategory: {
        PartCategoryName: "",
      },
      addRepairCategory: {
        RepairCategory: "",
        PresetID: [],
      },
      addPreset: {
        PresetID: [],
      },
    }
  },
  methods: {
    formatSeperateCurrency(total) {
      return formatCurrency(total)
    },
    async getBrandByBrandID(BrandID) {
      const response = await serverService.getBrandByBrandID(BrandID)
      this.brandData = response.data
    },
    async getPartCategory() {
      const response = await serverService.getPartCategory()
      this.partCategories = response.data
    },
    async getPresets() {
      const response = await serverService.getAllPresets()
      // console.log(response.data);

      this.presets = response.data
    },
    removePresetFromRepairCategory(PresetID) {
      if (this.showPresetRepairCategory.ref_model_category_parts.length == 1) {
        alert("ไม่สามารถลบได้ เนื่องจากต้องมีอย่างน้อย 1 รายการในกลุ่มงาน")
        return
      }

      this.showPresetRepairCategory.ref_model_category_parts =
        this.showPresetRepairCategory.ref_model_category_parts.filter(
          (e) => e.preset.PresetID != PresetID
        )

      nextTick(() => {
        this.showSinglePreset = null
      })
    },
    chooseModel(model) {
      this.ModelID = model.ModelID
      this.ModelName = model.Model
      this.repairCategories = []
      this.showRepairCategoryColumn = false
      this.closeDialogAddPartCategory()
    },
    async chooseCategory(category) {
      // console.log(category.PartCategoryID);
      this.PartCategoryName = category.PartCategoryName
      this.PartCategoryID = category.PartCategoryID
      const response =
        await serverService.getRepairCategoryByModelAndPartCategory(
          this.ModelID,
          category.PartCategoryID
        )
      // console.log(response.data);
      this.repairCategories = response.data
      this.showRepairCategoryColumn = true
    },
    chooseSinglePreset(preset) {
      this.showSinglePreset = preset
      // console.log(preset)
    },
    chooseRepairCategory(repairCategory) {
      // console.log("repairCategory", repairCategory)
      this.showPresetRepairCategory = repairCategory
      this.dialogShowPreset = true
    },
    async submitAddModel() {
      if (this.addModel.Model == "") {
        Swal.fire("Alert!", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning")
        return
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ต้องการเพิ่มรุ่นรถยนต์ ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const payload = {
            BrandID: this.brandData.BrandID,
            Model: this.addModel.Model,
          }
          const response = await serverService.addCarModel(payload)
          if (response.data.result) {
            this.closeDialogAddModel()
            this.initialize()
          } else {
            Swal.fire("Error!", response.message, "error")
            return
          }
        }
      })
    },
    async submitAddPartCategory() {
      if (this.addPartCategory.PartCategoryName == "") {
        Swal.fire("Alert!", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning")
        return
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ต้องการเพิ่มประเภทการซ่อม ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const payload = {
            PartCategoryName: this.addPartCategory.PartCategoryName,
          }
          const response = await serverService.addPartCategory(payload)
          if (response.data.result) {
            this.closeDialogAddPartCategory()
            this.getPartCategory()
          } else {
            Swal.fire("Error!", response.message, "error")
            return
          }
        }
      })
    },
    async submitAddRepairCategory() {
      if (
        this.addRepairCategory.RepairCategory == "" ||
        this.addRepairCategory.PresetID.length == 0
      ) {
        Swal.fire("Alert!", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning")
        return
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ต้องการเพิ่มประเภทกลุ่มงาน ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // console.log(this.partCategories);
          const { PresetID, RepairCategory } = this.addRepairCategory
          const payload = {
            BrandID: this.BrandID,
            ModelID: this.ModelID,
            PartCategoryID: this.PartCategoryID,
            RepairCategory,
            PresetID,
          }
          // console.log("payload", payload);

          const response = await serverService.addRepairCategoryWithRefs(
            payload
          )
          // console.log("addRepairCategoryWithRefs", response.data);

          if (response.data.result) {
            this.chooseCategory({
              PartCategoryName: this.PartCategoryName,
              PartCategoryID: this.PartCategoryID,
            })
            this.closeDialogAddRepairCategory()
            this.getPartCategory()
          } else {
            Swal.fire("Error!", response.message, "error")
            return
          }
        }
      })
    },
    async submitAddPreset() {
      if (this.addPreset.PresetID.length == 0) {
        Swal.fire("Alert!", "กรุณากรอกข้อมูลให้ครบถ้วน", "warning")
        return
      }

      Swal.fire({
        title: "Are you sure?",
        text: "ต้องการเพิ่มพรีเซ็ตข้อมูล ใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span style='color:white;'>Yes, continue!</span>",
        cancelButtonText: "<span style='color:white;'>Cancel</span>",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // console.log(this.partCategories);
          const payload = {
            // BrandID: this.BrandID,
            // ModelID: this.ModelID,
            // PartCategoryID: this.PartCategoryID,
            // RepairCategory,
            PresetID: this.addPreset.PresetID,
          }
          console.log("payload", payload)

          // const response = await serverService.addRepairCategoryWithRefs(
          //   payload
          // )
          // console.log("addRepairCategoryWithRefs", response.data);

          // if (response.data.result) {
          // this.chooseCategory({
          //   PartCategoryName: this.PartCategoryName,
          //   PartCategoryID: this.PartCategoryID,
          // })
          this.closeDialogAddPreset()
          // } else {
          //   Swal.fire("Error!", response.message, "error")
          //   return
          // }
        }
      })
    },
    checkPreset(data) {
      return checkPresetAvailability(data).summary
    },
    checkStockInPreset(data) {
      return checkStockAvailability(data)
    },
    closeDialogAddModel() {
      this.dialogAddModel = false
      this.addModel.Model = ""
    },
    closeDialogAddPartCategory() {
      this.dialogAddPartCategory = false
      this.PartCategoryID = null
      this.PartCategoryName = null
      this.showRepairCategoryColumn = false
      this.addPartCategory.PartCategoryName = ""
    },
    closeDialogAddRepairCategory() {
      this.addRepairCategory = {
        RepairCategory: "",
        PresetID: [],
      }
      this.dialogAddRepairCategory = false
    },
    closeDialogShowPreset() {
      this.dialogShowPreset = false
      nextTick(() => {
        this.showPresetRepairCategory = null
        this.showSinglePreset = null
      })
    },
    closeDialogAddPreset() {
      this.dialogAddPreset = false
      this.addPreset.PresetID = []
    },

    initialize() {
      this.getBrandByBrandID(this.BrandID)
      this.getPartCategory()
      this.getPresets()
      this.ModelID = null
      this.ModelName = null
      this.PartCategoryID = null
      this.PartCategoryName = null
      this.showPresetRepairCategory = null
      this.repairCategories = []
      this.showRepairCategoryColumn = false
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
  <!-- <UiParentCard Tableard title="ข้อมูลชุดอุปกรณ์">
    <HelloWorld />
  </UiParentCard> -->

  <div v-if="brandData != null">
    <v-row>
      <!-- Models Section -->
      <v-col cols="12" md="4">
        <UiParentCard v-if="brandData != null" Tableard title="รุ่นรถยนต์">
          <template v-slot:action>
            <div>
              <v-avatar
                color="lightprimary"
                size="32"
                @click="dialogAddModel = true"
              >
                <CirclePlusIcon class="text-primary" size="18" />
              </v-avatar>
              <v-tooltip activator="parent" location="top"
                >เพิ่มรุ่นรถยนต์</v-tooltip
              >
            </div>
          </template>
          <template v-slot:default>
            <div class="overflow-y-auto" style="height: 500px">
              <v-card
                v-for="(model, index) in brandData.models"
                :key="index"
                class="mb-3"
                max-width="344"
                link
                :color="model.Model == ModelName ? 'primary' : 'lightprimary'"
              >
                <v-list-item
                  append-icon="mdi-chevron-right"
                  lines="two"
                  :title="model.Model"
                  link
                  @click="chooseModel(model)"
                ></v-list-item>
              </v-card>
            </div>
          </template>
        </UiParentCard>
      </v-col>
      <!-- Models Section -->
      <!-- PartCategory Section -->
      <v-col cols="12" md="4">
        <UiParentCard v-if="ModelID != null" Tableard :title="`ประเภทการซ่อม`">
          <template v-slot:action>
            <div>
              <v-avatar
                color="lightprimary"
                size="32"
                @click="dialogAddPartCategory = true"
              >
                <CirclePlusIcon class="text-primary" size="18" />
              </v-avatar>
              <v-tooltip activator="parent" location="top"
                >เพิ่มประเภทการซ่อม</v-tooltip
              >
            </div>
          </template>
          <template v-slot:default>
            <div class="overflow-y-auto" style="height: 500px">
              <v-card
                v-for="(category, index) in partCategories"
                :key="index"
                class="mb-3"
                max-width="344"
                link
                :color="
                  category.PartCategoryName == PartCategoryName
                    ? 'primary'
                    : 'lightinfo'
                "
              >
                <v-list-item
                  append-icon="mdi-chevron-right"
                  lines="two"
                  :title="`${index + 1}. ${category.PartCategoryName}`"
                  link
                  @click="chooseCategory(category)"
                ></v-list-item>
              </v-card>
            </div>
          </template>
        </UiParentCard>
      </v-col>
      <!-- PartCategory Section -->
      <!-- RepairCategory Section -->
      <v-col cols="12" md="4">
        <UiParentCard
          v-if="showRepairCategoryColumn"
          Tableard
          :title="PartCategoryName"
        >
          <template v-slot:action>
            <div>
              <v-avatar
                color="lightprimary"
                size="32"
                @click="dialogAddRepairCategory = true"
              >
                <CirclePlusIcon class="text-primary" size="18" />
              </v-avatar>
              <v-tooltip activator="parent" location="top"
                >เพิ่มกลุ่มงาม</v-tooltip
              >
            </div>
          </template>
          <template v-slot:default>
            <div v-if="repairCategories.length == 0" class="text-center">
              <span>ไม่พบข้อมูล</span>
            </div>
            <div v-else class="overflow-y-auto" style="max-height: 500px">
              <v-card
                v-for="(repairCate, index) in repairCategories"
                :key="index"
                class="mb-3"
                max-width="344"
                link
                color="lightsuccess"
              >
                <v-card-text link @click="chooseRepairCategory(repairCate)">
                  <v-row>
                    <v-col cols="8">
                      {{ index + 1 }}. {{ repairCate.RepairCategory }}
                    </v-col>
                    <v-col>
                      <div
                        v-if="checkPreset(repairCate).sufficientCount > 0"
                        class="mb-1"
                      >
                        <v-btn size="sm" block color="success">
                          <span style="font-size: 13px">
                            {{ checkPreset(repairCate).sufficientCount }}
                          </span>
                        </v-btn>
                        <v-tooltip activator="parent" location="top"
                          >จำนวนพรีเซ็ตที่พร้อมใช้งาน</v-tooltip
                        >
                      </div>

                      <div v-if="checkPreset(repairCate).insufficientCount > 0">
                        <v-btn size="sm" block color="error">
                          <span style="font-size: 13px" class="text-center">
                            {{ checkPreset(repairCate).insufficientCount }}
                          </span>
                        </v-btn>
                        <v-tooltip activator="parent" location="top"
                          >จำนวนพรีเซ็ตที่ไม่พร้อมใช้งาน</v-tooltip
                        >
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
          </template>
        </UiParentCard>
      </v-col>
      <!-- RepairCategory Section -->
    </v-row>
    <!-- Dialog Add Model Section -->
    <v-dialog
      v-model="dialogAddModel"
      class="dialog-mw"
      style="max-width: 500px"
      persistent
    >
      <v-card>
        <v-card-text>
          <v-text-field
            label="ยี่ห้อ"
            v-model="brandData.Brand"
            readonly
          ></v-text-field>
          <v-text-field
            label="รุ่น"
            v-model.trim="addModel.Model"
            :rules="rules"
          ></v-text-field>
        </v-card-text>
        <hr />
        <v-card-actions>
          <v-btn
            color="primary"
            @click="submitAddModel"
            block
            flat
            variant="tonal"
            >บันทึกข้อมูล</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogAddModel" block flat
            >ปิดหน้าต่าง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Add Model Section -->
    <!-- Dialog Add Part Category Section -->
    <v-dialog
      v-model="dialogAddPartCategory"
      class="dialog-mw"
      style="max-width: 500px"
      persistent
    >
      <v-card>
        <v-card-text>
          <v-text-field
            label="ประเภทการซ่อม"
            v-model.trim="addPartCategory.PartCategoryName"
            :rules="rules"
          ></v-text-field>
        </v-card-text>
        <hr />
        <v-card-actions>
          <v-btn
            color="primary"
            @click="submitAddPartCategory"
            block
            flat
            variant="tonal"
            >บันทึกข้อมูล</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogAddPartCategory" block flat
            >ปิดหน้าต่าง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Add Part Category Section -->
    <!-- Dialog Add Repair Category Section -->
    <v-dialog
      v-model="dialogAddRepairCategory"
      class="dialog-mw"
      style="max-width: 500px"
      persistent
    >
      <v-card>
        <v-card-text>
          <v-text-field
            label="ชื่อกลุ่มงาน"
            v-model.trim="addRepairCategory.RepairCategory"
            :rules="rules"
          ></v-text-field>
          <v-select
            class="mt-2"
            v-model="addRepairCategory.PresetID"
            :items="presets"
            item-value="PresetID"
            item-title="Preset"
            label="พรีเซ็ตข้อมูล"
            chips
            multiple
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="`#${item.raw.PresetID} - ${item.raw.Preset}`"
              >
              </v-list-item>
            </template>
            <template v-slot:selection="{ item }">
              <span> #{{ item.raw.PresetID }} - {{ item.raw.Preset }} </span>
            </template>
          </v-select>
        </v-card-text>
        <hr />
        <v-card-actions>
          <v-btn
            color="primary"
            @click="submitAddRepairCategory"
            block
            flat
            variant="tonal"
            >บันทึกข้อมูล</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogAddRepairCategory" block flat
            >ปิดหน้าต่าง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Add Repair Category Section -->
    <!-- Dialog Add Preset Section Category Section -->
    <v-dialog
      v-model="dialogAddPreset"
      class="dialog-mw"
      style="max-width: 500px"
      persistent
    >
      <v-card>
        <v-card-text>
          <v-select
            class="mt-2"
            v-model="addPreset.PresetID"
            :items="presets"
            item-value="PresetID"
            item-title="Preset"
            label="พรีเซ็ตข้อมูล"
            chips
            multiple
          >
            <template v-slot:item="{ props, item }">
              <v-list-item
                v-bind="props"
                :title="`#${item.raw.PresetID} - ${item.raw.Preset}`"
              >
              </v-list-item>
            </template>
            <template v-slot:selection="{ item }">
              <span> #{{ item.raw.PresetID }} - {{ item.raw.Preset }} </span>
            </template>
          </v-select>
        </v-card-text>
        <hr />
        <v-card-actions>
          <v-btn
            color="primary"
            @click="submitAddPreset"
            block
            flat
            variant="tonal"
            >บันทึกข้อมูล</v-btn
          >
        </v-card-actions>
        <v-card-actions>
          <v-btn color="error" @click="closeDialogAddPreset()" block flat
            >ปิดหน้าต่าง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Add Preset Section Category Section -->
    <!-- Dialog Show Preset Section -->
    <v-dialog
      v-model="dialogShowPreset"
      class="dialog-mw"
      style="max-width: 1200px"
      persistent
    >
      <v-card class="pa-3" v-if="showPresetRepairCategory != null">
        <v-card-title>
          <v-row>
            <v-col cols="12" md="6">
              #{{ showPresetRepairCategory.RepairCategoryID }}.
              {{ showPresetRepairCategory.RepairCategory }}
            </v-col>
            <v-col cols="12" md="6">
              <v-row>
                <v-col cols="6" class="text-center">
                  <v-btn color="error" variant="outlined" block>
                    <CircleMinusIcon size="18" />
                    &nbsp; ลบกลุ่มงาน
                  </v-btn>
                </v-col>
                <v-col cols="6" class="text-center">
                  <v-btn color="info" block @click="dialogAddPreset = true">
                    <CirclePlusIcon size="18" />
                    &nbsp; เพิ่มพรีเซ็ต
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-card
                v-for="(
                  ref, index
                ) in showPresetRepairCategory.ref_model_category_parts"
                :key="index"
                class="mb-3 pa-0"
                link
                :color="
                  checkStockInPreset(ref.preset.presetDetails)
                    ? `success`
                    : `error`
                "
              >
                <v-card-text
                  class="text-center"
                  link
                  @click="chooseSinglePreset(ref.preset)"
                >
                  #{{ ref.preset.PresetID }}. {{ ref.preset.Preset }}
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="9" class="text-center">
              <div v-if="showSinglePreset != null">
                <h3 class="mt-0 mb-2">
                  #{{ showSinglePreset.PresetID }}.
                  {{ showSinglePreset.Preset }}
                </h3>
                <v-table class="border rounded-md">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center">ลำดับ</th>
                        <th class="text-center">รหัสอุปกรณ์</th>
                        <th class="text-center">ชื่ออุปกรณ์</th>
                        <th class="text-end">ราคาต่อหน่วย (บาท)</th>
                        <th class="text-end">จำนวนที่ใช้</th>
                        <th class="text-end">จำนวนในคลัง</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in showSinglePreset.presetDetails"
                        :key="index"
                        :style="`${
                          item.NumOfUse <= item.part.PartAmount
                            ? ''
                            : 'background-color: #ffcdd2; color: #000'
                        }`"
                      >
                        <td class="text-center">{{ index + 1 }}.</td>
                        <td>{{ item.part.PartNumber }}</td>
                        <td>{{ item.part.PartName_th }}</td>
                        <td class="text-end">
                          {{ formatSeperateCurrency(item.part.PricePerUnit) }}
                        </td>
                        <td class="text-end">{{ item.NumOfUse }}</td>
                        <td class="text-end">{{ item.part.PartAmount }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-table>
                <div class="mt-3">
                  <v-btn
                    color="error"
                    variant="outlined"
                    @click="
                      removePresetFromRepairCategory(showSinglePreset.PresetID)
                    "
                    >นำพรีเซ็ตนี้ออกจากกลุ่มงาน</v-btn
                  >
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <hr />
        <!-- <v-card-actions>
          <v-btn color="primary" block flat variant="tonal">บันทึกข้อมูล</v-btn>
        </v-card-actions> -->
        <v-card-actions>
          <v-btn color="error" @click="closeDialogShowPreset" block flat
            >ปิดหน้าต่าง</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Show Preset Section -->
  </div>
</template>
