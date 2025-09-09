<script>
// 1. นำเข้า components ที่จะใช้
import { InfoCircleIcon, XIcon } from "vue-tabler-icons"

export default {
  name: "WelcomeSnackbar",

  // 2. ลงทะเบียน components ที่นำเข้ามา
  components: {
    InfoCircleIcon,
    XIcon,
  },

  // 3. ย้าย state จาก ref() มาไว้ใน data()
  data() {
    return {
      showSnackbar: false,
    }
  },

  // 4. ย้าย logic ที่ทำงานเมื่อ component พร้อมใช้งานไปไว้ใน mounted()
  mounted() {
    setTimeout(() => {
      // การเข้าถึงตัวแปรใน data ต้องใช้ this
      this.showSnackbar = true
    }, 1500)
  },

  // 5. ย้ายฟังก์ชันไปไว้ใน methods
  methods: {
    close() {
      this.showSnackbar = false
    },
  },
}
</script>

<template>
  <v-snackbar
    rounded="md"
    color="secondary"
    class="mt-n3"
    v-model="showSnackbar"
    location="top right"
    elevation="0"
  >
    <div class="d-flex gap-2">
      <InfoCircleIcon size="22" />
      <div class="">
        <h5 class="text-body-1">Welcome to Materialpro</h5>
        <p class="text-12">Easy to costomize the Template!!!</p>
      </div>
    </div>
    <template v-slot:actions>
      <v-btn variant="text" @click="showSnackbar = false"> <XIcon /> </v-btn>
    </template>
  </v-snackbar>
</template>
