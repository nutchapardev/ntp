<template>
  <v-card elevation="10" class="overflow-hidden">
    <v-card-item class="v-card-item bg-primary pt-4 pb-2">
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title class="text-h5"><Logo /></v-card-title>
        <slot name="action"></slot>
      </div>
    </v-card-item>
    <v-divider></v-divider>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
// 1. นำเข้า component ที่จะใช้งาน
import Logo from "@/layouts/full/logo/Logo.vue"

export default {
  name: "AuthCard",

  // 2. ลงทะเบียน component ที่นำเข้ามา
  components: {
    Logo,
  },
}
</script>
