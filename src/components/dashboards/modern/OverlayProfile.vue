<script>
// 1. นำเข้ารูปภาพที่ต้องการใช้
import bg from "@/assets/images/backgrounds/socialbg.jpg"

export default {
  name: "UserProfileHeader",

  // 2. ส่งข้อมูลรูปภาพที่นำเข้ามาผ่าน data() เพื่อให้ template เรียกใช้ได้
  data() {
    return {
      bg: bg,
    }
  },
}
</script>

<template>
  <VCard elevation="0" class="overflow-hidden">
    <v-img
      :src="bg"
      class="align-center"
      gradient="to bottom, rgba(7, 10, 43, .8), rgba(7, 10, 43, .8)"
      height="388px"
      cover
    >
      <div class="text-center">
        <v-avatar size="100">
          <img
            src="@/assets/images/profile/user-2.jpg"
            width="100"
            alt="user"
          />
        </v-avatar>
        <h5 class="text-h5 text-white pt-6">James Anderson</h5>
        <p class="text-white text-14 pt-2">@jamesandre</p>
        <p class="text-white text-15 pt-2 px-8">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt
        </p>
      </div>
    </v-img>
  </VCard>
</template>
