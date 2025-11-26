<script>
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import CreateRepairDetail from "@/components/repair/CreateRepairDetail.vue";

export default {
  name: "RepairDetails",
  // 2. ลงทะเบียน Components ที่จะใช้ใน Template
  components: {
    BaseBreadcrumb,
    CreateRepairDetail,
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
    };
  },
};
</script>

<template>
  <div>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <CreateRepairDetail />
  </div>
</template>
