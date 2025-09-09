<script>
// 1. นำเข้าข้อมูลที่ต้องการใช้
import { ProgressCardsData } from "@/_mockApis/components/dashboards/ModernData"

export default {
  name: "ProgressCards",

  // 2. ส่งข้อมูลที่นำเข้ามาผ่าน data() เพื่อให้ template เรียกใช้ได้
  data() {
    return {
      ProgressCardsData: ProgressCardsData,
    }
  },
}
</script>

<template>
  <v-card elevation="10" class="earning-cards">
    <div class="d-flex flex-wrap">
      <div
        class="w-25 progress-cards"
        v-for="item in ProgressCardsData"
        :key="item.percent"
      >
        <div class="px-6 py-5">
          <h3 class="text-h3 mb-1">{{ item.percent }}</h3>
          <p class="text-14 textSecondary mb-2">{{ item.title }}</p>

          <v-progress-linear
            :model-value="item.progress"
            :color="item.progresscolor"
            bg-color="grey200"
            class="mt-2"
            rounded
            height="5"
          ></v-progress-linear>
        </div>
      </div>
    </div>
  </v-card>
</template>
