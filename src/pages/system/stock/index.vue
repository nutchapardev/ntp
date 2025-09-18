<script>
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";

export default {
  name: "Stocks",
  // 2. ลงทะเบียน Components ที่จะใช้ใน Template
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  // 3. ข้อมูลทั้งหมดจะถูกย้ายมาไว้ใน data()
  data() {
    return {
      page: { title: "ข้อมูลสินค้าคงคลัง" },
      breadcrumbs: [
        {
          text: "System",
          disabled: false,
          href: "#",
        },
        {
          text: "ข้อมูลสินค้าคงคลัง",
          disabled: false,
          href: "#",
        },
      ],
    };
  },
};
</script>
<template>
  <BaseBreadcrumb
    :title="page.title"
    :breadcrumbs="breadcrumbs"
  ></BaseBreadcrumb>
  <UiParentCard Tableard title="ข้อมูลอะไหล่รถยนต์">
    <StockTable />
  </UiParentCard>
</template>
