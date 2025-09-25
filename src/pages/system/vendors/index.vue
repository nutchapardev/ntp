<script>
import { nextTick } from "vue";
import BaseBreadcrumb from "@/components/shared/BaseBreadcrumb.vue";
import UiParentCard from "@/components/shared/UiParentCard.vue";

export default {
  name: "Vendors",
  components: {
    BaseBreadcrumb,
    UiParentCard,
  },
  data() {
    return {
      page: { title: "ข้อมูลคู่ค้า" },
      breadcrumbs: [
        {
          text: "Customers and Vendors",
          disabled: false,
          href: "#",
        },
        {
          text: "ข้อมูลคู่ค้า",
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
  <UiParentCard Tableard title="ตารางข้อมูลคู่ค้า">
    <VendorTable />
  </UiParentCard>
</template>
