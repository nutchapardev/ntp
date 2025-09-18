<script>
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";
import serverService from "@/services/serverService";

export default {
  name: "Ref",
  components: {
    BaseBreadcrumb,
    UiParentCard,
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
      BrandID: 1, // Honda
      ModelID: null,
      ModelName: null,
      brandData: null,
      partCategories: [],
      repairCategories: [],
      showRepairCategoryColumn: false,
      col_1: 4,
      col_2: 4,
      col_3: 4,
    };
  },
  methods: {
    async getBrandByBrandID(BrandID) {
      const response = await serverService.getBrandByBrandID(BrandID);
      this.brandData = response.data;
    },
    async getPartCategory() {
      const response = await serverService.getPartCategory();
      this.partCategories = response.data;
    },
    chooseModel(model) {
      this.ModelID = model.ModelID;
      this.ModelName = model.Model;
      this.repairCategories = [];
      this.showRepairCategoryColumn = false;
    },
    async chooseCategory(category) {
      console.log(category.PartCategoryID);
      const response =
        await serverService.getRepairCategoryByModelAndPartCategory(
          this.ModelID,
          category.PartCategoryID
        );
      console.log(response.data);
      this.repairCategories = response.data;
      this.showRepairCategoryColumn = true;

    },
    chooseRepairCategory(repairCategory) {
      console.log("repairCategory", repairCategory);
    },
    initialize() {
      this.getBrandByBrandID(this.BrandID);
      this.getPartCategory();
    },
  },
  mounted() {
    this.initialize();
  },
};
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
      <v-col :cols="col_1">
        <UiParentCard v-if="brandData != null" Tableard title="รุ่นรถยนต์">
          <div class="overflow-y-auto" style="height: 500px">
            <v-card
              v-for="(model, index) in brandData.models"
              :key="index"
              class="mb-3"
              max-width="344"
              link
              color="lightprimary"
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
        </UiParentCard>
      </v-col>
      <v-col :cols="col_2">
        <UiParentCard
          v-if="ModelID != null"
          Tableard
          :title="`ประเภทการซ่อม (${ModelName})`"
        >
          <div class="overflow-y-auto" style="height: 500px">
            <v-card
              v-for="(category, index) in partCategories"
              :key="index"
              class="mb-3"
              max-width="344"
              link
              color="lightinfo"
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
        </UiParentCard>
      </v-col>
      <v-col :cols="col_3">
        <UiParentCard
          v-if="showRepairCategoryColumn"
          Tableard
          :title="`กลุ่มงาน (${ModelName})`"
        >
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
              color="lighterror"
            >
              <v-list-item
                append-icon="mdi-chevron-right"
                lines="two"
                :title="`${index + 1}. ${repairCate.RepairCategory}`"
                link
                @click="chooseRepairCategory(repairCate)"
              ></v-list-item>
            </v-card>
          </div>
        </UiParentCard>
      </v-col>
    </v-row>
  </div>
</template>
