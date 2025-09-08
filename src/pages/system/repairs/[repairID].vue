<script>
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue"
import serverService from "@/services/serverService"
import Swal from "sweetalert2"

export default {
  name: "Repairs",
  // 2. ลงทะเบียน Components ที่จะใช้ใน Template
  components: {
    BaseBreadcrumb,
  },
  // 3. ข้อมูลทั้งหมดจะถูกย้ายมาไว้ใน data()
  data() {
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
        {
          text: "รายละเอียดการซ่อม",
          disabled: false,
          href: "#",
        },
      ],
    }
  },
  // 4. ฟังก์ชันต่างๆ จะถูกย้ายมาไว้ใน methods
  computed: {
    repairID() {
      return this.$route.params.repairID
    },
  },
  mounted() {
    // this.initialize()
  },
}
</script>

<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  {{ repairID }}
</template>
